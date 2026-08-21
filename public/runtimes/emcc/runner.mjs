// C/C++ WebAssembly runner (self-hosted Wasm-Clang via browsercc).
//
// Assets in this folder (self-hosted, no CDN):
//   index.js / clang.js / clang.wasm / lld.js / lld.wasm / sysroot.tar
//     -> from the `browsercc` npm package (MIT), a Clang/LLVM build to WASM.
//   wasi-shim/  -> @bjorn3/browser_wasi_shim (MIT/Apache), the WASI runtime
//     used to actually execute the produced .wasm and capture stdout.
//
// Multi-file support: each .c/.cpp is compiled to its own object, then all
// objects are linked together with wasm-ld (mimicking what the Clang driver
// would do). Headers (.h/.hpp) are placed on the in-memory FS so #include works.

import {
  Clang,
  LLD,
  setUpSysroot,
  getCompilerInvocation,
} from "./index.js";
import { WASI, File, OpenFile, ConsoleStdout } from "./wasi-shim/index.js";

let sysrootCache = null;
async function getSysroot() {
  if (!sysrootCache) {
    const buf = await (
      await fetch(new URL("sysroot.tar", import.meta.url).href)
    ).arrayBuffer();
    sysrootCache = buf;
  }
  return sysrootCache;
}

function stdFor(name) {
  if (name.endsWith(".cpp") || name.endsWith(".cc") || name.endsWith(".cxx"))
    return "-std=c++20";
  return "-std=c11";
}

function isCpp(name) {
  return name.endsWith(".cpp") || name.endsWith(".cc") || name.endsWith(".cxx");
}

// browsercc's README notes WASI lacks C++ exceptions, so disable them for C++
// (otherwise the linked object references __cxa_throw / __cxa_allocate_exception
// which are not provided by the WASI sysroot).
function flagsFor(name) {
  const base = [stdFor(name), "-O1", "-w"];
  if (isCpp(name)) base.push("-fno-exceptions");
  return base;
}

export async function createRunner() {
  return {
    async compileAndRun(sources) {
      const cSources = sources.filter(
        (s) =>
          s.name.endsWith(".c") ||
          s.name.endsWith(".cpp") ||
          s.name.endsWith(".cc") ||
          s.name.endsWith(".cxx"),
      );
      const hSources = sources.filter(
        (s) => s.name.endsWith(".h") || s.name.endsWith(".hpp"),
      );
      if (!cSources.length) {
        return { output: "No C/C++ source files to compile." };
      }

      const decoder = new TextDecoder();
      let compileErrors = "";

      try {
        const sysroot = await getSysroot();
        const mainSrc = cSources[0];
        const mainInv = await getCompilerInvocation(
          mainSrc.name,
          mainSrc.content,
          flagsFor(mainSrc.name),
        );

        // Emscripten's callMain is not safe to invoke twice on one instance, so
        // each translation unit gets its own fresh clang instance. We also ask
        // getCompilerInvocation per source so every TU gets its exact, correct
        // cc1 command. browsercc's clang is built as clang++ and forces `-x c++`
        // even on .c files, so we override the language for plain C sources.
        const objects = [];
        for (const s of cSources) {
          const inv = await getCompilerInvocation(
            s.name,
            s.content,
            flagsFor(s.name),
          );
          let cc1 = inv.compilerArgs.slice();
          if (!isCpp(s.name)) {
            const xi = cc1.indexOf("-x");
            if (xi >= 0 && cc1[xi + 1] === "c++") cc1[xi + 1] = "c";
          }
          const clang = await Clang({
            thisProgram: "clang++",
            printErr: (d) => {
              compileErrors += d + "\n";
            },
          });
          clang.FS.writeFile(s.name, s.content);
          for (const h of hSources) clang.FS.writeFile(h.name, h.content);
          setUpSysroot(clang, sysroot, undefined);
          const code = clang.callMain(cc1);
          if (code !== 0) {
            return {
              output:
                compileErrors ||
                `Compilation failed for ${s.name} (exit ${code}).`,
            };
          }
          const obj = clang.FS.readFile(inv.compilerArtifact, {
            encoding: "binary",
          });
          objects.push({ name: inv.compilerArtifact, data: obj });
        }

        const lld = await LLD({
          thisProgram: "wasm-ld",
          printErr: (d) => {
            compileErrors += d + "\n";
          },
        });
        for (const o of objects) lld.FS.writeFile(o.name, o.data);
        setUpSysroot(lld, sysroot, undefined);

        const linkerArgs = mainInv.linkerArgs.slice();
        // Pure-C projects don't need the C++ standard library.
        if (!cSources.some((s) => isCpp(s.name))) {
          for (let i = linkerArgs.length - 1; i >= 0; i--) {
            if (linkerArgs[i] === "-lc++" || linkerArgs[i] === "-lc++abi")
              linkerArgs.splice(i, 1);
          }
        }
        const mainIdx = linkerArgs.indexOf(mainInv.compilerArtifact);
        const allNames = objects.map((o) => o.name);
        if (mainIdx >= 0) linkerArgs.splice(mainIdx, 1, ...allNames);
        else linkerArgs.unshift(...allNames);

        const linkCode = lld.callMain(linkerArgs);
        if (linkCode !== 0) {
          return { output: compileErrors || `Link failed (exit ${linkCode}).` };
        }
        const wasm = lld.FS.readFile(mainInv.linerArtifact, {
          encoding: "binary",
        });
        const module = await WebAssembly.compile(wasm);

        let output = "";
        const capture = (data) => {
          output += decoder.decode(data);
        };
        const fds = [
          new OpenFile(new File([])),
          new ConsoleStdout(capture),
          new ConsoleStdout(capture),
        ];
        const wasi = new WASI([], [], fds);
        const instance = await WebAssembly.instantiate(module, {
          wasi_snapshot_preview1: wasi.wasiImport,
        });
        wasi.start(instance);
        return { output };
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return {
          output:
            (compileErrors ? compileErrors + "\n" : "") +
            `C/C++ run error: ${msg}`,
        };
      }
    },
  };
}

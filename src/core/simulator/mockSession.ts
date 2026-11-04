import type {
  Diagnostic,
  RunRequest,
  SerialFeed,
  SerialLine,
  SessionState,
  SimulatorHost,
  SimulatorSessionApi,
  SimulatorSessionConfig,
} from "./types";

const MAX_SERIAL_LINES = 400;
const MAX_DIAGNOSTICS = 120;

const BUILD_LATENCY_MS = 550;
const UPLOAD_LATENCY_MS = 420;
const START_LATENCY_MS = 260;
const PAUSE_LATENCY_MS = 60;
const RESET_LATENCY_MS = 90;

const TICK_INTERVAL_MS = 200;
const MAX_TICK_DELTA_MS = 1000;
const NS_PER_MS = 1_000_000;

const BOOT_BANNER = "PixelCode mock runtime ready (Arduino Uno)";

export const hashSketch = (code: string): string => {
  let hash = 5381;
  for (let index = 0; index < code.length; index += 1) {
    hash = ((hash << 5) + hash + code.charCodeAt(index)) | 0;
  }
  return `0x${(hash >>> 0).toString(16).padStart(8, "0")}`;
};

interface SketchInspection {
  error: { message: string; line?: number; column?: number } | null;
  ledPattern: {
    startsHigh: boolean;
    highDurationNs: number;
    lowDurationNs: number;
  } | null;
}

const inspectSketch = (source: string): SketchInspection => {
  const visible = source.split("");
  const stack: { char: string; index: number }[] = [];
  let mode: "code" | "line" | "block" | "string" | "char" = "code";
  let escaped = false;
  let blockStart = -1;
  let quoteStart = -1;
  const locate = (index: number) => {
    const prefix = source.slice(0, index).split("\n");
    return { line: prefix.length, column: prefix[prefix.length - 1].length + 1 };
  };
  const error = (message: string, index?: number) => ({
    message,
    ...(index === undefined ? {} : locate(index)),
  });
  const fail = (message: string, index?: number): SketchInspection => ({
    error: error(message, index),
    ledPattern: null,
  });

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];

    if (mode === "line") {
      if (char === "\n") mode = "code";
      else visible[index] = " ";
      continue;
    }
    if (mode === "block") {
      if (char === "*" && next === "/") {
        visible[index] = visible[index + 1] = " ";
        index += 1;
        mode = "code";
      } else if (char !== "\n") visible[index] = " ";
      continue;
    }
    if (mode === "string" || mode === "char") {
      if (char === "\n" && !escaped) {
        return {
          ...fail(mode === "string" ? "Unterminated string literal" : "Unterminated character literal", quoteStart),
        };
      }
      if (char !== "\n") visible[index] = " ";
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if ((mode === "string" && char === '"') || (mode === "char" && char === "'")) mode = "code";
      continue;
    }

    if (char === "/" && next === "/") {
      visible[index] = visible[index + 1] = " ";
      index += 1;
      mode = "line";
      continue;
    }
    if (char === "/" && next === "*") {
      blockStart = index;
      visible[index] = visible[index + 1] = " ";
      index += 1;
      mode = "block";
      continue;
    }
    if (char === '"') {
      visible[index] = " ";
      quoteStart = index;
      mode = "string";
      continue;
    }
    if (char === "'") {
      visible[index] = " ";
      quoteStart = index;
      mode = "char";
      continue;
    }
    if (char === "{" || char === "(" || char === "[") {
      stack.push({ char, index });
      continue;
    }
    if (char === "}" || char === ")" || char === "]") {
      const opening = stack.pop();
      const expected = char === "}" ? "{" : char === ")" ? "(" : "[";
      if (!opening || opening.char !== expected) {
        return fail("Unexpected '" + char + "'", index);
      }
    }
  }

  if (mode === "block") {
    return fail("Unterminated block comment", blockStart);
  }
  if (mode === "string" || mode === "char") {
    return {
      ...fail(mode === "string" ? "Unterminated string literal" : "Unterminated character literal", quoteStart),
    };
  }
  if (stack.length > 0) {
    const opening = stack[stack.length - 1];
    const closing = opening.char === "{" ? "}" : opening.char === "(" ? ")" : "]";
    return fail("Expected '" + closing + "'", opening.index);
  }

  const code = visible.join("");
  for (const fn of ["setup", "loop"]) {
    const definition = new RegExp("\\bvoid\\s+" + fn + "\\s*\\(\\s*(?:void\\s*)?\\)\\s*\\{", "i");
    if (!definition.test(code)) {
      return fail("Missing required Arduino function: " + fn + "().");
    }
  }

  const loopDefinition = /\bvoid\s+loop\s*\(\s*(?:void\s*)?\)\s*\{/i.exec(code);
  const loopStart = loopDefinition ? loopDefinition.index + loopDefinition[0].lastIndexOf("{") : -1;
  let loopDepth = 0;
  let loopEnd = loopStart;
  for (let index = loopStart; index >= 0 && index < code.length; index += 1) {
    if (code[index] === "{") loopDepth += 1;
    if (code[index] === "}") {
      loopDepth -= 1;
      if (loopDepth === 0) {
        loopEnd = index;
        break;
      }
    }
  }
  const loopCode = loopStart >= 0 ? code.slice(loopStart + 1, loopEnd) : code;
  const aliases = new Set(["LED_BUILTIN", "13"]);
  const aliasSources = [
    /\b(?:const\s+)?(?:unsigned\s+)?(?:int|byte|uint8_t|uint16_t|unsigned\s+char)\s+([A-Za-z_]\w*)\s*=\s*(LED_BUILTIN|13)\s*;/gi,
    /^\s*#\s*define\s+([A-Za-z_]\w*)\s+(LED_BUILTIN|13)\b/gim,
  ];
  for (const pattern of aliasSources) {
    for (const match of code.matchAll(pattern)) {
      if (match[1]) aliases.add(match[1]);
    }
  }
  const targetPattern = [...aliases].join("|");
  const writePattern = new RegExp(
    "\\bdigitalWrite\\s*\\(\\s*(?:" + targetPattern + ")\\s*,\\s*(HIGH|1|LOW|0)\\s*\\)",
    "gi",
  );
  const writes = [...loopCode.matchAll(writePattern)].map((match) => ({
    index: match.index ?? 0,
    end: (match.index ?? 0) + match[0].length,
    high: /^(?:HIGH|1)$/i.test(match[1]),
  }));
  const firstHigh = writes.find((write) => write.high);
  const firstLow = writes.find((write) => !write.high);
  if (!firstHigh || !firstLow) return { error: null, ledPattern: null };

  const initialWrite = writes[0];
  const delayAfter = (write: typeof firstHigh): number | null => {
    const nextWrite = writes.find((candidate) => candidate.index >= write.end);
    const until = nextWrite?.index ?? loopCode.length;
    const delayMatch = /\bdelay\s*\(\s*(\d+)\s*\)/i.exec(
      loopCode.slice(write.end, until),
    );
    if (!delayMatch) return null;
    const delayMs = Number(delayMatch[1]);
    if (!Number.isFinite(delayMs)) return null;
    return Math.min(Math.max(delayMs, 100), 10000) * NS_PER_MS;
  };
  const highDurationNs = delayAfter(firstHigh);
  const lowDurationNs = delayAfter(firstLow);
  if (highDurationNs === null || lowDurationNs === null) {
    return { error: null, ledPattern: null };
  }

  return {
    error: null,
    ledPattern: {
      startsHigh: initialWrite?.high ?? true,
      highDurationNs,
      lowDurationNs,
    },
  };
};

const createSessionState = (
  initial?: {
    path: string;
    content: string;
  },
  engineKind: "mock" | "local" = "mock",
): SessionState => ({
  runtime: "idle",
  operation: { kind: null, generation: 0 },
  generation: 0,
  sketchPath: initial?.path ?? "sketch.ino",
  draftHash: hashSketch(initial?.content ?? ""),
  activeHash: null,
  buildError: null,
  status: { running: false, paused: false, simTimeNs: 0, d13: false },
  serial: [],
  diagnostics: [],
  engine: {
    engine: engineKind,
    hardware: "uno",
    buildMode: "client-mock",
    serialMonitor: true,
  },
  connection: { phase: "connected" },
});

const appendSerialLine = (feed: SerialFeed, entry: Omit<SerialLine, "id">, nextId: number) => {
  const next = [...feed, { ...entry, id: nextId }];
  return next.length > MAX_SERIAL_LINES ? next.slice(next.length - MAX_SERIAL_LINES) : next;
};

const appendDiagnostic = (list: Diagnostic[], item: Diagnostic) => {
  const next = [...list, item];
  return next.length > MAX_DIAGNOSTICS ? next.slice(next.length - MAX_DIAGNOSTICS) : next;
};

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });

export const createMockSimulatorSession = (
  config: SimulatorSessionConfig = {},
): SimulatorSessionApi => {
  const host: SimulatorHost = config.host ?? {};
  let disposed = false;
  let ledPattern: SketchInspection["ledPattern"] = null;
  let ledCurrentHigh = false;
  let serialCursor = 0;

  let state: SessionState = createSessionState(config.initialSketch, config.engineKind);
  const listeners = new Set<(next: SessionState) => void>();

  let tickTimer: ReturnType<typeof setInterval> | null = null;
  let lastTickAt = 0;
  let nextSerialAtNs = 0;

  const notify = () => {
    for (const listener of listeners) {
      listener(state);
    }
  };

  const commit = (mutate: (draft: SessionState) => void) => {
    state = {
      ...state,
      operation: { ...state.operation },
      status: { ...state.status },
      connection: { ...state.connection },
    };
    mutate(state);
    notify();
  };

    const beginOperation = (kind: NonNullable<SessionState["operation"]["kind"]>) => {
  const generation = state.generation + 1;
    commit((draft) => {
      draft.generation = generation;
      draft.operation = { kind, generation };
    });
    return generation;
  };

  const startTick = () => {
    if (tickTimer !== null) return;
    lastTickAt = Date.now();
    tickTimer = setInterval(() => {
      const now = Date.now();
      const deltaMs = Math.min(Math.max(0, now - lastTickAt), MAX_TICK_DELTA_MS);
      lastTickAt = now;
      if (state.runtime !== "running") return;
      const simTimeNs = state.status.simTimeNs + deltaMs * NS_PER_MS;
      let serial = state.serial;
      const emitted: SerialLine[] = [];

      while (ledPattern && simTimeNs >= nextSerialAtNs) {
        ledCurrentHigh = !ledCurrentHigh;
        const on = ledCurrentHigh;
        const entry: SerialLine = {
          id: ++serialCursor,
          direction: "out",
          text: "mock: LED_BUILTIN " + (on ? "HIGH" : "LOW") + " (D13) @T+" + (nextSerialAtNs / 1e9).toFixed(1) + "s",
          simTimeNs: nextSerialAtNs,
          timestamp: now,
        };
        emitted.push(entry);
        serial = appendSerialLine(serial, entry, entry.id);
        nextSerialAtNs += on ? ledPattern.highDurationNs : ledPattern.lowDurationNs;
      }

      emitted.forEach((entry) => host.onSerial?.(entry));
      commit((draft) => {
        draft.status.simTimeNs = simTimeNs;
        draft.status.d13 = ledPattern !== null && ledCurrentHigh;
        draft.serial = serial;
      });
    }, TICK_INTERVAL_MS);
  };

  const stopTick = () => {
    if (tickTimer !== null) {
      clearInterval(tickTimer);
      tickTimer = null;
    }
  };

  const run = async (req: RunRequest) => {
    if (disposed) return;
    const generation = beginOperation("build");
    stopTick();
    ledPattern = null;
    ledCurrentHigh = false;
    nextSerialAtNs = 0;
    commit((draft) => {
      draft.runtime = "starting";
      draft.status = { ...draft.status, running: false, paused: false, d13: false };
    });
    host.onRuntime?.("starting");
    await sleep(BUILD_LATENCY_MS);
    if (state.operation.generation !== generation) return;

    const content = req.sketchContent;
    const hasSource = content.trim().length > 0;
    const buildHash = hasSource ? hashSketch(content) : state.draftHash;
    const inspection = inspectSketch(content);
    if (!hasSource || inspection.error) {
      const message = !hasSource
        ? "Sketch is empty — add setup() and loop() before building."
        : inspection.error?.message ?? "Sketch could not be built.";
      const failurePhase = state.activeHash !== null ? "ready" : "idle";
      const diagnostic: Diagnostic = {
        id: "build-" + (++serialCursor),
        severity: "error",
        message,
        line: inspection.error?.line,
        column: inspection.error?.column,
        source: "compiler",
        timestamp: Date.now(),
      };
      commit((draft) => {
        draft.buildError = { severity: "error", message, origin: "build" };
        draft.diagnostics = appendDiagnostic(draft.diagnostics, diagnostic);
        draft.draftHash = buildHash;
        draft.operation = { kind: null, generation };
        draft.runtime = failurePhase;
        draft.status = { ...draft.status, running: false, paused: false, d13: false };
      });
      host.onDiagnostics?.(diagnostic);
      host.onRuntime?.(failurePhase);
      return;
    }

    ledPattern = inspection.ledPattern;
    ledCurrentHigh = ledPattern?.startsHigh ?? false;
    commit((draft) => {
      draft.buildError = null;
      draft.draftHash = buildHash;
      draft.sketchPath = req.sketchPath;
      draft.operation = { kind: "upload", generation };
    });

    await sleep(UPLOAD_LATENCY_MS);
    if (state.operation.generation !== generation) return;



    commit((draft) => {
      draft.activeHash = buildHash;
      draft.operation = { kind: "start", generation };
    });

    await sleep(START_LATENCY_MS);
    if (state.operation.generation !== generation) return;

    stopTick();
    nextSerialAtNs = ledPattern
      ? ledCurrentHigh
        ? ledPattern.highDurationNs
        : ledPattern.lowDurationNs
      : 0;
    const now = Date.now();
    const boot: Omit<SerialLine, "id"> = {
      direction: "out",
      text: BOOT_BANNER,
      simTimeNs: 0,
      timestamp: now,
    };
    let serial = appendSerialLine([], boot, ++serialCursor);
    if (ledPattern) {
      const ledStart: Omit<SerialLine, "id"> = {
        direction: "out",
        text: "mock: LED_BUILTIN " + (ledCurrentHigh ? "HIGH" : "LOW") + " (D13)",
        simTimeNs: 0,
        timestamp: now,
      };
      serial = appendSerialLine(serial, ledStart, ++serialCursor);
    }

    const running: SessionState = { ...state };
    running.serial = serial;
    running.status = {
      running: true,
      paused: false,
      simTimeNs: 0,
      d13: ledPattern !== null && ledCurrentHigh,
    };
    running.runtime = "running";
    running.operation = { kind: null, generation };
    running.buildError = null;
    state = running;
    serial.forEach((entry) => host.onSerial?.(entry));
    host.onRuntime?.("running");
    notify();
    startTick();
  };

  const pause = async () => {
    if (disposed || state.runtime !== "running") return;
    const generation = beginOperation("pause");
    await sleep(PAUSE_LATENCY_MS);
    if (state.operation.generation !== generation) return;
    stopTick();
    commit((draft) => {
      draft.status = { ...draft.status, paused: true, running: false };
      draft.runtime = "paused";
      draft.operation = { kind: null, generation };
    });
    host.onRuntime?.("paused");
  };

  const resume = async () => {
    if (disposed || state.runtime !== "paused") return;
    const generation = beginOperation("resume");
    await sleep(PAUSE_LATENCY_MS);
    if (state.operation.generation !== generation) return;
    lastTickAt = Date.now();
    commit((draft) => {
      draft.status = { ...draft.status, paused: false, running: true };
      draft.runtime = "running";
      draft.operation = { kind: null, generation };
    });
    host.onRuntime?.("running");
    startTick();
  };

  const reset = async () => {
    if (disposed || state.runtime === "idle" || state.runtime === "starting") return;

    const generation = beginOperation("reset");
    stopTick();
    await sleep(RESET_LATENCY_MS);
    if (state.operation.generation !== generation) return;
    nextSerialAtNs = 0;
    commit((draft) => {
      draft.status = { paused: false, running: false, simTimeNs: 0, d13: false };
      ledCurrentHigh = false;
      draft.runtime = state.activeHash !== null ? "ready" : "idle";
      draft.serial = [];
      draft.operation = { kind: null, generation };
    });
    host.onRuntime?.(state.runtime);
  };

  const setSketch = (path: string, content: string) => {
    commit((draft) => {
      draft.sketchPath = path;
      draft.draftHash = hashSketch(content);
    });
  };

  const clearSerial = () => {
    commit((draft) => {
      draft.serial = [];
    });
  };

  const clearDiagnostics = () => {
    commit((draft) => {
      draft.diagnostics = [];
      draft.buildError = null;
    });
  };

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    stopTick();
    const generation = state.generation + 1;
    state = { ...state, generation, operation: { kind: null, generation } };
    listeners.clear();
  };
  notify();

  return {
    getState: () => state,
    subscribe: (listener) => {
      disposed = false;
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    setSketch,
    run,
    pause,
    resume,
    reset,
    clearSerial,
    clearDiagnostics,
    dispose,
  } satisfies SimulatorSessionApi;
};

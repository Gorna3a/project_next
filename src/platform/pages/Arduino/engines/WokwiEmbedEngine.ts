import {
  hashSketch,
  type Diagnostic,
  type RunRequest,
  type SerialLine,
  type SessionState,
  type SimulatorHost,
  type SimulatorSessionApi,
  type SimulatorSessionConfig,
} from "@core/simulator";
import {
  buildWokwiEmbedUrl,
  isWokwiErrorResult,
  isWokwiEventMessage,
  isWokwiHelloMessage,
  isWokwiPortHandshake,
  isWokwiResponseMessage,
  isWokwiSerialDataPayload,
  WOKWI_COMMAND_TIMEOUT_MS,
  WOKWI_CONNECT_TIMEOUT_MS,
  WOKWI_DEFAULT_ORIGIN,
  WOKWI_SERIAL_EVENT,
  type WokwiCommandMessage,
  type WokwiCommandName,
  type WokwiEventMessage,
  type WokwiResponseMessage,
  type WokwiSimStatusResult,
} from "./wokwi/protocol";

const MAX_SERIAL_LINES = 400;
const MAX_DIAGNOSTICS = 120;
const STATUS_POLL_MS = 500;

const FIRMWARE_HEX_FILE = "sketch.ino.hex";
const FIRMWARE_ELF_FILE = "sketch.ino.elf";
const DIAGRAM_FILE = "diagram.json";

const UNO_DIAGRAM = JSON.stringify(
  {
    version: 1,
    author: "PixelCode",
    editor: "wokwi",
    parts: [
      {
        type: "wokwi-arduino-uno",
        id: "uno",
        top: 0,
        left: 0,
        attrs: {},
      },
    ],
    connections: [],
  },
  null,
  2,
);

export interface WokwiFirmwareSource {
  hexUrl: string;
  elfUrl: string;
}

export interface WokwiEmbedEngineConfig extends SimulatorSessionConfig {
  clientId: string;
  embedOrigin?: string;
  embedDark?: boolean;
  firmware: WokwiFirmwareSource;
  commandTimeoutMs?: number;
  connectTimeoutMs?: number;
}

interface HandshakeWaiter {
  resolve: () => void;
  reject: (error: Error) => void;
  timer: ReturnType<typeof setTimeout>;
}

interface PendingCommand {
  resolve: (value: unknown) => void;
  reject: (error: Error) => void;
  timer: ReturnType<typeof setTimeout>;
}

const toErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

const bytesToBase64 = (bytes: Uint8Array): string => {
  let binary = "";
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(
      ...Array.from(bytes.subarray(offset, offset + chunkSize)),
    );
  }
  return btoa(binary);
};

const createInitialState = (config: WokwiEmbedEngineConfig): SessionState => ({
  runtime: "idle",
  operation: { kind: null, generation: 0 },
  generation: 0,
  sketchPath: config.initialSketch?.path ?? "sketch.ino",
  draftHash: hashSketch(config.initialSketch?.content ?? ""),
  activeHash: null,
  buildError: null,
  status: { running: false, paused: false, simTimeNs: 0, d13: false },
  serial: [],
  diagnostics: [],
  engine: {
    engine: "wokwi",
    hardware: "uno",
    buildMode: "precompiled",
    serialMonitor: true,
  },
  connection: { phase: "disconnected" },
});

export class WokwiEmbedEngine implements SimulatorSessionApi {
  private readonly host: SimulatorHost;
  private readonly embedOrigin: string;
  private readonly embedUrl: string;
  private readonly firmwareSource: WokwiFirmwareSource;
  private readonly commandTimeoutMs: number;
  private readonly connectTimeoutMs: number;
  private readonly decoder = new TextDecoder();

  private state: SessionState;
  private readonly listeners = new Set<(next: SessionState) => void>();

  private iframe: HTMLIFrameElement | null = null;
  private port: MessagePort | null = null;
  private handshakeWaiters: HandshakeWaiter[] = [];
  private readonly pending = new Map<string, PendingCommand>();
  private commandCounter = 0;
  private serialCounter = 0;
  private diagnosticCounter = 0;
  private loadCount = 0;
  private lastHandshakeAt = 0;
  private serialBuffer = "";
  private statusTimer: ReturnType<typeof setInterval> | null = null;
  private statusInFlight = false;
  private diagramUpload: Promise<void> | null = null;
  private firmwareCache: Promise<{ hexText: string; elfBase64: string }> | null =
    null;
  private precompiledNoticeShown = false;

  constructor(config: WokwiEmbedEngineConfig) {
    this.host = config.host ?? {};
    this.embedOrigin = new URL(config.embedOrigin ?? WOKWI_DEFAULT_ORIGIN).origin;
    this.embedUrl = buildWokwiEmbedUrl({
      clientId: config.clientId,
      origin: this.embedOrigin,
      dark: config.embedDark ?? true,
    });
    this.firmwareSource = config.firmware;
    this.commandTimeoutMs = config.commandTimeoutMs ?? WOKWI_COMMAND_TIMEOUT_MS;
    this.connectTimeoutMs = config.connectTimeoutMs ?? WOKWI_CONNECT_TIMEOUT_MS;
    this.state = createInitialState(config);
  }

  getState(): SessionState {
    return this.state;
  }

  subscribe(listener: (state: SessionState) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  mount(container: HTMLElement): void {
    if (this.iframe) {
      if (this.iframe.parentElement === container) return;
      this.unmount();
    }
    this.loadCount = 0;
    this.diagramUpload = null;
    this.setConnection("connecting");

    window.addEventListener("message", this.handleWindowMessage);

    const iframe = document.createElement("iframe");
    iframe.title = "Wokwi Arduino simulator";
    iframe.className = "h-full w-full border-0";
    iframe.setAttribute("allow", "clipboard-write; fullscreen");
    iframe.addEventListener("load", this.handleFrameLoad);
    iframe.src = this.embedUrl;
    container.appendChild(iframe);
    this.iframe = iframe;
  }

  unmount(): void {
    this.stopStatusPoll();
    this.rejectPending("Wokwi simulator unmounted");
    this.rejectHandshakeWaiters("Wokwi simulator unmounted");
    this.closePort();

    const iframe = this.iframe;
    if (iframe) {
      iframe.removeEventListener("load", this.handleFrameLoad);
      iframe.remove();
    }
    this.iframe = null;

    window.removeEventListener("message", this.handleWindowMessage);

    this.loadCount = 0;
    this.diagramUpload = null;
    this.serialBuffer = "";
    if (this.state.connection.phase !== "disconnected") {
      this.setConnection("disconnected");
    }
  }

  setSketch(path: string, content: string): void {
    this.update((draft) => {
      draft.sketchPath = path;
      draft.draftHash = hashSketch(content);
    });
  }

  async run(req: RunRequest): Promise<void> {
    const wasActive =
      this.state.runtime === "running" || this.state.runtime === "paused";
    const generation = this.beginOperation("build");
    this.setRuntime("starting");
    this.stopStatusPoll();

    try {
      await this.waitForHandshake();
    } catch (error) {
      if (this.isCurrent(generation)) {
        this.failOperation(generation, "Wokwi connection failed", error);
      }
      return;
    }
    if (!this.isCurrent(generation)) return;

    try {
      await this.ensureDiagramUploaded();
    } catch (error) {
      if (this.isCurrent(generation)) {
        this.failOperation(generation, "Hardware diagram upload failed", error);
      }
      return;
    }
    if (!this.isCurrent(generation)) return;

    let firmware: { hexText: string; elfBase64: string };
    try {
      firmware = await this.loadFirmware();
    } catch (error) {
      if (this.isCurrent(generation)) {
        this.failOperation(generation, "Firmware unavailable", error);
      }
      return;
    }
    if (!this.isCurrent(generation)) return;

    const sketchHash = hashSketch(req.sketchContent);
    this.update((draft) => {
      draft.operation = { kind: "upload", generation };
      draft.buildError = null;
      draft.sketchPath = req.sketchPath;
      draft.draftHash = sketchHash;
    });

    try {
      if (wasActive) {
        await this.sendCommand("sim:restart", { pause: true });
      }
      await this.sendCommand("file:upload", {
        name: FIRMWARE_HEX_FILE,
        text: firmware.hexText,
      });
      await this.sendCommand("file:upload", {
        name: FIRMWARE_ELF_FILE,
        binary: firmware.elfBase64,
      });
      if (!this.isCurrent(generation)) return;
      this.update((draft) => {
        draft.operation = { kind: "start", generation };
        draft.status = { running: false, paused: false, simTimeNs: 0, d13: false };
      });
      await this.sendCommand("sim:start", {
        firmware: FIRMWARE_HEX_FILE,
        elf: FIRMWARE_ELF_FILE,
      });
    } catch (error) {
      if (this.isCurrent(generation)) {
        this.failOperation(generation, "Wokwi start failed", error);
      }
      return;
    }
    if (!this.isCurrent(generation)) return;

    this.update((draft) => {
      draft.activeHash = sketchHash;
      draft.runtime = "running";
      draft.status = { running: true, paused: false, simTimeNs: 0, d13: false };
      draft.operation = { kind: null, generation };
    });
    this.host.onRuntime?.("running");
    this.startStatusPoll();

    if (!this.precompiledNoticeShown) {
      this.precompiledNoticeShown = true;
      this.reportDiagnostic(
        "warning",
        "Firmware is precompiled from env assets; the editor sketch is not rebuilt by Wokwi yet.",
      );
    }
  }

  async pause(): Promise<void> {
    if (this.state.runtime !== "running") return;
    const generation = this.beginOperation("pause");
    try {
      await this.sendCommand("sim:pause");
    } catch (error) {
      if (this.isCurrent(generation)) {
        this.failOperation(generation, "Pause failed", error);
      }
      return;
    }
    if (!this.isCurrent(generation)) return;

    this.stopStatusPoll();
    this.update((draft) => {
      draft.runtime = "paused";
      draft.status = { ...draft.status, running: false, paused: true };
      draft.operation = { kind: null, generation };
    });
    this.host.onRuntime?.("paused");
  }

  async resume(): Promise<void> {
    if (this.state.runtime !== "paused") return;
    const generation = this.beginOperation("resume");
    try {
      await this.sendCommand("sim:resume");
    } catch (error) {
      if (this.isCurrent(generation)) {
        this.failOperation(generation, "Resume failed", error);
      }
      return;
    }
    if (!this.isCurrent(generation)) return;

    this.update((draft) => {
      draft.runtime = "running";
      draft.status = { ...draft.status, running: true, paused: false };
      draft.operation = { kind: null, generation };
    });
    this.host.onRuntime?.("running");
    this.startStatusPoll();
  }

  async reset(): Promise<void> {
    if (this.state.runtime === "idle" || this.state.runtime === "starting") return;
    const generation = this.beginOperation("reset");
    try {
      await this.sendCommand("sim:restart", { pause: true });
    } catch (error) {
      if (this.isCurrent(generation)) {
        this.failOperation(generation, "Reset failed", error);
      }
      return;
    }
    if (!this.isCurrent(generation)) return;

    this.stopStatusPoll();
    this.serialBuffer = "";
    this.update((draft) => {
      draft.status = { running: false, paused: false, simTimeNs: 0, d13: false };
      draft.runtime = draft.activeHash !== null ? "ready" : "idle";
      draft.serial = [];
      draft.operation = { kind: null, generation };
    });
    this.host.onRuntime?.(this.state.runtime);
  }

  clearSerial(): void {
    this.update((draft) => {
      draft.serial = [];
    });
  }

  clearDiagnostics(): void {
    this.update((draft) => {
      draft.diagnostics = [];
      draft.buildError = null;
    });
  }

  dispose(): void {
    this.unmount();
    this.stopStatusPoll();
    this.listeners.clear();
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  private update(mutate: (draft: SessionState) => void): void {
    const draft: SessionState = {
      ...this.state,
      operation: { ...this.state.operation },
      status: { ...this.state.status },
      connection: { ...this.state.connection },
    };
    mutate(draft);
    this.state = draft;
    this.notify();
  }

  private setConnection(
    phase: SessionState["connection"]["phase"],
    detail?: string,
  ): void {
    this.update((draft) => {
      draft.connection = detail ? { phase, detail } : { phase };
    });
  }

  private setRuntime(runtime: SessionState["runtime"]): void {
    this.update((draft) => {
      draft.runtime = runtime;
    });
    this.host.onRuntime?.(runtime);
  }

  private beginOperation(
    kind: NonNullable<SessionState["operation"]["kind"]>,
  ): number {
    const generation = this.state.generation + 1;
    this.update((draft) => {
      draft.generation = generation;
      draft.operation = { kind, generation };
    });
    return generation;
  }

  private isCurrent(generation: number): boolean {
    return this.state.operation.generation === generation;
  }

  private failOperation(
    generation: number,
    context: string,
    error: unknown,
  ): void {
    const message = `${context}: ${toErrorMessage(error)}`;
    this.reportDiagnostic("error", message);
    this.stopStatusPoll();
    this.update((draft) => {
      draft.operation = { kind: null, generation };
      draft.buildError = { severity: "error", message, origin: "build" };
      draft.runtime = draft.activeHash !== null ? "ready" : "stopped";
    });
    this.host.onRuntime?.(this.state.runtime);
  }

  private reportDiagnostic(
    severity: Diagnostic["severity"],
    message: string,
  ): void {
    const item: Diagnostic = {
      id: `wokwi-${++this.diagnosticCounter}`,
      severity,
      message,
      source: "engine",
      timestamp: Date.now(),
    };
    this.update((draft) => {
      const next = [...draft.diagnostics, item];
      draft.diagnostics =
        next.length > MAX_DIAGNOSTICS
          ? next.slice(next.length - MAX_DIAGNOSTICS)
          : next;
    });
    this.host.onDiagnostics?.(item);
  }

  private appendSerial(entry: Omit<SerialLine, "id">): void {
    const line: SerialLine = { ...entry, id: ++this.serialCounter };
    this.update((draft) => {
      const next = [...draft.serial, line];
      draft.serial =
        next.length > MAX_SERIAL_LINES
          ? next.slice(next.length - MAX_SERIAL_LINES)
          : next;
    });
    this.host.onSerial?.(line);
  }

  private handleWindowMessage = (event: MessageEvent): void => {
    const iframe = this.iframe;
    if (!iframe || event.source !== iframe.contentWindow) return;
    if (event.origin !== this.embedOrigin) return;

    let port: MessagePort | null = null;
    if (isWokwiPortHandshake(event.data)) {
      port = event.data.port;
    } else if (event.ports.length > 0) {
      port = event.ports[0];
    }
    if (!port) return;
    this.acceptPort(port);
  };

  private handleFrameLoad = (): void => {
    this.loadCount += 1;
    if (this.loadCount <= 1) return;

    const handshakeIsFresh = Date.now() - this.lastHandshakeAt < 3_000;
    this.rejectPending("Wokwi simulator frame reloaded");
    this.stopStatusPoll();
    this.diagramUpload = null;
    this.serialBuffer = "";

    if (handshakeIsFresh && this.port) return;

    this.rejectHandshakeWaiters("Wokwi simulator frame reloaded");
    this.closePort();
    this.setConnection("lost", "Wokwi frame reloaded");

    if (
      this.state.runtime === "running" ||
      this.state.runtime === "paused" ||
      this.state.runtime === "starting"
    ) {
      this.setRuntime("stopped");
    }
    this.reportDiagnostic(
      "warning",
      "Wokwi simulator frame reloaded; run again to reconnect.",
    );
  };

  private acceptPort(port: MessagePort): void {
    if (this.port === port) return;
    this.closePort();
    this.port = port;
    port.onmessage = (event: MessageEvent) => {
      this.handlePortMessage(event.data);
    };
    port.start();
  }

  private handlePortMessage(raw: unknown): void {
    if (isWokwiHelloMessage(raw)) {
      void this.handleHello();
      return;
    }
    if (isWokwiEventMessage(raw)) {
      this.handleEngineEvent(raw);
      return;
    }
    if (isWokwiResponseMessage(raw)) {
      this.handleResponse(raw);
    }
  }

  private async handleHello(): Promise<void> {
    this.lastHandshakeAt = Date.now();
    this.setConnection("connected");
    this.resolveHandshakeWaiters();

    try {
      await this.sendCommand("serial-monitor:listen");
    } catch (error) {
      this.reportDiagnostic(
        "warning",
        `Serial monitor subscription failed: ${toErrorMessage(error)}`,
      );
    }

    try {
      await this.ensureDiagramUploaded();
    } catch (error) {
      this.reportDiagnostic(
        "error",
        `Hardware diagram upload failed: ${toErrorMessage(error)}`,
      );
    }
  }

  private handleEngineEvent(message: WokwiEventMessage): void {
    const simIsLive =
      this.state.runtime === "running" || this.state.runtime === "paused";
    this.update((draft) => {
      draft.status.simTimeNs = Math.max(draft.status.simTimeNs, message.nanos);
      if (simIsLive) {
        draft.status.paused = message.paused;
        draft.status.running = !message.paused;
      }
    });

    if (message.event === WOKWI_SERIAL_EVENT) {
      this.handleSerialPayload(message.payload);
    }
  }

  private handleSerialPayload(payload: unknown): void {
    if (!isWokwiSerialDataPayload(payload)) return;

    this.serialBuffer += this.decoder.decode(Uint8Array.from(payload.bytes), {
      stream: true,
    });
    const lines = this.serialBuffer.split(/\r?\n/);
    this.serialBuffer = lines.pop() ?? "";
    const simTimeNs = this.state.status.simTimeNs;
    const timestamp = Date.now();

    for (const line of lines) {
      if (line.length === 0) continue;
      this.appendSerial({ direction: "out", text: line, simTimeNs, timestamp });
    }
  }

  private handleResponse(message: WokwiResponseMessage): void {
    const pending = this.pending.get(message.id);
    if (!pending) return;
    this.pending.delete(message.id);
    clearTimeout(pending.timer);

    if (message.error) {
      const detail = isWokwiErrorResult(message.result)
        ? `Wokwi error ${message.result.code}: ${message.result.message}`
        : "Wokwi command failed";
      pending.reject(new Error(detail));
      return;
    }
    pending.resolve(message.result);
  }

  private sendCommand<TParams = unknown, TResult = unknown>(
    command: WokwiCommandName,
    params?: TParams,
  ): Promise<TResult> {
    const port = this.port;
    if (!port) {
      return Promise.reject(new Error("Wokwi simulator is not connected"));
    }

    const id = String(++this.commandCounter);
    return new Promise<TResult>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`Wokwi command timed out (${command})`));
      }, this.commandTimeoutMs);

      this.pending.set(id, {
        resolve: (value: unknown) => resolve(value as TResult),
        reject,
        timer,
      });

      const message: WokwiCommandMessage<TParams> = {
        type: "command",
        command,
        params,
        id,
      };
      port.postMessage(message);
    });
  }

  private waitForHandshake(): Promise<void> {
    if (this.port !== null && this.state.connection.phase === "connected") {
      return Promise.resolve();
    }
    if (!this.iframe) {
      return Promise.reject(new Error("Simulator pane is not mounted"));
    }

    return new Promise<void>((resolve, reject) => {
      const waiter: HandshakeWaiter = {
        resolve,
        reject,
        timer: setTimeout(() => {
          this.handshakeWaiters = this.handshakeWaiters.filter(
            (item) => item !== waiter,
          );
          reject(new Error("Timed out waiting for the Wokwi handshake"));
        }, this.connectTimeoutMs),
      };
      this.handshakeWaiters.push(waiter);
    });
  }

  private resolveHandshakeWaiters(): void {
    const waiters = this.handshakeWaiters;
    this.handshakeWaiters = [];
    for (const waiter of waiters) {
      clearTimeout(waiter.timer);
      waiter.resolve();
    }
  }

  private rejectHandshakeWaiters(reason: string): void {
    const waiters = this.handshakeWaiters;
    this.handshakeWaiters = [];
    for (const waiter of waiters) {
      clearTimeout(waiter.timer);
      waiter.reject(new Error(reason));
    }
  }

  private rejectPending(reason: string): void {
    const entries = [...this.pending.values()];
    this.pending.clear();
    for (const entry of entries) {
      clearTimeout(entry.timer);
      entry.reject(new Error(reason));
    }
  }

  private closePort(): void {
    const port = this.port;
    if (!port) return;
    this.port = null;
    port.onmessage = null;
    port.close();
  }

  private ensureDiagramUploaded(): Promise<void> {
    if (this.diagramUpload === null) {
      const upload = this.sendCommand("file:upload", {
        name: DIAGRAM_FILE,
        text: UNO_DIAGRAM,
      }).then(() => undefined);
      this.diagramUpload = upload;
      upload.catch(() => {
        if (this.diagramUpload === upload) this.diagramUpload = null;
      });
    }
    return this.diagramUpload;
  }

  private loadFirmware(): Promise<{ hexText: string; elfBase64: string }> {
    if (this.firmwareCache === null) {
      this.firmwareCache = this.fetchFirmware();
    }
    return this.firmwareCache;
  }

  private async fetchFirmware(): Promise<{
    hexText: string;
    elfBase64: string;
  }> {
    try {
      const [hexResponse, elfResponse] = await Promise.all([
        fetch(this.firmwareSource.hexUrl),
        fetch(this.firmwareSource.elfUrl),
      ]);
      if (!hexResponse.ok) {
        throw new Error(
          `Firmware hex missing at ${this.firmwareSource.hexUrl} (HTTP ${hexResponse.status})`,
        );
      }
      if (!elfResponse.ok) {
        throw new Error(
          `Firmware elf missing at ${this.firmwareSource.elfUrl} (HTTP ${elfResponse.status})`,
        );
      }
      const hexText = await hexResponse.text();
      const elfBase64 = bytesToBase64(
        new Uint8Array(await elfResponse.arrayBuffer()),
      );
      return { hexText, elfBase64 };
    } catch (error) {
      this.firmwareCache = null;
      throw error;
    }
  }

  private startStatusPoll(): void {
    this.stopStatusPoll();
    this.statusTimer = setInterval(() => {
      void this.pollStatus();
    }, STATUS_POLL_MS);
  }

  private stopStatusPoll(): void {
    if (this.statusTimer !== null) {
      clearInterval(this.statusTimer);
      this.statusTimer = null;
    }
  }

  private async pollStatus(): Promise<void> {
    if (this.statusInFlight || this.port === null) return;
    this.statusInFlight = true;
    try {
      const status = await this.sendCommand<unknown, WokwiSimStatusResult>(
        "sim:status",
      );
      if (status && typeof status.nanos === "number") {
        this.update((draft) => {
          draft.status.simTimeNs = Math.max(draft.status.simTimeNs, status.nanos);
        });
      }
    } catch {
      this.stopStatusPoll();
    } finally {
      this.statusInFlight = false;
    }
  }
}

export const createWokwiSimulatorSession = (
  config: WokwiEmbedEngineConfig,
): SimulatorSessionApi => new WokwiEmbedEngine(config);

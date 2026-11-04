export type RuntimePhase =
  | "idle"
  | "ready"
  | "starting"
  | "running"
  | "paused"
  | "stopped";

export type OperationKind =
  | "build"
  | "upload"
  | "start"
  | "pause"
  | "resume"
  | "reset"
  | null;

export interface SimError {
  severity: "error" | "warning";
  message: string;
  origin: "build" | "runtime";
}

export interface Diagnostic {
  id: string;
  severity: SimError["severity"];
  message: string;
  line?: number;
  column?: number;
  source: "compiler" | "engine" | "mock";
  timestamp: number;
}

export interface SerialLine {
  id: number;
  direction: "out" | "in";
  text: string;
  simTimeNs: number;
  timestamp: number;
}

export type SerialFeed = SerialLine[];

export type HardwareTarget = "uno" | "mega" | "nano";

export type EngineKind = "mock" | "wokwi" | "local";

export type BuildMode = "client-mock" | "precompiled";

export interface EngineCapabilities {
  engine: EngineKind;
  hardware: HardwareTarget;
  buildMode: BuildMode;
  serialMonitor: boolean;
}

export type EngineConnectionPhase =
  | "disconnected"
  | "connecting"
  | "connected"
  | "lost";

export interface EngineConnectionState {
  phase: EngineConnectionPhase;
  detail?: string;
}

export interface SimStatus {
  running: boolean;
  paused: boolean;
  simTimeNs: number;
  d13: boolean;
}

export interface SimFirmware {
  sketchPath: string;
  digest: string;
  bytes: number;
}

export interface RunRequest {
  sketchPath: string;
  sketchContent: string;
}

export interface SessionState {
  runtime: RuntimePhase;
  operation: { kind: OperationKind; generation: number };
  generation: number;
  sketchPath: string;
  draftHash: string;
  activeHash: string | null;
  buildError: SimError | null;
  status: SimStatus;
  serial: SerialFeed;
  diagnostics: Diagnostic[];
  engine: EngineCapabilities;
  connection: EngineConnectionState;
}

export interface SimulatorHost {
  onRuntime?(_phase: RuntimePhase): void;
  onDiagnostics?(_item: Diagnostic): void;
  onSerial?(_line: SerialLine): void;
}

export interface SimulatorSessionApi {
  getState(): SessionState;
  subscribe(listener: (state: SessionState) => void): () => void;
  setSketch(_path: string, _content: string): void;
  run(_req: RunRequest): Promise<void>;
  pause(): Promise<void>;
  resume(): Promise<void>;
  reset(): Promise<void>;
  clearSerial(): void;
  clearDiagnostics(): void;
  mount?(_container: HTMLElement): void;
  unmount?(): void;
  dispose(): void;
}

export interface SimulatorSessionConfig {
  host?: SimulatorHost;
  initialSketch?: { path: string; content: string };
  engineKind?: "mock" | "local";
}

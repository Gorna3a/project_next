export const WOKWI_EMBED_PATH = "/experimental/embed";
export const WOKWI_DEFAULT_ORIGIN = "https://wokwi.com";
export const WOKWI_SERIAL_EVENT = "serial-monitor:data";
export const WOKWI_COMMAND_TIMEOUT_MS = 10_000;
export const WOKWI_CONNECT_TIMEOUT_MS = 20_000;

export interface WokwiErrorResult {
  code: number;
  message: string;
}

export interface WokwiHelloMessage {
  type: "hello";
  [key: string]: unknown;
}

export interface WokwiEventMessage<TPayload = unknown> {
  type: "event";
  event: string;
  payload: TPayload;
  nanos: number;
  paused: boolean;
}

export interface WokwiResponseMessage<TResult = unknown> {
  type: "response";
  id: string;
  result: TResult;
  error?: boolean;
}

export type WokwiInboundMessage =
  | WokwiHelloMessage
  | WokwiEventMessage
  | WokwiResponseMessage;

export interface WokwiSerialDataPayload {
  bytes: number[];
}

export interface WokwiSimStatusResult {
  running: boolean;
  nanos: number;
}

export interface WokwiPortHandshake {
  port: MessagePort;
}

export type WokwiCommandName =
  | "file:upload"
  | "sim:start"
  | "sim:pause"
  | "sim:resume"
  | "sim:restart"
  | "sim:status"
  | "serial-monitor:listen";

export interface WokwiFileUploadParams {
  name: string;
  text?: string;
  binary?: string;
}

export interface WokwiSimStartParams {
  firmware: string;
  elf: string;
}

export interface WokwiSimRestartParams {
  pause?: boolean;
}

export interface WokwiSimResumeParams {
  pauseAfter?: number;
}

export interface WokwiCommandMessage<TParams = unknown> {
  type: "command";
  command: WokwiCommandName;
  params?: TParams;
  id: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const isWokwiPortHandshake = (value: unknown): value is WokwiPortHandshake => {
  if (!isRecord(value)) return false;
  if (typeof MessagePort === "undefined") return false;
  return value.port instanceof MessagePort;
};

export const isWokwiHelloMessage = (value: unknown): value is WokwiHelloMessage =>
  isRecord(value) && value.type === "hello";

export const isWokwiEventMessage = (value: unknown): value is WokwiEventMessage =>
  isRecord(value) &&
  value.type === "event" &&
  typeof value.event === "string" &&
  typeof value.nanos === "number" &&
  typeof value.paused === "boolean";

export const isWokwiResponseMessage = (value: unknown): value is WokwiResponseMessage =>
  isRecord(value) && value.type === "response" && typeof value.id === "string";

export const isWokwiInboundMessage = (value: unknown): value is WokwiInboundMessage =>
  isWokwiHelloMessage(value) ||
  isWokwiEventMessage(value) ||
  isWokwiResponseMessage(value);

export const isWokwiSerialDataPayload = (
  value: unknown,
): value is WokwiSerialDataPayload => {
  if (!isRecord(value) || !Array.isArray(value.bytes)) return false;
  return value.bytes.every((byte) => typeof byte === "number");
};

export const isWokwiErrorResult = (value: unknown): value is WokwiErrorResult =>
  isRecord(value) && typeof value.code === "number" && typeof value.message === "string";

export interface WokwiEmbedUrlOptions {
  clientId: string;
  origin?: string;
  dark?: boolean;
}

export const buildWokwiEmbedUrl = ({
  clientId,
  origin = WOKWI_DEFAULT_ORIGIN,
  dark = true,
}: WokwiEmbedUrlOptions): string => {
  const base = new URL(origin);
  if (base.protocol !== "https:") {
    throw new Error("Wokwi embed origin must use https");
  }
  base.pathname = WOKWI_EMBED_PATH;
  base.search = "";
  base.hash = "";
  base.searchParams.set("client_id", clientId);
  base.searchParams.set("dark", dark ? "1" : "0");
  return base.toString();
};

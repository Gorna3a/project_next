import {
  createMockSimulatorSession,
  type SimulatorSessionApi,
  type SimulatorSessionConfig,
} from "@core/simulator";
import {
  createWokwiSimulatorSession,
  type WokwiEmbedEngineConfig,
} from "./WokwiEmbedEngine";

const ARDUINO_ENGINE = (
  process.env.NEXT_PUBLIC_ARDUINO_ENGINE ?? "mock"
)
  .trim()
  .toLowerCase();

const WOKWI_CLIENT_ID = (
  process.env.NEXT_PUBLIC_WOKWI_CLIENT_ID ?? ""
).trim();

const FIRMWARE_HEX_URL =
  process.env.NEXT_PUBLIC_ARDUINO_FIRMWARE_HEX_URL ?? "/arduino/blink.hex";
const FIRMWARE_ELF_URL =
  process.env.NEXT_PUBLIC_ARDUINO_FIRMWARE_ELF_URL ?? "/arduino/blink.elf";

export const createArduinoSimulatorSession = (
  config: SimulatorSessionConfig = {},
): SimulatorSessionApi => {
  if (ARDUINO_ENGINE === "wokwi") {
    if (!WOKWI_CLIENT_ID) {
      console.warn(
        "[arduino] NEXT_PUBLIC_WOKWI_CLIENT_ID is not set; falling back to the mock simulator.",
      );
      return createMockSimulatorSession({ ...config, engineKind: "mock" });
    }

    const engineConfig: WokwiEmbedEngineConfig = {
      ...config,
      clientId: WOKWI_CLIENT_ID,
      firmware: {
        hexUrl: FIRMWARE_HEX_URL,
        elfUrl: FIRMWARE_ELF_URL,
      },
    };

    return createWokwiSimulatorSession(engineConfig);
  }

  const engineKind = ARDUINO_ENGINE === "local" ? "local" : "mock";
  return createMockSimulatorSession({ ...config, engineKind });
};

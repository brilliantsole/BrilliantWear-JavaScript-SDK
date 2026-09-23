import BaseScanner from "./BaseScanner.ts";
import { createConsole } from "../utils/Console.ts";
import Device from "../Device.ts";
import { Singleton } from "../utils/TypeScriptUtils.ts";

const _console = createConsole("NullScanner", { log: false });

@Singleton
class NullScanner extends BaseScanner {
  static get isSupported() {
    return true;
  }

  static readonly shared: NullScanner;

  readonly connectionType = "none";

  // SCANNING
  get isScanning() {
    return false;
  }

  // AVAILABILITY
  get isScanningAvailable() {
    return false;
  }

  // RESET
  get canReset() {
    return false;
  }

  // DEVICES
  #devices: { [bluetoothId: string]: Device } = {};
  get devices() {
    return this.#devices;
  }
}

export default NullScanner.shared;

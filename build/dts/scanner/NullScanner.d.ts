import BaseScanner from "./BaseScanner.ts";
import Device from "../Device.ts";
declare class NullScanner extends BaseScanner {
    #private;
    static get isSupported(): boolean;
    static readonly shared: NullScanner;
    readonly connectionType = "none";
    get isScanning(): boolean;
    get isScanningAvailable(): boolean;
    get canReset(): boolean;
    get devices(): {
        [bluetoothId: string]: Device;
    };
}
declare const _default: NullScanner;
export default _default;

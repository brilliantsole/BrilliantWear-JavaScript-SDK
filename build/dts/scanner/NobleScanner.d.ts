import BaseScanner from "./BaseScanner.ts";
import { ClientConnectionType } from "../connection/BaseConnectionManager.ts";
export declare const NobleStates: readonly ["unknown", "resetting", "unsupported", "unauthorized", "poweredOff", "poweredOn"];
export type NobleState = (typeof NobleStates)[number];
declare class NobleScanner extends BaseScanner {
    #private;
    static readonly shared: NobleScanner;
    readonly connectionType = "bluetooth";
    constructor();
    startScan(): boolean;
    stopScan(): boolean;
    get canReset(): boolean;
    reset(): void;
    connectToDevice(bluetoothId: string, connectionType?: ClientConnectionType): Promise<void>;
    disconnectFromDevice(bluetoothId: string): Promise<void>;
}
export { NobleScanner };
declare const _default: NobleScanner;
export default _default;

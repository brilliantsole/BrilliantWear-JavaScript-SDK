import type { BluetoothLowEnergyPlugin } from './definitions';
interface InstallBluetoothLowEnergyShimOptions {
    root?: typeof globalThis;
    isNativePlatform?: boolean;
    isPluginAvailable?: boolean;
}
export declare function installBluetoothLowEnergyShim(plugin: BluetoothLowEnergyPlugin, options?: InstallBluetoothLowEnergyShimOptions): void;
export {};

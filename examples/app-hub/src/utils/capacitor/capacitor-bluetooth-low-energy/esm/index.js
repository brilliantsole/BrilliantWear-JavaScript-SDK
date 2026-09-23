import { registerPlugin } from "@capacitor/core";
import { installBluetoothLowEnergyShim } from "./shim.js";
const BluetoothLowEnergy = registerPlugin("BluetoothLowEnergy", {
  web: () =>
    import("./web.js").then((module) => new module.BluetoothLowEnergyWeb()),
});
BluetoothLowEnergy.shimWebBluetooth = () => {
  installBluetoothLowEnergyShim(BluetoothLowEnergy);
};
export * from "./definitions.js";
export { BluetoothLowEnergy, installBluetoothLowEnergyShim };
//# sourceMappingURL=index.js.map

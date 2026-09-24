import { waitForGlobals } from "../../utils/cross-origin-storage-utils.js";

const { BW } = await waitForGlobals();

import {
  BluetoothLowEnergy,
  installBluetoothLowEnergyShim,
} from "@capgo/capacitor-bluetooth-low-energy";
console.log("BluetoothLowEnergy", BluetoothLowEnergy);

class BluetoothLowEnergyScanner extends BW.BaseScanner {
  // FILL
}

import { BleClient } from "@capacitor-community/bluetooth-le";
console.log("BleClient", BleClient);

class BluetoothLeScanner extends BW.BaseScanner {
  // FILL
}
// FILL - create scanner

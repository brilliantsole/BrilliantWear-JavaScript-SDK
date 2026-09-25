import { waitForGlobals } from "../../utils/cross-origin-storage-utils.js";

const { BW } = await waitForGlobals();

import { Capacitor } from "@capacitor/core";
console.log("Capacitor", Capacitor);

import { BluetoothLowEnergy } from "@capgo/capacitor-bluetooth-low-energy";
console.log("BluetoothLowEnergy", BluetoothLowEnergy);

class BluetoothLowEnergyConnectionManager
  extends BW.BluetoothConnectionManager {
  // FILL
}
const isWeb = Capacitor.getPlatform() == "web";

class BluetoothLowEnergyScanner extends BW.BaseScanner {
  // FILL - isScanning
  // FILL - discoveredDevice
  // FILL - connect/disconnect
  // FILL - connectionManager

  constructor() {
    super();

    if (isWeb) {
      return;
    }

    BluetoothLowEnergy.addListener("deviceScanned", (event) => {
      const { device } = event;
      console.log("deviceScanned", device);
      const { deviceId, name, manufacturerData, serviceUuids, rssi } = device;
      // FILL
    });
    BluetoothLowEnergy.addListener("deviceConnected", (event) => {
      console.log("deviceConnected", event);
      const { deviceId } = event;
      // FILL
    });
    BluetoothLowEnergy.addListener("deviceDisconnected", (event) => {
      console.log("deviceDisconnected", event);
      const { deviceId } = event;
      // FILL
    });
    BluetoothLowEnergy.addListener("characteristicChanged", (event) => {
      console.log("characteristicChanged", event);
      const { deviceId, service, characteristic, value } = event;
      // FILL
    });

    this.#initialize();
  }

  async #initialize() {
    await BluetoothLowEnergy.initialize();
    const { available } = await BluetoothLowEnergy.isAvailable();
    console.log({ available });
    if (available) {
      await this.#checkEnabledTimer.start(true);
      if (this.isScanningAvailable) {
        await this.stopScan();
      }
    }
  }

  async #checkEnabled() {
    console.log("#checkEnabled");
    const { enabled } = await BluetoothLowEnergy.isEnabled();
    // console.log({ enabled });
    this._isScanning = this.isScanning && enabled;
    this._isScanningAvailable = enabled;
  }
  #checkEnabledTimer = new BW.Timer(this.#checkEnabled.bind(this), 5000);

  async startScan() {
    if (!super.startScan()) {
      return false;
    }
    await BluetoothLowEnergy.startScan({
      services: BW.BluetoothUUIDs.serviceUUIDs,
      timeout: 0,
      allowDuplicates: true,
    });
    this._isScanning = true;
    return true;
  }
  async stopScan() {
    if (!super.stopScan()) {
      return;
    }
    await BluetoothLowEnergy.stopScan();
    this._isScanning = false;
    return true;
  }
}

import { BleClient } from "@capacitor-community/bluetooth-le";
console.log("BleClient", BleClient);

class BleClientConnectionManager extends BW.BluetoothConnectionManager {
  // FILL
}
class BleClientScanner extends BW.BaseScanner {
  // FILL
}

if (true || !isWeb) {
  let scanner;
  if (true) {
    scanner = new BluetoothLowEnergyScanner();
  } else {
    scanner = new BleClientScanner();
  }
  console.log("scanner", scanner);
}

// FILL - select which as the default

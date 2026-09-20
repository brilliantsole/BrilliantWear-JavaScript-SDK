import { waitForGlobals } from "../../../../utils/cross-origin-storage-utils.js";
const { litSignals, BW } = await waitForGlobals();
const { signal } = litSignals;

/** @typedef {import("../../../../../../../build/brilliantwear.module.js").Device} Device */
/** @typedef {import("../../../../../../../build/brilliantwear.module.js").DiscoveredDevice} DiscoveredDevice */

/** @type {import("@lit-labs/signals").Signal.State<string[]>} */
export const availableDeviceBluetoothIdsSignal = signal([]);

BW.DeviceManager.addEventListener("availableDevice", (event) => {
  const { device } = event.message;
  // console.log("availableDevice", device);

  const deviceBluetoothIds = availableDeviceBluetoothIdsSignal.get();
  if (deviceBluetoothIds.includes(device.bluetoothId)) {
    return;
  }
  availableDeviceBluetoothIdsSignal.set([
    ...deviceBluetoothIds,
    device.bluetoothId,
  ]);
});
BW.DeviceManager.addEventListener("unavailableDevice", (event) => {
  const { device } = event.message;
  // console.log("unavailableDevice", device);

  const deviceBluetoothIds = availableDeviceBluetoothIdsSignal.get();
  if (!deviceBluetoothIds.includes(device.bluetoothId)) {
    return;
  }
  availableDeviceBluetoothIdsSignal.set(
    deviceBluetoothIds.filter(
      (bluetoothId) => device.bluetoothId != bluetoothId,
    ),
  );
});

BW.ScannerManager.addEventListener("scannerDiscoveredDevice", (event) => {
  const { discoveredDevice } = event.message;
  // console.log("scannerDiscoveredDevice", discoveredDevice);

  const deviceBluetoothIds = availableDeviceBluetoothIdsSignal.get();
  if (deviceBluetoothIds.includes(discoveredDevice.bluetoothId)) {
    return;
  }
  availableDeviceBluetoothIdsSignal.set([
    ...deviceBluetoothIds,
    discoveredDevice.bluetoothId,
  ]);
});
BW.ScannerManager.addEventListener(
  "scannerExpiredDiscoveredDevice",
  (event) => {
    const { discoveredDevice } = event.message;
    // console.log("scannerExpiredDiscoveredDevice", discoveredDevice);

    const deviceBluetoothIds = availableDeviceBluetoothIdsSignal.get();
    if (!deviceBluetoothIds.includes(discoveredDevice.bluetoothId)) {
      return;
    }
    availableDeviceBluetoothIdsSignal.set(
      deviceBluetoothIds.filter(
        (bluetoothId) => bluetoothId != discoveredDevice.bluetoothId,
      ),
    );
  },
);

/** @type {import("@lit-labs/signals").Signal.State<string[]>} */
export const connectedDeviceBluetoothIdsSignal = signal([]);

BW.DeviceManager.addEventListener("deviceConnected", (event) => {
  const { device } = event.message;
  // console.log("deviceConnected", device);

  const deviceBluetoothIds = connectedDeviceBluetoothIdsSignal.get();
  if (deviceBluetoothIds.includes(device.bluetoothId)) {
    return;
  }
  connectedDeviceBluetoothIdsSignal.set([
    ...deviceBluetoothIds,
    device.bluetoothId,
  ]);
});
BW.DeviceManager.addEventListener("deviceNotConnected", (event) => {
  const { device } = event.message;
  // console.log("unavailableDevice", device);

  const deviceBluetoothIds = connectedDeviceBluetoothIdsSignal.get();
  if (!deviceBluetoothIds.includes(device.bluetoothId)) {
    return;
  }
  connectedDeviceBluetoothIdsSignal.set(
    deviceBluetoothIds.filter(
      (bluetoothId) => device.bluetoothId != bluetoothId,
    ),
  );
});

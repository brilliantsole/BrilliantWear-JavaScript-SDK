import { createContext } from "./createContext.js";

/** @typedef {{isBluetoothAvailable: boolean , isBluetoothEnabled: boolean, isBluetoothScanning}} BluetoothContextState */

/** @returns {Promise<BluetoothContextState>} */
const getBluetoothState = async () => {
  const isBluetoothAvailable = Boolean(
    await navigator.bluetooth?.getAvailability(),
  );
  const isBluetoothEnabled = isBluetoothAvailable;
  const isBluetoothScanning = false;
  return {
    isBluetoothAvailable,
    isBluetoothEnabled,
    isBluetoothScanning,
  };
};

const {
  createContextProvider: createBluetoothContextProvider,
  createContextConsumer: createBluetoothContextConsumer,
} = await createContext("bluetooth", {
  defaultState: await getBluetoothState(),
  onProviderHostConnection: (provider, abortController) => {},
});

export { createBluetoothContextProvider, createBluetoothContextConsumer };

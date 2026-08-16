import { waitForGlobals } from "../../utils/cross-origin-storage-utils.js";
import { createContext } from "./createContext.js";

const isBatteryManagerAvailable = "getBattery" in navigator;

/** @typedef {"charging" | "level" | "chargingTime" | "dischargingTime"} BatteryManagerContextStateType */
/** @type {BatteryManagerContextStateType[]} */
export const batteryManagerContextStateTypes = [
  "charging",
  "chargingTime",
  "dischargingTime",
  "level",
];

/** @typedef {{isAvailable: boolean, charging: boolean, level: number, chargingTime: number, dischargingTime: number, changes: BatteryManagerContextStateType[] }} BatteryManagerContextState */

/** @type {BatteryManagerContextState} */
const defaultBatteryManagerState = {
  changes: [],
  charging: false,
  level: 0,
  chargingTime: 0,
  dischargingTime: 0,
  isAvailable: false,
};

/**
 * @param {BatteryManagerContextStateType[]} changes
 * @returns {BatteryManagerContextState}
 */
const getBatteryManagerState = (batteryManager, ...changes) => {
  if (!batteryManager) {
    return defaultBatteryManagerState;
  }

  const { charging, level, chargingTime, dischargingTime } = batteryManager;
  return {
    charging,
    level,
    chargingTime,
    dischargingTime,
    changes,
    isAvailable: true,
  };
};

const {
  createContextProvider: createBatteryManagerContextProvider,
  createContextConsumer: createBatteryManagerContextConsumer,
} = await createContext("batteryManager", {
  defaultState: getBatteryManagerState(),
  onProviderHostConnection: async (provider, abortController) => {
    if (!isBatteryManagerAvailable) {
      return;
    }
    const batteryManager = await navigator.getBattery();
    // console.log("batteryManager", batteryManager);

    /** @type {AddEventListenerOptions} */
    const options = { signal: abortController.signal };

    /** @param {BatteryManagerContextStateType[]} changes */
    const updateState = (...changes) => {
      const state = getBatteryManagerState(batteryManager, ...changes);
      provider.value.update(state);
    };

    batteryManager.addEventListener(
      "chargingchange",
      () => updateState("charging"),
      options,
    );
    batteryManager.addEventListener(
      "levelchange",
      () => updateState("level"),
      options,
    );
    batteryManager.addEventListener(
      "chargingtimechange",
      () => updateState("chargingTime"),
      options,
    );
    batteryManager.addEventListener(
      "dischargingtimechange",
      () => updateState("dischargingTime"),
      options,
    );

    updateState(...batteryManagerContextStateTypes);
  },
});

export {
  createBatteryManagerContextProvider,
  createBatteryManagerContextConsumer,
};

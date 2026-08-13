import { waitForGlobals } from "../../utils/cross-origin-storage-utils.js";

import { createContext } from "./createContext.js";

/** @typedef {{isLeftHanded: boolean }} IsLeftHandedContextState */

const {
  createContextProvider: createIsLeftHandedContextProvider,
  createContextConsumer: createIsLeftHandedContextConsumer,
} = createContext("leftHanded", { isLeftHanded: false }, null, null, true);

export { createIsLeftHandedContextProvider, createIsLeftHandedContextConsumer };

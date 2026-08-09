import { waitForGlobals } from "../../utils/cross-origin-storage-utils.js";

import { createContext } from "./createContext.js";

const {
  createContextConsumer: createLeftHandedContextConsumer,
  createContextProvider: createLeftHandedContextProvider,
} = createContext("leftHandedContext", { isLeftHanded: false });

export { createLeftHandedContextConsumer, createLeftHandedContextProvider };

import { waitForGlobals } from "../../utils/cross-origin-storage-utils.js";

import { createContext } from "./createContext.js";

const {
  createContextConsumer: createActiveTabContextConsumer,
  createContextProvider: createActiveTabContextProvider,
} = createContext("activeTab");

export { createActiveTabContextConsumer, createActiveTabContextProvider };

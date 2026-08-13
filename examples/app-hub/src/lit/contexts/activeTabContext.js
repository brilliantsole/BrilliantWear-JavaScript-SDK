import { waitForGlobals } from "../../utils/cross-origin-storage-utils.js";
import { createContext } from "./createContext.js";

/** @typedef {{activeTab: string }} ActiveTabContextState */

const {
  createContextProvider: createActiveTabContextProvider,
  createContextConsumer: createActiveTabContextConsumer,
} = createContext("activeTab");

export { createActiveTabContextProvider, createActiveTabContextConsumer };

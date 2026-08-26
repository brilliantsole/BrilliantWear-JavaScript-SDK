import { createContext } from "./createContext.js";

/** @typedef {{activeTab: string }} ActiveTabContextState */

const {
  createContextProvider: createActiveTabContextProvider,
  createContextConsumer: createActiveTabContextConsumer,
} = await createContext("activeTab");

export { createActiveTabContextProvider, createActiveTabContextConsumer };

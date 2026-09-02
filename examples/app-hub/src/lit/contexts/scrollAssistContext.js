import { createContext } from "./createContext.js";

/** @typedef {{enabled: boolean }} ScrollAssistContextState */

const {
  createContextProvider: createScrollAssistContextProvider,
  createContextConsumer: createScrollAssistContextConsumer,
} = await createContext("scrollAssist", {
  defaultState: { enabled: false },
  storageType: "localStorage",
});

export { createScrollAssistContextProvider, createScrollAssistContextConsumer };

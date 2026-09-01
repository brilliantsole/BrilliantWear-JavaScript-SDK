import { createContext } from "./createContext.js";

/** @typedef {{scrollAssist: boolean }} ScrollAssistContextState */

const {
  createContextProvider: createScrollAssistContextProvider,
  createContextConsumer: createScrollAssistContextConsumer,
} = await createContext("scrollAssist", {
  defaultState: { scrollAssist: false },
  storageType: "localStorage",
});

export { createScrollAssistContextProvider, createScrollAssistContextConsumer };

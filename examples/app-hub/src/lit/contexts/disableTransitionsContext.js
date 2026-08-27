import { createContext } from "./createContext.js";

/** @typedef {{disableTransitions: boolean }} DisableTransitionsContextState */

const {
  createContextProvider: createDisableTransitionsContextProvider,
  createContextConsumer: createDisableTransitionsContextConsumer,
} = await createContext("disableTransitions", {
  defaultState: { disableTransitions: false },
  storageType: "localStorage",
});

export {
  createDisableTransitionsContextProvider,
  createDisableTransitionsContextConsumer,
};

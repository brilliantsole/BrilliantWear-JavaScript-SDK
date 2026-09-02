import { createContext } from "./createContext.js";

/** @typedef {{visible: boolean }} ToggleHeaderHiddenActionButtonContextState */

const {
  createContextProvider: createToggleHeaderHiddenActionButtonContextProvider,
  createContextConsumer: createToggleHeaderHiddenActionButtonContextConsumer,
} = await createContext("toggleHeaderHiddenActionBUtton", {
  defaultState: { visible: false },
  storageType: "localStorage",
});

export {
  createToggleHeaderHiddenActionButtonContextProvider,
  createToggleHeaderHiddenActionButtonContextConsumer,
};

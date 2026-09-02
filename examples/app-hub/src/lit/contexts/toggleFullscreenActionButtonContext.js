import { createContext } from "./createContext.js";

/** @typedef {{visible: boolean }} ToggleFullscreenActionButtonContextState */

const {
  createContextProvider: createToggleFullscreenActionButtonContextProvider,
  createContextConsumer: createToggleFullscreenActionButtonContextConsumer,
} = await createContext("toggleFullscreenActionBUtton", {
  defaultState: { visible: false },
  storageType: "localStorage",
});

export {
  createToggleFullscreenActionButtonContextProvider,
  createToggleFullscreenActionButtonContextConsumer,
};

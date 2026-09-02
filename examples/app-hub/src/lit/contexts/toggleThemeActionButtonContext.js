import { createContext } from "./createContext.js";

/** @typedef {{visible: boolean }} ToggleThemeActionButtonContextState */

const {
  createContextProvider: createToggleThemeActionButtonContextProvider,
  createContextConsumer: createToggleThemeActionButtonContextConsumer,
} = await createContext("toggleThemeActionBUtton", {
  defaultState: { visible: false },
  storageType: "localStorage",
});

export {
  createToggleThemeActionButtonContextProvider,
  createToggleThemeActionButtonContextConsumer,
};

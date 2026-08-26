import { createContext } from "./createContext.js";

/** @typedef {{isHeaderHidden: boolean }} IsHeaderHiddenContextState */

const {
  createContextProvider: createIsHeaderHiddenContextProvider,
  createContextConsumer: createIsHeaderHiddenContextConsumer,
} = await createContext("headerHidden", {
  defaultState: { isHeaderHidden: false },
});

export {
  createIsHeaderHiddenContextProvider,
  createIsHeaderHiddenContextConsumer,
};

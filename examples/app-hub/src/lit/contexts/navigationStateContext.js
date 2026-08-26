import { createContext } from "./createContext.js";

/** @typedef {{route: string, hash?: string }} NavigationContextState */

const {
  createContextProvider: createNavigationStateContextProvider,
  createContextConsumer: createNavigationStateContextConsumer,
} = await createContext("navigationState");

export {
  createNavigationStateContextProvider,
  createNavigationStateContextConsumer,
};

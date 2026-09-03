import { createContext } from "./createContext.js";

/** @typedef {{disableViewTransitions: boolean }} DisableViewTransitionsContextState */

const {
  createContextProvider: createDisableViewTransitionsContextProvider,
  createContextConsumer: createDisableViewTransitionsContextConsumer,
} = await createContext("disableViewTransitions", {
  defaultState: {
    disableViewTransitions: !Boolean(document.startViewTransition),
  },
  storageType: "localStorage",
});

export {
  createDisableViewTransitionsContextProvider,
  createDisableViewTransitionsContextConsumer,
};

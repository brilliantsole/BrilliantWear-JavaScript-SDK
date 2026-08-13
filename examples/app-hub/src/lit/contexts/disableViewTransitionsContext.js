import { waitForGlobals } from "../../utils/cross-origin-storage-utils.js";
import { createContext } from "./createContext.js";

/** @typedef {{disableViewTransitions: boolean }} DisableViewTransitionsContextState */

const {
  createContextProvider: createDisableViewTransitionsContextProvider,
  createContextConsumer: createDisableViewTransitionsContextConsumer,
} = createContext(
  "disableViewTransitions",
  {
    disableViewTransitions: false,
  },
  null,
  null,
  true,
);

export {
  createDisableViewTransitionsContextProvider,
  createDisableViewTransitionsContextConsumer,
};

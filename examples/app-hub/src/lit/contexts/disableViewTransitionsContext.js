import { waitForGlobals } from "../../utils/cross-origin-storage-utils.js";
import { createContext } from "./createContext.js";

/** @typedef {{disableViewTransitions: boolean }} DisableViewTransitionsContextState */

const {
  createContextProvider: createDisableViewTransitionsContextProvider,
  createContextConsumer: createDisableViewTransitionsContextConsumer,
} = await createContext("disableViewTransitions", {
  defaultState: { disableViewTransitions: false },
  storageType: "localStorage",
});

export {
  createDisableViewTransitionsContextProvider,
  createDisableViewTransitionsContextConsumer,
};

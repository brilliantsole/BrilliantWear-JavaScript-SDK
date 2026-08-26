import { createContext } from "./createContext.js";

/** @typedef {{anchorHeader: boolean }} AnchorHeaderContextState */

const {
  createContextProvider: createAnchorHeaderContextProvider,
  createContextConsumer: createAnchorHeaderContextConsumer,
} = await createContext("anchorHeader", {
  defaultState: { anchorHeader: false },
  storageType: "localStorage",
});

export { createAnchorHeaderContextProvider, createAnchorHeaderContextConsumer };

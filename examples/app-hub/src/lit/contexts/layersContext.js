import { createContext } from "./createContext.js";

/** @typedef {{url: string }} LayerContextState */
/** @typedef {{layers: LayerContextState[]}} LayersContextState */

const {
  createContextProvider: createLayersContextProvider,
  createContextConsumer: createLayersContextConsumer,
} = await createContext("layers", {
  defaultState: { layers: [{ url: "" }] },
});

export { createLayersContextProvider, createLayersContextConsumer };

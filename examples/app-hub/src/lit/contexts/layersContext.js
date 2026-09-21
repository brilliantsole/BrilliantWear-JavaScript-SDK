import { createContext } from "./createContext.js";

/** @typedef {{src: string, iframe: HTMLIFrameElement }} LayerContextState */
/** @typedef {{layers: LayerContextState[]}} LayersContextState */

const {
  createContextProvider: createLayersContextProvider,
  createContextConsumer: createLayersContextConsumer,
} = await createContext("layers", {
  defaultState: { layers: [{ src: "apps/basic" }] },
  storageType: "localStorage",
});

export { createLayersContextProvider, createLayersContextConsumer };

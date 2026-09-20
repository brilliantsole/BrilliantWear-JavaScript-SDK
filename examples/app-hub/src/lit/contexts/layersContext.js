import { createContext } from "./createContext.js";

/** @typedef {{src: string, iframe: HTMLIFrameElement }} LayerContextState */
/** @typedef {{layers: LayerContextState[]}} LayersContextState */

const {
  createContextProvider: createLayersContextProvider,
  createContextConsumer: createLayersContextConsumer,
} = await createContext("layers", {
  defaultState: { layers: [{ src: "apps/test" }] },
});

export { createLayersContextProvider, createLayersContextConsumer };

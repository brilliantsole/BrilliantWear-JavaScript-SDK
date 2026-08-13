import { waitForGlobals } from "../../utils/cross-origin-storage-utils.js";
import { createContext } from "./createContext.js";

/** @typedef {"landscape" | "portrait"} ViewportOrientation */
/** @typedef {{viewportOrientation: ViewportOrientation }} ViewportOrientationContextState */

const viewportOrientationMediaQuery = window.matchMedia(
  "(orientation: landscape)",
);

/** @returns {ViewportOrientationContextState} */
const getViewportOrientationState = () => {
  /** @type {ViewportOrientation} */
  const viewportOrientation = viewportOrientationMediaQuery.matches
    ? "landscape"
    : "portrait";
  return { viewportOrientation };
};

const {
  createContextProvider: createViewportOrientationContextProvider,
  createContextConsumer: createViewportOrientationContextConsumer,
} = createContext(
  "viewportOrientation",
  getViewportOrientationState(),
  (provider, abortController) => {
    viewportOrientationMediaQuery.addEventListener(
      "change",
      () => {
        console.log("viewportOrientationMediaQuery.change");
        const viewportOrientationState = getViewportOrientationState();
        console.log({ viewportOrientationState });
        provider.value.update(viewportOrientationState);
      },
      { signal: abortController.signal },
    );
  },
);

export {
  createViewportOrientationContextProvider,
  createViewportOrientationContextConsumer,
};

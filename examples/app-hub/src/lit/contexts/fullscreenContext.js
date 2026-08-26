import { createContext } from "./createContext.js";

/** @typedef {{fullscreenEnabled: boolean, fullscreenElement?: HTMLElement }} FullscreenContextState */

/** @returns {FullscreenContextState} */
const getFullscreenState = () => {
  const { fullscreenEnabled, fullscreenElement } = document;
  return { fullscreenEnabled, fullscreenElement };
};

const {
  createContextProvider: createFullscreenContextProvider,
  createContextConsumer: createFullscreenContextConsumer,
} = await createContext("fullscreen", {
  defaultState: getFullscreenState(),
  onProviderHostConnection: (provider, abortController) => {
    document.addEventListener(
      "fullscreenchange",
      (event) => {
        // console.log("document.fullscreenchange");
        const fullscreenState = getFullscreenState();
        // console.log({ fullscreenState });
        provider.value.update(fullscreenState);
      },
      { signal: abortController.signal },
    );
    document.addEventListener(
      "fullscreenerror",
      (event) => {
        console.error("document.fullscreenerror", event);
      },
      { signal: abortController.signal },
    );
  },
});

export { createFullscreenContextProvider, createFullscreenContextConsumer };

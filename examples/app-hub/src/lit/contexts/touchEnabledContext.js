import { createContext } from "./createContext.js";

/** @typedef {{touchEnabled: boolean }} TouchEnabledContextState */

const touchEnabledMediaQuery = window.matchMedia("(pointer: coarse)");

/** @returns {TouchEnabledContextState} */
const getTouchEnabledState = () => {
  const touchEnabled = touchEnabledMediaQuery.matches;
  return { touchEnabled };
};

const {
  createContextProvider: createTouchEnabledContextProvider,
  createContextConsumer: createTouchEnabledContextConsumer,
} = await createContext("touchEnabled", {
  defaultState: getTouchEnabledState(),
  onProviderHostConnection: (provider, abortController) => {
    touchEnabledMediaQuery.addEventListener(
      "change",
      () => {
        // console.log("touchEnabledMediaQuery.change");
        const touchEnabledState = getTouchEnabledState();
        // console.log({ touchEnabledState });
        provider.value.update(touchEnabledState);
      },
      { signal: abortController.signal },
    );
  },
});

export { createTouchEnabledContextProvider, createTouchEnabledContextConsumer };

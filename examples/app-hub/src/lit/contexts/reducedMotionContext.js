import { createContext } from "./createContext.js";

/** @typedef {{reducedMotion: boolean }} ReducedMotionContextState */

const reducedMotionMediaQuery = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);

/** @returns {ReducedMotionContextState} */
const getReducedMotionState = () => {
  const reducedMotion = reducedMotionMediaQuery.matches;
  return { reducedMotion };
};

const {
  createContextProvider: createReducedMotionContextProvider,
  createContextConsumer: createReducedMotionContextConsumer,
} = await createContext("reducedMotion", {
  defaultState: getReducedMotionState(),
  onProviderHostConnection: (provider, abortController) => {
    reducedMotionMediaQuery.addEventListener(
      "change",
      () => {
        console.log("reducedMotionMediaQuery.change");
        const reducedMotionState = getReducedMotionState();
        console.log({ reducedMotionState });
        provider.value.update(reducedMotionState);
      },
      { signal: abortController.signal },
    );
  },
});

export {
  createReducedMotionContextProvider,
  createReducedMotionContextConsumer,
};

import { waitForGlobals } from "../../utils/cross-origin-storage-utils.js";
import { createContext } from "./createContext.js";

const {
  createContextConsumer: createScreenOrientationContextConsumer,
  createContextProvider: createScreenOrientationContextProvider,
} = createContext(
  "screenOrientationContext",
  {
    type: "landscape-primary",
    angle: 0,
  },
  (provider) => {
    // FILL
    return (provider) => {
      // FILL
    };
  },
);

export {
  createScreenOrientationContextConsumer,
  createScreenOrientationContextProvider,
};

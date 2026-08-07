import { waitForGlobals } from "../../utils/cross-origin-storage-utils.js";

const { litContext } = await waitForGlobals();

export const screenOrientationContextKey = Symbol("screenOrientationContext");
export const screenOrientationContext = litContext.createContext(
  screenOrientationContextKey,
);

import { waitForGlobals } from "../../utils/cross-origin-storage-utils.js";

const { litContext } = await waitForGlobals();

export const selectedTabContextKey = Symbol("selectedTabContext");
export const selectedTabContext = litContext.createContext(
  selectedTabContextKey,
);

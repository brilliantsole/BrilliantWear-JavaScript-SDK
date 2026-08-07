import { waitForGlobals } from "../../utils/cross-origin-storage-utils.js";

const { litContext } = await waitForGlobals();

export const activeTabContextKey = Symbol("activeTabContext");
export const activeTabContext = litContext.createContext(activeTabContextKey);

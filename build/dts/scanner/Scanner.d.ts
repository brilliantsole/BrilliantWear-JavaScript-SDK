import { Client } from "../server/Client.ts";
import BaseScanner from "./BaseScanner.ts";
import { default as NullScanner } from "./NullScanner.ts";
/** NODE_START */ import { default as NobleScanner } from "./NobleScanner.ts"; /** NODE_END */
export type ScannerLike = BaseScanner | Client;
export { NullScanner };
/** NODE_START */ export { NobleScanner }; /** NODE_END */

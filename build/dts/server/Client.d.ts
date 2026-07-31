/** NODE_START */
/** NODE_END */
/** BROWSER_START */
import { WindowClient } from "./window/WindowClient.ts";
import { default as WebSocketClient } from "./websocket/WebSocketClient.ts";
/** BROWSER_END */
export declare const Clients: readonly [typeof WindowClient, typeof WebSocketClient];
export type Client = InstanceType<(typeof Clients)[number]>;

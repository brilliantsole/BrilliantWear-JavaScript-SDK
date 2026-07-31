import { Message, MessageOrMessageType } from "../server/ServerUtils.ts";
export declare const WindowManagerMessageTypes: readonly ["ping", "pong", "serverMessage"];
export type WindowManagerMessageType = (typeof WindowManagerMessageTypes)[number];
export type WindowManagerMessageOrMessageType = MessageOrMessageType<WindowManagerMessageType>;
export type WindowManagerMessage = Message<WindowManagerMessageType>;
export declare function createWindowManagerMessage(...messages: WindowManagerMessageOrMessageType[]): ArrayBuffer;
export declare const windowManagerMessageKey = "BrilliantWear";
export declare const windowManagerPingMessage: ArrayBuffer;
export declare const windowManagerPongMessage: ArrayBuffer;

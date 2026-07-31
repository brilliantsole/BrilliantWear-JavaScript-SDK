import { createConsole } from "../utils/Console.ts";
import {
  createMessage,
  Message,
  MessageOrMessageType,
} from "../server/ServerUtils.ts";

const _console = createConsole("WindowManagerUtils", { log: false });

export const WindowManagerMessageTypes = [
  "ping",
  "pong",
  "serverMessage",
] as const;
export type WindowManagerMessageType =
  (typeof WindowManagerMessageTypes)[number];

export type WindowManagerMessageOrMessageType =
  MessageOrMessageType<WindowManagerMessageType>;
export type WindowManagerMessage = Message<WindowManagerMessageType>;

export function createWindowManagerMessage(
  ...messages: WindowManagerMessageOrMessageType[]
) {
  _console.log("createWindowManagerMessage", ...messages);
  return createMessage(WindowManagerMessageTypes, true, ...messages);
}

export const windowManagerMessageKey = "BrilliantWear";

// STATIC MESSAGES
export const windowManagerPingMessage = createWindowManagerMessage("ping");
export const windowManagerPongMessage = createWindowManagerMessage("pong");

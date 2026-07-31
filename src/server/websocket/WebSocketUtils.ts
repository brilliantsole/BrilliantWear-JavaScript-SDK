import { createConsole } from "../../utils/Console.ts";
import {
  createMessage,
  Message,
  MessageOrMessageType,
} from "../ServerUtils.ts";

const _console = createConsole("WebSocketUtils", { log: false });

export const webSocketPingTimeout = 30_000;
export const webSocketReconnectTimeout = 3_000;

export const WebSocketMessageTypes = ["ping", "pong", "serverMessage"] as const;
export type WebSocketMessageType = (typeof WebSocketMessageTypes)[number];

export type WebSocketMessageOrMessageType =
  MessageOrMessageType<WebSocketMessageType>;
export type WebSocketMessage = Message<WebSocketMessageType>;
export function createWebSocketMessage(
  ...messages: WebSocketMessageOrMessageType[]
) {
  _console.log("createWebSocketMessage", ...messages);
  return createMessage(WebSocketMessageTypes, true, ...messages);
}

// STATIC MESSAGES
export const webSocketPingMessage = createWebSocketMessage("ping");
export const webSocketPongMessage = createWebSocketMessage("pong");

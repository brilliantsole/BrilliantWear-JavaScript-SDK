import { createConsole } from "../../utils/Console.ts";
import {
  createMessage,
  Message,
  MessageOrMessageType,
} from "../ServerUtils.ts";

const _console = createConsole("UDPUtils", { log: false });

export const pongUDPClientTimeout = 2_000;
export const removeUDPClientTimeout = 4_000;

export const UDPServerMessageTypes = [
  "ping",
  "pong",
  "setRemoteReceivePort",
  "serverMessage",
] as const;
export type UDPServerMessageType = (typeof UDPServerMessageTypes)[number];

export type UDPServerMessageOrMessageType =
  MessageOrMessageType<UDPServerMessageType>;
export type UDPServerMessage = Message<UDPServerMessageType>;

export function createUDPServerMessage(
  ...messages: UDPServerMessageOrMessageType[]
) {
  _console.log("createUDPServerMessage", ...messages);
  return createMessage(UDPServerMessageTypes, true, ...messages);
}

// STATIC MESSAGES
export const udpPingMessage = createUDPServerMessage("ping");
export const udpPongMessage = createUDPServerMessage("pong");

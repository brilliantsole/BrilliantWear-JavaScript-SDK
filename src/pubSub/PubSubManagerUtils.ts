import { createConsole } from "../utils/Console.ts";
import {
  createMessage,
  Message,
  MessageOrMessageType,
} from "../server/ServerUtils.ts";

const _console = createConsole("PubSubManagerUtils", { log: true });

export const PubSubManagerMessageTypes = [
  "subscribe",
  "unsubscribe",
  "publish",
  "message",
] as const;
export type PubSubManagerMessageType =
  (typeof PubSubManagerMessageTypes)[number];

export type PubSubManagerMessage = Message<PubSubManagerMessageType>;
export type PubSubMessageOrMessageType =
  MessageOrMessageType<PubSubManagerMessageType>;

export function createPubSubManagerMessage(
  ...messages: PubSubMessageOrMessageType[]
) {
  _console.log("createPubSubManagerMessage", ...messages);
  return createMessage(PubSubManagerMessageTypes, true, ...messages);
}

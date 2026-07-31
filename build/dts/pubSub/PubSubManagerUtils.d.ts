import { Message, MessageOrMessageType } from "../server/ServerUtils.ts";
export declare const PubSubManagerMessageTypes: readonly ["subscribe", "unsubscribe", "publish", "message"];
export type PubSubManagerMessageType = (typeof PubSubManagerMessageTypes)[number];
export type PubSubManagerMessage = Message<PubSubManagerMessageType>;
export type PubSubMessageOrMessageType = MessageOrMessageType<PubSubManagerMessageType>;
export declare function createPubSubManagerMessage(...messages: PubSubMessageOrMessageType[]): ArrayBuffer;

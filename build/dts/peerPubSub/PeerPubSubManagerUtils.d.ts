import { MessageOrMessageType } from "../server/ServerUtils.ts";
export declare const PeerPubSubManagerMessageTypes: readonly ["subscribe", "unsubscribe", "publish"];
export type PeerPubSubManagerMessageType = (typeof PeerPubSubManagerMessageTypes)[number];
export type PeerPubSubManagerMessage = MessageOrMessageType<PeerPubSubManagerMessageType>;
export declare function createPeerPubSubManagerMessage(...messages: PeerPubSubManagerMessage[]): ArrayBuffer;

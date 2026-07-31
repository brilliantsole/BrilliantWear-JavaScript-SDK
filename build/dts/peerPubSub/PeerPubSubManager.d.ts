import { EventDispatcherTypes } from "../utils/EventDispatcher.ts";
export interface PeerPubSubManagerServerClient {
    type: "window";
    iframe: HTMLIFrameElement;
    messageChannel?: MessageChannel;
    didSendMessagePort?: boolean;
    didLoad?: boolean;
    transfer?: Transferable[];
}
export declare const PeerPubSubManagerServerEventTypes: readonly ["clientConnected", "clientDisconnected"];
export type PeerPubSubManagerServerEventType = (typeof PeerPubSubManagerServerEventTypes)[number];
interface PeerPubSubManagerServerEventMessages {
    clientConnected: {
        client: PeerPubSubManagerServerClient;
    };
    clientDisconnected: {
        client: PeerPubSubManagerServerClient;
    };
}
export type PeerPubSubManagerServerEventDispatcherTypes = EventDispatcherTypes<PeerPubSubManagerServer, PeerPubSubManagerServerEventType, PeerPubSubManagerServerEventMessages>;
export type PeerPubSubManagerServerEvent = PeerPubSubManagerServerEventDispatcherTypes["Event"];
export type PeerPubSubManagerServerEventMap = PeerPubSubManagerServerEventDispatcherTypes["EventMap"];
export type PeerPubSubManagerServerEventListenerMap = PeerPubSubManagerServerEventDispatcherTypes["EventListenerMap"];
export type PeerPubSubManagerServerEventDispatcher = PeerPubSubManagerServerEventDispatcherTypes["EventDispatcher"];
export type BoundPeerPubSubManagerServerEventListeners = PeerPubSubManagerServerEventDispatcherTypes["BoundEventListeners"];
declare class PeerPubSubManagerServer {
    #private;
    get addEventListener(): <T extends "clientConnected" | "clientDisconnected" | "*">(type: T, listener: (event: import("../utils/EventDispatcher.ts").ListenerEvent<PeerPubSubManagerServer, "clientConnected" | "clientDisconnected", PeerPubSubManagerServerEventMessages, T>) => void, options?: import("../utils/EventDispatcher.ts").EventDispatcherOptions) => void;
    get removeEventListener(): <T extends "clientConnected" | "clientDisconnected" | "*">(type: T, listener: (event: import("../utils/EventDispatcher.ts").ListenerEvent<PeerPubSubManagerServer, "clientConnected" | "clientDisconnected", PeerPubSubManagerServerEventMessages, T>) => void) => void;
    get waitForEvent(): <T extends "clientConnected" | "clientDisconnected">(type: T, options?: {
        immediate?: boolean;
    }) => Promise<import("../utils/EventDispatcher.ts").ListenerEvent<PeerPubSubManagerServer, "clientConnected" | "clientDisconnected", PeerPubSubManagerServerEventMessages, T>>;
    get removeEventListeners(): <T extends "clientConnected" | "clientDisconnected" | "*">(type: T) => void;
    removeAllEventListeners(): void;
    static readonly shared: PeerPubSubManagerServer;
    constructor();
    get clients(): PeerPubSubManagerServerClient[];
    sendToClient(client: PeerPubSubManagerServerClient, arrayBuffer: ArrayBuffer): boolean;
}
declare const _default: PeerPubSubManagerServer;
export default _default;

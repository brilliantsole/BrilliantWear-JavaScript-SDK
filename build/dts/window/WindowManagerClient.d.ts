import { EventDispatcherTypes } from "../utils/EventDispatcher.ts";
import { WindowManagerMessage } from "./WindowManagerUtils.ts";
export declare const WindowManagerClientConnectionStatuses: readonly ["notConnected", "connecting", "connected", "disconnecting"];
export type ClientConnectionStatus = (typeof WindowManagerClientConnectionStatuses)[number];
export declare const WindowManagerClientEventTypes: readonly ["notConnected", "connecting", "connected", "disconnecting", "connectionStatus", "isConnected", "serverMessage"];
export type WindowManagerClientEventType = (typeof WindowManagerClientEventTypes)[number];
interface WindowManagerClientEventMessages {
    connectionStatus: {
        connectionStatus: ClientConnectionStatus;
    };
    isConnected: {
        isConnected: boolean;
    };
    serverMessage: {
        dataView: DataView<ArrayBuffer>;
    };
}
export type WindowManagerClientEventDispatcherTypes = EventDispatcherTypes<WindowManagerClient, WindowManagerClientEventType, WindowManagerClientEventMessages>;
export type WindowManagerClientEvent = WindowManagerClientEventDispatcherTypes["Event"];
export type WindowManagerClientEventMap = WindowManagerClientEventDispatcherTypes["EventMap"];
export type WindowManagerClientEventListenerMap = WindowManagerClientEventDispatcherTypes["EventListenerMap"];
export type WindowManagerClientEventDispatcher = WindowManagerClientEventDispatcherTypes["EventDispatcher"];
export type BoundWindowManagerClientEventListeners = WindowManagerClientEventDispatcherTypes["BoundEventListeners"];
declare class WindowManagerClient {
    #private;
    get addEventListener(): <T extends "*" | "connecting" | "connected" | "disconnecting" | "notConnected" | "connectionStatus" | "isConnected" | "serverMessage">(type: T, listener: (event: import("../utils/EventDispatcher.ts").ListenerEvent<WindowManagerClient, "connecting" | "connected" | "disconnecting" | "notConnected" | "connectionStatus" | "isConnected" | "serverMessage", WindowManagerClientEventMessages, T>) => void, options?: import("../utils/EventDispatcher.ts").EventDispatcherOptions) => void;
    get removeEventListener(): <T extends "*" | "connecting" | "connected" | "disconnecting" | "notConnected" | "connectionStatus" | "isConnected" | "serverMessage">(type: T, listener: (event: import("../utils/EventDispatcher.ts").ListenerEvent<WindowManagerClient, "connecting" | "connected" | "disconnecting" | "notConnected" | "connectionStatus" | "isConnected" | "serverMessage", WindowManagerClientEventMessages, T>) => void) => void;
    get waitForEvent(): <T extends "connecting" | "connected" | "disconnecting" | "notConnected" | "connectionStatus" | "isConnected" | "serverMessage">(type: T, options?: {
        immediate?: boolean;
        signal?: AbortSignal;
    }) => Promise<import("../utils/EventDispatcher.ts").ListenerEvent<WindowManagerClient, "connecting" | "connected" | "disconnecting" | "notConnected" | "connectionStatus" | "isConnected" | "serverMessage", WindowManagerClientEventMessages, T>>;
    get removeEventListeners(): <T extends "*" | "connecting" | "connected" | "disconnecting" | "notConnected" | "connectionStatus" | "isConnected" | "serverMessage">(type: T) => void;
    get removeAllEventListeners(): () => void;
    static readonly shared: WindowManagerClient;
    constructor();
    get connectionStatus(): "connecting" | "connected" | "disconnecting" | "notConnected";
    protected set connectionStatus(newConnectionStatus: "connecting" | "connected" | "disconnecting" | "notConnected");
    get isConnected(): boolean;
    get isDisconnected(): boolean;
    connect(): void;
    disconnect(): void;
    reconnect(): void;
    toggleConnection(): void;
    sendMessage(...messages: WindowManagerMessage[]): void;
}
declare const _default: WindowManagerClient;
export default _default;

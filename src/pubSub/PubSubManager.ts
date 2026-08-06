import { createConsole } from "../utils/Console.ts";
import EventDispatcher, {
  DefaultEventDispatcherOptions,
  EventDispatcherListenerObject,
  EventDispatcherOptions,
  EventDispatcherTypes,
} from "../utils/EventDispatcher.ts";
import { addEventListeners } from "../utils/EventUtils.ts";
import { parseMessage } from "../utils/ParseUtils.ts";
import {
  createPubSubManagerMessage,
  PubSubManagerMessage,
  PubSubManagerMessageType,
  PubSubManagerMessageTypes,
  PubSubMessageOrMessageType,
} from "./PubSubManagerUtils.ts";

import { Singleton } from "../utils/TypeScriptUtils.ts";

import {
  default as ClientManager,
  ClientManagerEventMap,
} from "../server/ClientManager.ts";
import {
  default as ServerManager,
  ServerManagerEventMap,
} from "../server/ServerManager.ts";
import { createServerMessage, ServerMessage } from "../server/ServerUtils.ts";
import { ServerClient } from "../server/Server.ts";
import { Client } from "../server/Client.ts";
import {
  concatenateArrayBuffers,
  arrayBufferToStrings,
} from "../utils/ArrayBufferUtils.ts";
import { serverMtus, ServerType } from "../server/BaseServer.ts";
import { textDecoder } from "../utils/Text.ts";
import GuardManager from "../utils/GuardManager.ts";

const _console = createConsole("PubSubManager", { log: false });

export type PubSubPeer = ServerClient | Client;

export interface PubSubPeerContext {
  peer: PubSubPeer;
  responseMessages: PubSubMessageOrMessageType[];
}

export const PubSubManagerEventTypes = [
  "peerConnected",
  "peerNotConnected",
  "subscribed",
  "unsubscribed",
  "peerSubscribed",
  "peerUnsubscribed",
  "published",
  "peerPublished",
] as const;
export type PubSubManagerEventType = (typeof PubSubManagerEventTypes)[number];

interface PubSubManagerEventMessages {
  peerConnected: { peer: PubSubPeer };
  peerNotConnected: { peer: PubSubPeer };
  subscribed: { peer: PubSubPeer; type: string };
  unsubscribed: { peer: PubSubPeer; type: string };
  peerSubscribed: { peer: PubSubPeer; type: string };
  peerUnsubscribed: { peer: PubSubPeer; type: string };
  published: { peers: PubSubPeer[]; type: string; data: DataView };
  peerPublished: { peer: PubSubPeer; type: string; data: DataView };
}

export type PubSubManagerEventDispatcherTypes = EventDispatcherTypes<
  PubSubManager,
  PubSubManagerEventType,
  PubSubManagerEventMessages
>;
export type PubSubManagerEvent = PubSubManagerEventDispatcherTypes["Event"];
export type PubSubManagerEventMap =
  PubSubManagerEventDispatcherTypes["EventMap"];
export type PubSubManagerEventListenerMap =
  PubSubManagerEventDispatcherTypes["EventListenerMap"];
export type PubSubManagerEventDispatcher =
  PubSubManagerEventDispatcherTypes["EventDispatcher"];
export type BoundPubSubManagerEventListeners =
  PubSubManagerEventDispatcherTypes["BoundEventListeners"];

export type PubSubEvent = {
  type: string;
  target: PubSubManager;
  message: PubSubEventMessage;
};
export type PubSubEventMessage = {
  peer: PubSubPeer;
  data: DataView;
};
export type PubSubListener = (event: PubSubEvent) => void;
export type PubSubManagerLatestEventMap = Record<string, PubSubEvent>;

export type PubSubPeerOrType = PubSubPeer | ServerType;

export type BasePubSubManagerOptions = {
  peers?: PubSubPeerOrType[];
  ignorePeers?: PubSubPeerOrType[];
};
export const DefaultBasePubSubManagerOptions: BasePubSubManagerOptions = {};

export type PubSubManagerPublishOptions = BasePubSubManagerOptions;

export const DefaultPubSubManagerPublishOptions: PubSubManagerPublishOptions = {
  ...DefaultBasePubSubManagerOptions,
};

export type PubSubManagerListenerOptions = BasePubSubManagerOptions &
  EventDispatcherOptions;

export type PubSubManagerListenerObject = PubSubManagerListenerOptions &
  EventDispatcherListenerObject;

export const DefaultPubSubListenerOptions: PubSubManagerListenerOptions = {
  ...DefaultBasePubSubManagerOptions,
  ...DefaultEventDispatcherOptions,
};

export function verifyBasePubSubManagerOptions(
  options: BasePubSubManagerOptions,
) {
  const { peers, ignorePeers } = options;
  _console.assertWithError(
    !peers || peers.length > 0,
    "peers cannot be an empty list",
  );
}

export function verifyPubSubManagerEventTypeLength(type: string) {
  _console.assertRangeWithError(type, type.length, 1, 255);
}

export function doesBasePubSubManagerOptionsIncludePeer(
  options: BasePubSubManagerOptions,
  peer: PubSubPeer,
) {
  const { peers, ignorePeers } = options;

  if (peers && !(peers.includes(peer) || peers.includes(peer.type))) {
    _console.log(`peer or peer type "${peer.type}" not in list`, peer);
    return false;
  }
  if (
    ignorePeers &&
    (ignorePeers.includes(peer) || ignorePeers.includes(peer.type))
  ) {
    _console.log(`peer or peer type "${peer.type}" in ignore list`, peer);
    return false;
  }
  return true;
}

export interface PubSubManagerPeerSubscriptionGuardManagerArg {
  peer: PubSubPeer;
  type: string;
  data: DataView;
  sendingPeer?: PubSubPeer;
}

@Singleton
class PubSubManager {
  // EVENT DISPATCHER
  #eventDispatcher: PubSubManagerEventDispatcher = new EventDispatcher(
    this as PubSubManager,
    PubSubManagerEventTypes,
  );
  get addEventListener() {
    return this.#eventDispatcher.addEventListener;
  }
  get #dispatchEvent() {
    return this.#eventDispatcher.dispatchEvent;
  }
  get removeEventListener() {
    return this.#eventDispatcher.removeEventListener;
  }
  get waitForEvent() {
    return this.#eventDispatcher.waitForEvent;
  }
  get removeEventListeners() {
    return this.#eventDispatcher.removeEventListeners;
  }
  get removeAllEventListeners() {
    return this.#eventDispatcher.removeAllEventListeners;
  }

  // CONSTRUCTOR
  static readonly shared: PubSubManager;

  protected _init() {
    // _console.log("_init");
    addEventListeners(ServerManager, this.#boundServerManagerListeners);
    addEventListeners(ClientManager, this.#boundClientManagerListeners);
  }

  // SUBSCRIPTIONS
  #listeners: Record<string, PubSubManagerListenerObject[]> = {};
  #peers: PubSubPeer[] = [];
  get peers() {
    return this.#peers;
  }
  #peersSubscriptions: Map<PubSubPeer, Set<string>> = new Map();
  #peerSubscriptions: Map<PubSubPeer, Set<string>> = new Map();
  #latestEvents: PubSubManagerLatestEventMap = {};

  subscribe(
    type: string,
    listener: PubSubListener,
    options: PubSubManagerListenerOptions = structuredClone(
      DefaultPubSubListenerOptions,
    ),
  ) {
    verifyPubSubManagerEventTypeLength(type);
    verifyBasePubSubManagerOptions(options);

    _console.log("subscribe", { type, listener, options });

    if (!this.#listeners[type]) {
      this.#listeners[type] = [];
    }

    const alreadyAdded = this.#listeners[type].find((listenerObject) => {
      return (
        listenerObject.listener === listener &&
        listenerObject.once === options.once &&
        listenerObject.immediate === options.immediate
        // && listenerObject.signal == options.signal
      );
    });
    if (alreadyAdded) {
      _console.log("already added listener");
      return;
    }

    if (options.signal) {
      _console.log(`listening to "abort" signal`);
      options.signal.addEventListener(
        "abort",
        () => {
          _console.log(
            `removing "${type}" listener after receiving "abort" signal`,
          );
          this.unsubscribe(type, listener);
        },
        { once: true },
      );
    }

    const listenerObject: PubSubManagerListenerObject = {
      listener,
      once: options.once,
      immediate: options.immediate,
      signal: options.signal,
    };
    _console.log(`adding "${type}" listener`, listenerObject);
    this.#listeners[type].push(listenerObject);

    _console.log(
      `currently have ${this.#listeners[type].length} "${type}" listeners`,
    );

    if (options.immediate) {
      const latestEvent = this.#latestEvents[type];
      if (latestEvent) {
        this.#invokeListener(listenerObject, latestEvent);
        if (options.once) {
          return;
        }
      }
    }

    this.#peerSubscriptions.forEach((subscriptions, peer) => {
      if (
        !subscriptions.has(type) &&
        doesBasePubSubManagerOptionsIncludePeer(options, peer)
      ) {
        this.#subscribeToPeer(peer, type);
      }
    });
  }
  #subscribeToPeer(peer: PubSubPeer, ...types: string[]) {
    _console.log("#subscribeToPeer", peer, { types });
    _console.assertWithError(types.length > 0, `no types were given`);
    types.forEach((type) => verifyPubSubManagerEventTypeLength(type));

    types = types.filter((type) => {
      if (this.#peerSubscriptions.get(peer)!.has(type)) {
        _console.log(`already subscribed to peer for type "${type}"`, peer);
        return false;
      }
      return true;
    });
    _console.log("filteredTypes", types);

    if (types.length == 0) {
      _console.log("empty types - not gonna subscribe");
      return;
    }

    this.#sendToPeer(peer, {
      type: "subscribe",
      data: concatenateArrayBuffers(
        types.map((type) => concatenateArrayBuffers(type)),
      ),
    });
    types.forEach((type) => this.#peerSubscriptions.get(peer)!.add(type));
  }
  unsubscribe(type: string, listener: PubSubListener) {
    _console.log("unsubscribe", { type, listener });
    if (!this.#listeners[type]) return;

    let foundListener = false;
    this.#listeners[type]!.forEach((listenerObj) => {
      const isListenerToRemove = listenerObj.listener === listener;
      if (isListenerToRemove) {
        _console.log(`flagging "${type}" listener for removal`, listener);
        listenerObj.shouldRemove = true;
        foundListener = true;
      }
    });

    if (foundListener) {
      this.#updateListeners(type);
    }
  }
  #unsubscribeFromPeer(peer: PubSubPeer, ...types: string[]) {
    _console.log("#unsubscribeFromPeer", peer, { types });
    types.forEach((type) => verifyPubSubManagerEventTypeLength(type));

    types = types.filter((type) => {
      if (!this.#peerSubscriptions.get(peer)!.has(type)) {
        _console.log(`not subscribed to peer for type "${type}"`, peer);
        return false;
      }
      return true;
    });

    if (types.length == 0) {
      _console.log("empty types - not gonna unsubscribe");
      return;
    }

    this.#sendToPeer(peer, {
      type: "unsubscribe",
      data: concatenateArrayBuffers(
        types.map((type) => concatenateArrayBuffers(type)),
      ),
    });
    types.forEach((type) => this.#peerSubscriptions.get(peer)!.delete(type));
  }

  publish(
    type: string,
    data: DataView | ArrayBuffer,
    options: PubSubManagerPublishOptions = structuredClone(
      DefaultPubSubManagerPublishOptions,
    ),
  ) {
    verifyPubSubManagerEventTypeLength(type);
    verifyBasePubSubManagerOptions(options);

    _console.assertWithError(
      data instanceof DataView || data instanceof ArrayBuffer,
      "data is not DataView or ArrayBuffer",
    );

    data = data instanceof DataView ? data : new DataView(data);

    _console.log("publish", { type, data, options });

    const messageData = concatenateArrayBuffers(type, data);

    const peersPublishedTo: PubSubPeer[] = [];
    this.#peersSubscriptions.forEach((subscriptions, peer) => {
      if (
        subscriptions.has(type) &&
        doesBasePubSubManagerOptionsIncludePeer(options, peer)
      ) {
        if (data.byteLength > serverMtus[peer.type]) {
          _console.error(
            `data.byteLength ${data.byteLength} too large for peer.type "${peer.type} (max ${serverMtus[peer.type]})"`,
            peer,
          );
        }
        if (this.#allowPeerSubscription(peer, type, data)) {
          peersPublishedTo.push(peer);
          this.#sendToPeer(peer, {
            type: "publish",
            data: messageData,
          });
        }
      }
    });
    _console.log("peersPublishedTo", peersPublishedTo);
    return peersPublishedTo;
  }

  // PEERS
  #onPeerConnected(peer: PubSubPeer) {
    _console.log("#onPeerConnected", peer);
    this.#peersSubscriptions.set(peer, new Set());
    this.#peerSubscriptions.set(peer, new Set());
    this.#peers.push(peer);

    const types: Set<string> = new Set();

    Object.entries(this.#listeners).forEach(([type, listenerObjects]) => {
      const isPeerIncluded = listenerObjects.some((listenerObject) =>
        doesBasePubSubManagerOptionsIncludePeer(listenerObject, peer),
      );

      _console.log({ isPeerIncluded, type }, peer);
      if (isPeerIncluded) {
        _console.log(`adding "${type}" subscription to peer`, peer);
        types.add(type);
      }
    });

    this.#peersSubscriptions.forEach((subscriptions, _peer) => {
      if (_peer == peer) {
        return;
      }
      subscriptions.forEach((type) => {
        _console.log(
          `adding "${type}" subscription to peer on behalf of other peer`,
          peer,
          _peer,
        );
        types.add(type);
      });
    });

    if (types.size > 0) {
      this.#subscribeToPeer(peer, ...types);
    }
    this.#dispatchEvent("peerConnected", { peer });
  }
  #onPeerNotConnected(peer: PubSubPeer) {
    _console.log("#onPeerNotConnected", peer);
    const peerSubscriptions = this.#peersSubscriptions.get(peer)!;
    _console.log("deleting peerSubscriptions", peerSubscriptions);
    this.#peersSubscriptions.delete(peer);
    this.#peerSubscriptions.delete(peer);
    this.#peers = this.#peers.filter((_peer) => _peer != peer);

    const typesToUpdate: Set<string> = new Set();
    Object.entries(this.#listeners).forEach(([type, listenerObjects]) => {
      listenerObjects.forEach((listenerObject) => {
        const { peers, ignorePeers } = listenerObject;
        if (peers && peers.length == 1 && peers.includes(peer)) {
          listenerObject.shouldRemove = true;
          typesToUpdate.add(type);
        }
      });
    });

    this.#updateListeners(...typesToUpdate);
    this.#dispatchEvent("peerNotConnected", { peer });
  }
  #sendToPeer(peer: PubSubPeer, ...messages: PubSubManagerMessage[]) {
    _console.log("#sendPeerMessage", peer, messages);
    const data = createPubSubManagerMessage(...messages);
    const serverMessage: ServerMessage = { type: "pubSub", data };
    if (ClientManager.clients.includes(peer as Client)) {
      const client = peer as Client;
      client.sendToServer(serverMessage);
    } else {
      const client = peer as ServerClient;
      const server = ServerManager.getServerByClient(client);
      if (!server) {
        _console.error("no server found for client", client);
        return;
      }
      // @ts-expect-error
      server._sendToClient(client, createServerMessage(serverMessage));
    }
  }

  // SERVER MANAGER LISTENERS
  #boundServerManagerListeners: {
    [K in keyof ServerManagerEventMap]?: (
      event: ServerManagerEventMap[K],
    ) => void;
  } = {
    serverClientConnected:
      this.#onServerManagerServerClientConnected.bind(this),
    serverClientNotConnected:
      this.#onServerManagerServerClientNotConnected.bind(this),
  };
  #onServerManagerServerClientConnected(
    event: ServerManagerEventMap["serverClientConnected"],
  ) {
    const { message } = event;
    _console.log("#onServerManagerServerClientConnected", message);
    this.#onPeerConnected(message.client);
  }
  #onServerManagerServerClientNotConnected(
    event: ServerManagerEventMap["serverClientNotConnected"],
  ) {
    const { message } = event;
    _console.log("#onServerManagerServerClientNotConnected", message);
    this.#onPeerNotConnected(message.client);
  }

  // CLIENT MANAGER LISTENERS
  #boundClientManagerListeners: {
    [K in keyof ClientManagerEventMap]?: (
      event: ClientManagerEventMap[K],
    ) => void;
  } = {
    clientConnected: this.#onClientManagerClientConnected.bind(this),
    clientNotConnected: this.#onClientManagerClientNotConnected.bind(this),
  };
  #onClientManagerClientConnected(
    event: ClientManagerEventMap["clientConnected"],
  ) {
    const { message } = event;
    _console.log("#onClientManagerClientConnected", message);
    this.#onPeerConnected(message.client);
  }
  #onClientManagerClientNotConnected(
    event: ClientManagerEventMap["clientNotConnected"],
  ) {
    const { message } = event;
    _console.log("#onClientManagerClientNotConnected", message);
    this.#onPeerNotConnected(message.client);
  }

  // PARSING
  private _parsePeerMessage(peer: PubSubPeer, dataView: DataView<ArrayBuffer>) {
    _console.log("#parsePeerMessage", peer, dataView);

    const peerContext: PubSubPeerContext = {
      peer,
      responseMessages: [],
    };

    parseMessage(
      dataView,
      PubSubManagerMessageTypes,
      this.#onPeerMessage.bind(this),
      peerContext,
      true,
    );

    const { responseMessages } = peerContext;
    if (responseMessages.length == 0) {
      _console.log("no responseMessages");
      return;
    }
    return createPubSubManagerMessage(...responseMessages);
  }

  #onPeerSubscribe(
    dataView: DataView<ArrayBuffer>,
    peerContext: PubSubPeerContext,
  ) {
    _console.log("#onPeerSubscribe", dataView, peerContext);
    const { peer, responseMessages } = peerContext;
    const types = arrayBufferToStrings(dataView.buffer);
    _console.log("types", types);

    const addedTypes = types.filter((type) => {
      if (!this.#peersSubscriptions.get(peer)!.has(type)) {
        this.#peersSubscriptions.get(peer)!.add(type);
        _console.log(`added "${type}" subscription for peer`, peer);
        return true;
      }
      return false;
    });
    _console.log("addedTypes", addedTypes);
    this.#peers.forEach((_peer) => {
      if (_peer == peer) {
        return;
      }
      this.#subscribeToPeer(_peer, ...addedTypes);
    });
    addedTypes.forEach((type) => {
      this.#dispatchEvent("peerSubscribed", { peer, type });
    });
  }
  #onPeerUnsubscribe(
    dataView: DataView<ArrayBuffer>,
    peerContext: PubSubPeerContext,
  ) {
    _console.log("#onPeerUnsubscribe", dataView, peerContext);
    const { peer, responseMessages } = peerContext;
    const types = arrayBufferToStrings(dataView.buffer);
    _console.log("types", types);

    const removedTypes = types.filter((type) => {
      if (this.#peersSubscriptions.get(peer)!.has(type)) {
        this.#peersSubscriptions.get(peer)!.delete(type);
        _console.log(`removed "${type}" subscription for peer`, peer);
        return true;
      }
      return false;
    });
    _console.log("removedTypes", removedTypes);

    this.#peers.forEach((_peer) => {
      if (_peer == peer) {
        return;
      }
      this.#unsubscribeFromPeer(_peer, ...removedTypes);
    });

    this.#updateListeners(...removedTypes);

    removedTypes.forEach((type) => {
      this.#dispatchEvent("peerUnsubscribed", { peer, type });
    });
  }
  #onPeerPublish(
    dataView: DataView<ArrayBuffer>,
    peerContext: PubSubPeerContext,
  ) {
    _console.log("#onPeerPublish", dataView, peerContext);
    const { peer, responseMessages } = peerContext;

    let offset = 0;
    const typeLength = dataView.getUint8(offset++);
    const type = textDecoder.decode(
      dataView.buffer.slice(offset, offset + typeLength),
    );
    offset += typeLength;
    const data = new DataView(dataView.buffer.slice(offset));
    _console.log({ type, typeLength, data });

    const message: PubSubEventMessage = { peer, data };
    const event: PubSubEvent = { target: this, type, message };
    if (this.#listeners[type]) {
      this.#listeners[type].forEach((listenerObject) => {
        this.#invokeListener(listenerObject, event);
      });
    } else {
      _console.log(`self has no subscriptions for "${type}"`);
    }
    this.#latestEvents[type] = event;

    this.#dispatchEvent("peerPublished", { peer, type, data });

    this.#peersSubscriptions.forEach((subscriptions, _peer) => {
      if (_peer == peer) {
        return;
      }
      if (!subscriptions.has(type)) {
        return;
      }
      if (this.#allowPeerSubscription(_peer, type, dataView, peer)) {
        _console.log(`relaying "${type}" message to peer`, _peer);
        this.#sendToPeer(_peer, { type: "publish", data: dataView });
      }
    });
  }

  #invokeListener(
    listenerObject: PubSubManagerListenerObject,
    event: PubSubEvent,
  ) {
    _console.log(`dispatching "${event.type}" listener`, listenerObject);

    try {
      listenerObject.listener(event);
    } catch (error) {
      _console.error(error);
    }

    if (listenerObject.once) {
      _console.log(`flagging "${event.type}" listener`, listenerObject);
      listenerObject.shouldRemove = true;
    }
  }
  #updateListeners(...types: string[]) {
    _console.log("#updateSubscriptions", types);

    types.forEach((type) => {
      let listeners = this.#listeners[type];
      if (!listeners) {
        _console.log(`no listeners for type "${type}"`);
        return;
      }
      listeners = listeners.filter(
        (listenerObject) => !listenerObject.shouldRemove,
      );
      _console.log(`filtered "${type}" listeners`, listeners);
      if (listeners.length == 0) {
        _console.log(`no "${type}" listeners - deleting`);
        delete this.#listeners[type];
      } else {
        this.#listeners[type] = listeners;
      }
    });

    this.#peers.forEach((peer) => {
      const typesToRemove = types.filter((type) => {
        let keepSubscription = false;
        keepSubscription =
          keepSubscription ||
          this.#peers.some((_peer) => {
            if (_peer == peer) {
              return false;
            }
            if (this.#peersSubscriptions.get(_peer)!.has(type)) {
              _console.log(
                `other peer needs "${type}" subscription - keeping`,
                peer,
                _peer,
              );
              return true;
            }
            return false;
          });
        keepSubscription =
          keepSubscription ||
          this.#listeners[type]?.some((listenerObject) => {
            if (doesBasePubSubManagerOptionsIncludePeer(listenerObject, peer)) {
              _console.log(
                `still need "${type}" subscription for existing listener`,
                listenerObject,
              );
              return true;
            }
            return false;
          });
        return !keepSubscription;
      });

      _console.log("typesToRemove", typesToRemove);
      if (typesToRemove.length > 0) {
        this.#unsubscribeFromPeer(peer, ...typesToRemove);
      }
    });
  }

  #onPeerMessage(
    messageType: PubSubManagerMessageType,
    dataView: DataView<ArrayBuffer>,
    peerContext: PubSubPeerContext,
  ) {
    _console.log("onPeerMessage", { messageType }, dataView, peerContext);

    switch (messageType) {
      case "subscribe":
        this.#onPeerSubscribe(dataView, peerContext);
        break;
      case "unsubscribe":
        this.#onPeerUnsubscribe(dataView, peerContext);
        break;
      case "publish":
        this.#onPeerPublish(dataView, peerContext);
        break;
      default:
        _console.error(`uncaught messageType "${messageType}"`);
        break;
    }
  }

  // GUARDS
  peerSubscriptionGuardManager = new GuardManager<
    [PubSubManagerPeerSubscriptionGuardManagerArg]
  >();
  #allowPeerSubscription(
    peer: PubSubPeer,
    type: string,
    data: DataView,
    sendingPeer?: PubSubPeer,
  ) {
    return this.peerSubscriptionGuardManager.evaluate({
      peer,
      type,
      data,
      sendingPeer,
    });
  }
}

export default PubSubManager.shared;

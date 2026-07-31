import { createConsole } from "../../utils/Console.ts";
import { addEventListeners } from "../../utils/EventUtils.ts";
import BaseServer, { BaseServerClient } from "../BaseServer.ts";
import {
  default as WindowManagerServer,
  WindowManagerServerClient,
  WindowManagerServerEventMap,
} from "../../window/WindowManagerServer.ts";
import { Singleton } from "../../utils/TypeScriptUtils.ts";
import { createWindowManagerMessage } from "../../window/WindowManagerUtils.ts";

const _console = createConsole("WindowServer", { log: false });

export interface WindowServerClient
  extends BaseServerClient, WindowManagerServerClient {
  type: "window";
}

@Singleton
class WindowServer extends BaseServer<WindowServerClient> {
  static type = "window" as const;
  readonly type = WindowServer.type;

  static readonly shared: WindowServer;

  protected _init() {
    _console.log("_init");
    addEventListeners(
      WindowManagerServer,
      this.#boundWindowManagerServerEventListeners,
    );
  }

  constructor() {
    super();

    this.clearSensorConfigurationsWhenNoClients = false; // may set to true if purely a headless hub
  }

  // CLIENTS

  _sendToClient(
    client: WindowServerClient,
    arrayBuffer: ArrayBuffer,
    isWrapped?: boolean,
  ) {
    if (!super._sendToClient(client, arrayBuffer, isWrapped)) {
      return false;
    }
    const didSend = WindowManagerServer.sendToClient(
      client,
      isWrapped
        ? arrayBuffer
        : createWindowManagerMessage({
            type: "serverMessage",
            data: arrayBuffer,
          }),
    );
    if (didSend) {
      this._onSendToClient(client);
    }
    return didSend;
  }

  // WINDOW
  #boundWindowManagerServerEventListeners: {
    [K in keyof WindowManagerServerEventMap]?: (
      event: WindowManagerServerEventMap[K],
    ) => void;
  } = {
    clientConnected: this.#onWindowManagerServerClientConnected.bind(this),
    clientNotConnected:
      this.#onWindowManagerServerClientNotConnected.bind(this),
  };
  #onWindowManagerServerClientConnected(
    event: WindowManagerServerEventMap["clientConnected"],
  ) {
    const { client } = event.message;
    _console.log("onWindowManagerServerClientConnected", client);
    this._onClientConnected(client);
  }
  #onWindowManagerServerClientNotConnected(
    event: WindowManagerServerEventMap["clientNotConnected"],
  ) {
    const { client } = event.message;
    _console.log("onWindowManagerServerClientNotConnected", client);
    this._onClientNotConnected(client);
  }
}
export { WindowServer };

export default WindowServer.shared;

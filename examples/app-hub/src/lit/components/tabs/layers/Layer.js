import { waitForGlobals } from "../../../../utils/cross-origin-storage-utils.js";

const { lit, litRef, BW } = await waitForGlobals();

const { LitElement, html } = lit;
const { createRef, ref } = litRef;

import "https://ka-f.webawesome.com/webawesome@3.12.0/components/zoomable-frame/zoomable-frame.js";
import "https://ka-f.webawesome.com/webawesome@3.12.0/components/button/button.js";
import "https://ka-f.webawesome.com/webawesome@3.12.0/components/input/input.js";

import { createActiveTabContextConsumer } from "../../../contexts/activeTabContext.js";
import { createLayersContextConsumer } from "../../../contexts/layersContext.js";

/** @typedef {import("../../../../../../../build/brilliantwear.module.js").WindowManagerServerClient} WindowManagerServerClient */

class Layer extends LitElement {
  createRenderRoot() {
    return this;
  }

  static properties = {
    layer: { attribute: false },
    withoutInteraction: { type: Boolean },
    didSetupIframe: { type: Boolean },
    didIframeLoad: { type: Boolean, reflect: true, attribute: "iframe-loaded" },
    isClientConnected: {
      type: Boolean,
      reflect: true,
      attribute: "client-connected",
    },
    isDataEnabled: { type: Boolean },
  };

  /** @type {import("../../../contexts/layersContext.js").LayerContextState} */
  get _layer() {
    return this.layer;
  }

  activeTabConsumer = createActiveTabContextConsumer(
    this,
    true,
    ({ activeTab }) => {
      this.withoutInteraction = activeTab != "layers";
    },
  );

  layersConsumer = createLayersContextConsumer(this);
  /** @type {import("../../../contexts/layersContext.js").LayersContextState} */
  get layersState() {
    return this.layersConsumer.value.state;
  }
  updateLayers() {
    this.layersConsumer.value.update(this.layersState, true);
  }

  onLoad(event) {
    // console.log("onLoad", event);
    const zoomableFrame = this.querySelector("wa-zoomable-frame");
    const iframe = zoomableFrame.shadowRoot.querySelector("iframe");
    // console.log("zoomableFrame", zoomableFrame);
    // console.log("iframe", iframe);
    this.didIframeLoad = true;
    if (this._layer.iframe != iframe) {
      // console.log("assigning iframe");
      this._layer.iframe = iframe;
      this.setupIframe();
    } else {
      this.didSetupIframe = true;
    }
  }
  onError(event) {
    // console.log("onError", event);
  }

  get iframe() {
    return this._layer.iframe;
  }
  setupIframe() {
    const { iframe } = this;
    if (!iframe) {
      return;
    }
    // console.log("setupIframe", iframe);
    iframe.setAttribute("allow", "bluetooth 'none'");
    iframe.src = iframe.src;
  }

  size = "xs";

  onKeyDown(event) {
    // console.log(event);
    switch (event.key) {
      case "Enter":
        event.preventDefault();
        const src = this.inputRef.value.value;
        // console.log({ src });
        this._layer.src = src;
        this.refresh();
        this.updateLayers();
        break;
    }
  }

  onInput(event) {
    // console.log(event);
  }

  inputRef = createRef();

  refresh() {
    // console.log("refresh");
    if (this.iframe) {
      this.didSetupIframe = false;
      this.didIframeLoad = false;
      this.iframe.src = this._layer.src;
    }
  }

  onClientConnected(event) {
    const client = event.detail.client;
    // console.log("onClientConnected", event, client);
    this.client = client;
    this.isClientConnected = true;
  }
  onClientNotConnected(event) {
    const client = event.detail.client;
    // console.log("onClientNotConnected", event, client);
    this.client = undefined;
    this.isClientConnected = false;
  }

  connectedCallback() {
    super.connectedCallback();

    this.isDataEnabled = true;

    this.abortController = new AbortController();
    const signal = this.abortController.signal;
    const options = { signal };

    BW.ServerManager.clientToDeviceGuardManager.add(({ client, message }) => {
      if (client != this.client) {
        return true;
      }
      // console.log("clientToDeviceGuardManager", client, message);
      switch (message?.type) {
        case "setSensorConfiguration":
        case "microphoneCommand":
        case "cameraCommand":
          return this.isDataEnabled;
        default:
          return true;
      }
    }, options);
    BW.ServerManager.deviceToClientGuardManager.add(({ client, message }) => {
      if (client != this.client) {
        return true;
      }
      // console.log("deviceToClientGuardManager", client, message);
      switch (message?.type) {
        case "sensorData":
          return this.isDataEnabled;
        default:
          return true;
      }
    }, options);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.abortController.abort();
  }

  /** @type {WindowManagerServerClient?} */
  client;

  toggleDataEnabled(event) {
    // console.log("toggleDataEnabled", event);
    this.isDataEnabled = !this.isDataEnabled;
  }

  render() {
    // console.log({
    //   isClientConnected: this.isClientConnected,
    //   didIframeLoad: this.didIframeLoad,
    //   didSetupIframe: this.didSetupIframe,
    //   withoutInteraction: this.withoutInteraction,
    //   isDataEnabled: this.isDataEnabled,
    // });
    return html`<div
      class="wa-stack wa-gap-2xs bw-wa-stack-touch-reverse"
      @bw-client-connected=${this.onClientConnected}
      @bw-client-not-connected=${this.onClientNotConnected}
    >
      <div class="wa-cluster wa-gap-2xs wa-flex-nowrap">
        <wa-button
          @click=${this.refresh}
          variant="neutral"
          size=${this.size}
          appearance="accent"
          ><wa-icon name="rotate-right" label="refresh"></wa-icon
        ></wa-button>
        <wa-input
          size=${this.size}
          placeholder="example.com"
          type="url"
          inputmode="url"
          enterkeyhint="go"
          autocapitalize="off"
          autocomplete="off"
          autocorrect="off"
          .defaultValue=${this._layer.src}
          @input=${this.onInput}
          @keydown=${this.onKeyDown}
          ${ref(this.inputRef)}
          style="flex: 1;"
        >
        </wa-input>
        <wa-button
          ?disabled=${!this.isClientConnected}
          @click=${this.toggleDataEnabled}
          variant="neutral"
          size=${this.size}
          appearance="accent"
          ><wa-icon
            name=${this.isDataEnabled ? "eye" : "eye-slash"}
            label="settings"
          ></wa-icon
        ></wa-button>
      </div>
      <wa-zoomable-frame
        ?data-hidden=${!this.didSetupIframe}
        @load=${this.onLoad}
        @error=${this.onError}
        sandbox="allow-scripts allow-same-origin"
        without-controls
        with-theme-sync
        ?without-interaction=${this.withoutInteraction}
        src=${this._layer.src}
      ></wa-zoomable-frame>
    </div>`;
  }
}

customElements.define("bw-layer", Layer);

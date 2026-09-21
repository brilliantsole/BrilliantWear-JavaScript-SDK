import { waitForGlobals } from "../../../../utils/cross-origin-storage-utils.js";

const { lit, litRef } = await waitForGlobals();

const { LitElement, html } = lit;
const { createRef, ref } = litRef;

import "https://ka-f.webawesome.com/webawesome@3.12.0/components/zoomable-frame/zoomable-frame.js";
import "https://ka-f.webawesome.com/webawesome@3.12.0/components/button/button.js";
import "https://ka-f.webawesome.com/webawesome@3.12.0/components/input/input.js";

import { createActiveTabContextConsumer } from "../../../contexts/activeTabContext.js";

class Layer extends LitElement {
  createRenderRoot() {
    return this;
  }

  static properties = {
    layer: { attribute: false },
    withoutInteraction: { type: Boolean },
    didSetupIframe: { type: Boolean },
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

  onLoad() {
    const zoomableFrame = this.querySelector("wa-zoomable-frame");
    const iframe = zoomableFrame.shadowRoot.querySelector("iframe");
    // console.log("zoomableFrame", zoomableFrame);
    // console.log("iframe", iframe);
    if (this._layer.iframe != iframe) {
      console.log("assigning iframe");
      this._layer.iframe = iframe;
      this.setupIframe();
    } else {
      this.didSetupIframe = true;
    }
  }

  get iframe() {
    return this._layer.iframe;
  }
  setupIframe() {
    const { iframe } = this;
    if (!iframe) {
      return;
    }
    console.log("setupIframe", iframe);
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
        console.log({ src });
        this._layer.src = src;
        this.refresh();
        break;
    }
  }

  onInput(event) {
    // console.log(event);
  }

  inputRef = createRef();

  refresh() {
    console.log("refresh");
    if (this.iframe) {
      this.didSetupIframe = false;
      this.iframe.src = this._layer.src;
    }
  }

  render() {
    // console.log("withoutInteraction", this.withoutInteraction);
    return html`<div class="wa-stack wa-gap-0">
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
          style="flex: 1"
        >
        </wa-input>
        <wa-button variant="neutral" size=${this.size} appearance="accent"
          ><wa-icon name="gear" label="settings"></wa-icon
        ></wa-button>
      </div>
      <wa-zoomable-frame
        ?data-hidden=${!this.didSetupIframe}
        @load=${this.onLoad}
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

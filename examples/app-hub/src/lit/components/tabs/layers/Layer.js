import { waitForGlobals } from "../../../../utils/cross-origin-storage-utils.js";

const { lit } = await waitForGlobals();

const { LitElement, html } = lit;

import "https://ka-f.webawesome.com/webawesome@3.12.0/components/zoomable-frame/zoomable-frame.js";
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

  render() {
    // console.log("withoutInteraction", this.withoutInteraction);
    return html`<wa-zoomable-frame
      ?data-hidden=${!this.didSetupIframe}
      @load=${this.onLoad}
      sandbox="allow-scripts allow-same-origin"
      without-controls
      with-theme-sync
      ?without-interaction=${this.withoutInteraction}
      src=${this._layer.src}
    ></wa-zoomable-frame>`;
  }
}

customElements.define("bw-layer", Layer);

import { waitForGlobals } from "../../../../utils/cross-origin-storage-utils.js";

const { lit } = await waitForGlobals();

const { LitElement, html } = lit;

import "https://ka-f.webawesome.com/webawesome@3.12.0/components/zoomable-frame/zoomable-frame.js";

class Layer extends LitElement {
  createRenderRoot() {
    return this;
  }

  static properties = {
    layer: { attribute: false },
  };

  /** @type {import("../../../contexts/layersContext.js").LayerContextState} */
  get _layer() {
    return this.layer;
  }

  render() {
    console.log("layer", this._layer);
    return html`<wa-zoomable-frame
      sandbox="allow-scripts allow-same-origin"
      without-controls
      with-theme-sync
      src="apps/test"
      allow="bluetooth 'none'"
    ></wa-zoomable-frame>`;
  }
}

customElements.define("bw-layer", Layer);

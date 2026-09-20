import { waitForGlobals } from "../../../../utils/cross-origin-storage-utils.js";

const { lit, litRepeat } = await waitForGlobals();

const { LitElement, html } = lit;
const { repeat } = litRepeat;

import { createLayersContextConsumer } from "../../../contexts/layersContext.js";
import "./Layer.js";

class Layers extends LitElement {
  createRenderRoot() {
    return this;
  }

  layersConsumer = createLayersContextConsumer(this, true);
  /** @type {import("../../../contexts/layersContext.js").LayersContextState} */
  get layersState() {
    return this.layersConsumer.value.state;
  }
  get layers() {
    return this.layersState.layers;
  }

  render() {
    return html`${repeat(
      this.layers,
      (layer) => layer,
      (layer) => html`<bw-layer .layer=${layer}></bw-layer>`,
    )}`;
  }
}

customElements.define("bw-layers", Layers);

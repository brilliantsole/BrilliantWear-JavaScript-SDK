import { waitForGlobals } from "../../../../utils/cross-origin-storage-utils.js";

const { lit } = await waitForGlobals();

const { LitElement, html } = lit;

class LayersTab extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html``;
  }
}

customElements.define("bw-layers-tab", LayersTab);

import { waitForGlobals } from "../../../utils/cross-origin-storage-utils.js";

const { lit } = await waitForGlobals();

const { LitElement, html, css } = lit;

class LayersElement extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <h1>Layers</h1>
      <h1>Layers</h1>
      <h1>Layers</h1>
      <h1>Layers</h1>
      <h1>Layers</h1>
      <h1>Layers</h1>
      <h1>Layers</h1>
      <h1>Layers</h1>
      <h1>Layers</h1>
      <h1>Layers</h1>
      <h1>Layers</h1>
    `;
  }
}

customElements.define("bw-layers", LayersElement);

import { waitForGlobals } from "../../../../utils/cross-origin-storage-utils.js";
import { createLayersContextConsumer } from "../../../contexts/layersContext.js";
import { tabIcons, tabVariants } from "../../tabs/tabs.js";
const { lit } = await waitForGlobals();

const { LitElement, html } = lit;

import "../HeaderButton.js";

class NavButtonLayers extends LitElement {
  createRenderRoot() {
    return this;
  }

  static properties = {
    numberOfLayers: { type: Number },
  };

  layersConsumer = createLayersContextConsumer(this, false, (state) => {
    this.numberOfLayers = state.layers.length;
  });

  render() {
    const { name } = tabIcons["layers"];

    return html`<bw-header-button
      href="/layers"
      icon-name=${name}
      variant=${tabVariants["layers"]}
      ?use-slot=${this.numberOfLayers > 0}
    >
      Layers
      <div slot="badge">${this.numberOfLayers}</div>
    </bw-header-button>`;
  }
}
customElements.define("bw-nav-button-layers", NavButtonLayers);

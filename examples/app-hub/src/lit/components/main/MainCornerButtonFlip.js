import { waitForGlobals } from "../../../utils/cross-origin-storage-utils.js";
const { lit } = await waitForGlobals();

const { LitElement, html, css } = lit;

import "./MainCornerButton.js";

class MainCornerButtonFlip extends LitElement {
  createRenderRoot() {
    return this;
  }

  onClick(event) {
    this.dispatchEvent(
      new CustomEvent("bw-flip", {
        bubbles: true,
        detail: { overrideAnchorHeader: true },
      }),
    );
  }

  render() {
    return html`<bw-main-corner-button
      icon-name="arrow-right-arrow-left"
      label="flip"
      @click="${this.onClick}"
    >
    </bw-main-corner-button>`;
  }
}
customElements.define("bw-main-corner-button-flip", MainCornerButtonFlip);

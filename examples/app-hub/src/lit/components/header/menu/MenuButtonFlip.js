import { waitForGlobals } from "../../../../utils/cross-origin-storage-utils.js";
const { lit } = await waitForGlobals();

const { LitElement, html, css } = lit;

import "../HeaderButton.js";

class MenuButtonFlip extends LitElement {
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
    return html`<bw-header-button
      icon-name="arrow-right-arrow-left"
      variant="neutral"
      @click=${this.onClick}
    >
      Flip
    </bw-header-button>`;
  }
}
customElements.define("bw-menu-button-flip", MenuButtonFlip);

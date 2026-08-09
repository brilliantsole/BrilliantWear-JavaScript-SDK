import { waitForGlobals } from "../../../utils/cross-origin-storage-utils.js";
const { lit } = await waitForGlobals();

const { LitElement, html, css } = lit;

import "./NavButton.js";

class NavButtonFlip extends LitElement {
  static styles = css`
    @media (pointer: fine) {
      :host {
        display: none;
      }
    }
  `;
  onClick(event) {
    // FILL
  }

  render() {
    return html`<bw-nav-button
      icon-name="arrow-right-arrow-left"
      variant="neutral"
      @click=${this.onClick}
    >
      Flip
    </bw-nav-button>`;
  }
}
customElements.define("bw-nav-button-flip", NavButtonFlip);

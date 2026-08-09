import { waitForGlobals } from "../../../utils/cross-origin-storage-utils.js";
import { createLeftHandedContextConsumer } from "../../contexts/leftHandedContext.js";

const { lit, litContext } = await waitForGlobals();
const { ContextConsumer } = litContext;

const { LitElement, html, css } = lit;

import "./NavButton.js";

class NavButtonFlip extends LitElement {
  constructor() {
    super();

    this._leftHandedConsumer = createLeftHandedContextConsumer(this);
  }

  static styles = css`
    @media (pointer: fine) {
      :host {
        display: none;
      }
    }
  `;

  onClick(event) {
    const { isLeftHanded } = this._leftHandedConsumer.value.state;
    this._leftHandedConsumer.value.update({ isLeftHanded: !isLeftHanded });
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

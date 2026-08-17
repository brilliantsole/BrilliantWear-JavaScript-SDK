import { waitForGlobals } from "../../../utils/cross-origin-storage-utils.js";
import { createAnchorNavContextConsumer } from "../../contexts/anchorNavContext.js";
import { createIsLeftHandedContextConsumer } from "../../contexts/isLeftHandedContext.js";

const { lit, litContext } = await waitForGlobals();
const { ContextConsumer } = litContext;

const { LitElement, html, css } = lit;

import "./NavButton.js";

class NavButtonFlip extends LitElement {
  constructor() {
    super();

    this._anchorNavConsumer = createAnchorNavContextConsumer(this);
    this._isLeftHandedConsumer = createIsLeftHandedContextConsumer(this);
  }

  onClick(event) {
    const { isLeftHanded } = this._isLeftHandedConsumer.value.state;
    this._anchorNavConsumer.value.update({ anchorNav: false });
    this._isLeftHandedConsumer.value.update({ isLeftHanded: !isLeftHanded });
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

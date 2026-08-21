import { waitForGlobals } from "../../../utils/cross-origin-storage-utils.js";
import { createAnchorHeaderContextConsumer } from "../../contexts/anchorHeaderContext.js";
import { createIsLeftHandedContextConsumer } from "../../contexts/isLeftHandedContext.js";

const { lit } = await waitForGlobals();

const { LitElement, html, css } = lit;

import "./MainCornerButton.js";

class MainCornerButtonFlip extends LitElement {
  constructor() {
    super();

    this._anchorHeaderConsumer = createAnchorHeaderContextConsumer(this);
    this._isLeftHandedConsumer = createIsLeftHandedContextConsumer(this);
  }

  onClick(event) {
    const { isLeftHanded } = this._isLeftHandedConsumer.value.state;
    this._anchorHeaderConsumer.value.update({ anchorHeader: false });
    this._isLeftHandedConsumer.value.update({ isLeftHanded: !isLeftHanded });
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

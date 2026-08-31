import { waitForGlobals } from "../../../../../utils/cross-origin-storage-utils.js";
import { createAnchorHeaderContextConsumer } from "../../../../contexts/anchorHeaderContext.js";
import { createIsHeaderHiddenContextConsumer } from "../../../../contexts/isHeaderHiddenContext.js";

const { lit, litRef } = await waitForGlobals();

const { LitElement, html } = lit;
const { ref, createRef } = litRef;

import "../../../utils/Toggle.js";

class SettingsAnchorHeaderToggle extends LitElement {
  createRenderRoot() {
    return this;
  }

  static properties = {
    switch: { type: Boolean },
  };

  ref = createRef();
  _anchorHeaderConsumer = createAnchorHeaderContextConsumer(this, true, () => {
    if (this.ref.value) {
      this.ref.value.checked = this.checked;
    }
  });

  /** @type {import("../../../../contexts/anchorHeaderContext.js").AnchorHeaderContextState} */
  get anchorHeaderState() {
    return this._anchorHeaderConsumer.value.state;
  }
  get anchorHeader() {
    return this.anchorHeaderState.anchorHeader;
  }

  _onChange(event) {
    const { checked } = event.target;
    event.target.checked = this.checked;
    this.anchorHeaderState.anchorHeader = checked;
    this._anchorHeaderConsumer.value.update(this.anchorHeaderState, true);
  }

  get checked() {
    return this.anchorHeader;
  }

  render() {
    return html`<bw-toggle
      data-touch-only
      ${ref(this.ref)}
      ?checked=${this.checked}
      @change=${this._onChange}
      label="Anchor Header"
      ?switch=${this.switch}
    ></bw-toggle>`;
  }
}

customElements.define(
  "bw-settings-anchor-header-toggle",
  SettingsAnchorHeaderToggle,
);

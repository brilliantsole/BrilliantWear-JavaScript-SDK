import { waitForGlobals } from "../../../../../utils/cross-origin-storage-utils.js";
import { createIsHeaderHiddenContextConsumer } from "../../../../contexts/isHeaderHiddenContext.js";

const { lit, litRef } = await waitForGlobals();

const { LitElement, html } = lit;
const { ref, createRef } = litRef;

import "../../../utils/Toggle.js";

class SettingsHideHeaderToggle extends LitElement {
  createRenderRoot() {
    return this;
  }

  static properties = {
    switch: { type: Boolean },
  };

  ref = createRef();
  _isHeaderHiddenConsumer = createIsHeaderHiddenContextConsumer(
    this,
    true,
    () => {
      if (this.ref.value) {
        this.ref.value.checked = this.checked;
      }
    },
  );

  /** @type {import("../../../../contexts/isHeaderHiddenContext.js").IsHeaderHiddenContextState} */
  get isHeaderHiddenState() {
    return this._isHeaderHiddenConsumer.value.state;
  }
  get isHeaderHidden() {
    return this.isHeaderHiddenState.isHeaderHidden;
  }

  _onChange(event) {
    const { checked } = event.target;
    event.target.checked = this.checked;
    this.isHeaderHiddenState.isHeaderHidden = checked;
    this._isHeaderHiddenConsumer.value.update(this.isHeaderHiddenState, true);
  }

  get checked() {
    return this.isHeaderHidden;
  }

  render() {
    return html`<bw-toggle
      data-touch-only
      ${ref(this.ref)}
      ?checked=${this.checked}
      @change=${this._onChange}
      label="Hide Header"
      ?switch=${this.switch}
    ></bw-toggle>`;
  }
}

customElements.define(
  "bw-settings-hide-header-toggle",
  SettingsHideHeaderToggle,
);

import { waitForGlobals } from "../../../../../utils/cross-origin-storage-utils.js";

const { lit, litRef } = await waitForGlobals();

const { LitElement, html } = lit;
const { ref, createRef } = litRef;

import "../../../utils/Toggle.js";

import { createToggleHeaderHiddenActionButtonContextConsumer } from "../../../../contexts/toggleHeaderHiddenActionButtonContext.js";

class SettingsToggleHeaderHiddenActionButton extends LitElement {
  createRenderRoot() {
    return this;
  }

  static properties = {
    switch: { type: Boolean },
  };

  ref = createRef();
  toggleHeaderHiddenActionButtonConsumer =
    createToggleHeaderHiddenActionButtonContextConsumer(this, true, () => {
      if (this.ref.value) {
        this.ref.value.checked = this.checked;
      }
    });

  /** @type {import("../../../../contexts/toggleHeaderHiddenActionButtonContext.js").ToggleHeaderHiddenActionButtonContextState} */
  get toggleHeaderHiddenActionButtonState() {
    return this.toggleHeaderHiddenActionButtonConsumer.value.state;
  }
  get isToggleHeaderHiddenActionButtonVisible() {
    return this.toggleHeaderHiddenActionButtonState.visible;
  }

  get checked() {
    return this.isToggleHeaderHiddenActionButtonVisible;
  }

  _onChange(event) {
    const { checked } = event.target;
    event.target.checked = this.checked;
    this.toggleHeaderHiddenActionButtonState.visible = checked;

    this.toggleHeaderHiddenActionButtonConsumer.value.update(
      this.toggleHeaderHiddenActionButtonState,
      true,
    );
  }

  render() {
    return html`<bw-toggle
      ${ref(this.ref)}
      ?checked=${this.checked}
      @change=${this._onChange}
      label="Hide Header"
      ?switch=${this.switch}
    ></bw-toggle>`;
  }
}

customElements.define(
  "bw-settings-toggle-header-hidden-action-button-toggle",
  SettingsToggleHeaderHiddenActionButton,
);

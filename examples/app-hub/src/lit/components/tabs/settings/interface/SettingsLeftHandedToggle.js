import { waitForGlobals } from "../../../../../utils/cross-origin-storage-utils.js";

const { lit, litRef } = await waitForGlobals();

const { LitElement, html } = lit;
const { ref, createRef } = litRef;

import "../../../utils/Toggle.js";

import { createIsLeftHandedContextConsumer } from "../../../../contexts/isLeftHandedContext.js";

class SettingsThemeToggle extends LitElement {
  createRenderRoot() {
    return this;
  }

  static properties = {
    switch: { type: Boolean },
  };

  ref = createRef();
  _isLeftHandedConsumer = createIsLeftHandedContextConsumer(this, true, () => {
    if (this.ref.value) {
      this.ref.value.checked = this.checked;
    }
  });

  /** @type {import("../../../../contexts/isLeftHandedContext.js").IsLeftHandedContextState} */
  get isLeftHandedState() {
    return this._isLeftHandedConsumer.value.state;
  }
  get isLeftHanded() {
    return this.isLeftHandedState.isLeftHanded;
  }

  _onChange(event) {
    const { checked } = event.target;
    event.target.checked = this.checked;
    this.isLeftHandedState.isLeftHanded = !checked;
    this._isLeftHandedConsumer.value.update(this.isLeftHandedState, true);
  }

  get checked() {
    return !this.isLeftHanded;
  }

  render() {
    return html`<bw-toggle
      ${ref(this.ref)}
      ?checked=${this.checked}
      @change=${this._onChange}
      label="Right Handed"
      ?switch=${this.switch}
    ></bw-toggle>`;
  }
}

customElements.define("bw-settings-left-handed-toggle", SettingsThemeToggle);

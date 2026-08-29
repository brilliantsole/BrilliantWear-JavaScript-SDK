import { waitForGlobals } from "../../../../../../utils/cross-origin-storage-utils.js";

const { lit, litRef } = await waitForGlobals();

const { LitElement, html } = lit;
const { ref, createRef } = litRef;

import "../../../../utils/Toggle.js";

import { createDisableTransitionsContextConsumer } from "../../../../../contexts/disableTransitionsContext.js";

class SettingsTransitionsToggle extends LitElement {
  createRenderRoot() {
    return this;
  }

  static properties = {
    switch: { type: Boolean },
  };

  ref = createRef();
  _transitionsConsumer = createDisableTransitionsContextConsumer(
    this,
    true,
    () => {
      if (this.ref.value) {
        this.ref.value.checked = this.checked;
      }
    },
  );

  /** @type {import("../../../../contexts/disableTransitionsContext.js").DisableTransitionsContextState} */
  get disableTransitionsContextState() {
    return this._transitionsConsumer.value.state;
  }
  get isTransitionsDisabled() {
    return this.disableTransitionsContextState.disableTransitions;
  }

  get checked() {
    return !this.isTransitionsDisabled;
  }

  _onChange(event) {
    const { checked } = event.target;
    event.target.checked = this.checked;
    this.disableTransitionsContextState.disableTransitions = !checked;

    this._transitionsConsumer.value.update(
      this.disableTransitionsContextState,
      true,
    );
  }

  render() {
    return html`<bw-toggle
      ${ref(this.ref)}
      ?checked=${this.checked}
      @change=${this._onChange}
      label="Transitions"
      ?switch=${this.switch}
    ></bw-toggle>`;
  }
}

customElements.define(
  "bw-settings-transitions-toggle",
  SettingsTransitionsToggle,
);

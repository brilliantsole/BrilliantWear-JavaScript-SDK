import { waitForGlobals } from "../../../../../utils/cross-origin-storage-utils.js";

const { lit, litRef } = await waitForGlobals();

const { LitElement, html } = lit;
const { ref, createRef } = litRef;

import "https://ka-f.webawesome.com/webawesome@3.12.0/components/switch/switch.js";
import "https://ka-f.webawesome.com/webawesome@3.12.0/components/checkbox/checkbox.js";

import { createDisableTransitionsContextConsumer } from "../../../../contexts/disableTransitionsContext.js";

class SettingsTransitionsToggle extends LitElement {
  createRenderRoot() {
    return this;
  }

  static properties = {
    switch: { type: Boolean, reflect: true },
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

  _label = "Transitions";

  render() {
    if (this.switch) {
      return html`<wa-switch
        ${ref(this.ref)}
        ?checked=${this.checked}
        @change=${this._onChange}
        >${this._label}</wa-switch
      >`;
    } else {
      return html`<wa-checkbox
        ${ref(this.ref)}
        ?checked=${this.checked}
        @change=${this._onChange}
        >${this._label}</wa-checkbox
      >`;
    }
  }
}

customElements.define(
  "bw-settings-transitions-toggle",
  SettingsTransitionsToggle,
);

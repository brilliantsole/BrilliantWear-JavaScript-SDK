import { waitForGlobals } from "../../../../../utils/cross-origin-storage-utils.js";

const { lit, litRef } = await waitForGlobals();

const { LitElement, html } = lit;
const { ref, createRef } = litRef;

import "https://ka-f.webawesome.com/webawesome@3.12.0/components/switch/switch.js";
import "https://ka-f.webawesome.com/webawesome@3.12.0/components/checkbox/checkbox.js";

import { createDisableViewTransitionsContextConsumer } from "../../../../contexts/disableViewTransitionsContext.js";

class SettingsViewTransitionsToggle extends LitElement {
  createRenderRoot() {
    return this;
  }

  static properties = {
    switch: { type: Boolean, reflect: true },
  };

  ref = createRef();
  _viewTransitionsConsumer = createDisableViewTransitionsContextConsumer(
    this,
    true,
    () => {
      if (this.ref.value) {
        this.ref.value.checked = this.checked;
      }
    },
  );

  /** @type {import("../../../../contexts/disableViewTransitionsContext.js").DisableViewTransitionsContextState} */
  get disableViewTransitionsContextState() {
    return this._viewTransitionsConsumer.value.state;
  }
  get isViewTransitionsDisabled() {
    return this.disableViewTransitionsContextState.disableViewTransitions;
  }

  get checked() {
    return !this.isViewTransitionsDisabled;
  }

  _onChange(event) {
    const { checked } = event.target;
    event.target.checked = this.checked;
    this.disableViewTransitionsContextState.disableViewTransitions = !checked;

    this._viewTransitionsConsumer.value.update(
      this.disableViewTransitionsContextState,
      true,
    );
  }

  _label = "View Transitions";

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
  "bw-settings-view-transitions-toggle",
  SettingsViewTransitionsToggle,
);

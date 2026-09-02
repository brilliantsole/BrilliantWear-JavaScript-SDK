import { waitForGlobals } from "../../../../../../utils/cross-origin-storage-utils.js";

const { lit, litRef } = await waitForGlobals();

const { LitElement, html } = lit;
const { ref, createRef } = litRef;

import { createDisableViewTransitionsContextConsumer } from "../../../../../contexts/disableViewTransitionsContext.js";

class SettingsViewTransitionsToggle extends LitElement {
  createRenderRoot() {
    return this;
  }

  static properties = {
    switch: { type: Boolean },
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

  /** @type {import("../../../../../contexts/disableViewTransitionsContext.js").DisableViewTransitionsContextState} */
  get disableViewTransitionsState() {
    return this._viewTransitionsConsumer.value.state;
  }
  get isViewTransitionsDisabled() {
    return this.disableViewTransitionsState.disableViewTransitions;
  }

  get checked() {
    return !this.isViewTransitionsDisabled;
  }

  _onChange(event) {
    const { checked } = event.target;
    event.target.checked = this.checked;
    this.disableViewTransitionsState.disableViewTransitions = !checked;

    this._viewTransitionsConsumer.value.update(
      this.disableViewTransitionsState,
      true,
    );
  }

  render() {
    return html`<bw-toggle
      ${ref(this.ref)}
      ?checked=${this.checked}
      @change=${this._onChange}
      label="View Transitions"
      ?switch=${this.switch}
    ></bw-toggle>`;
  }
}

customElements.define(
  "bw-settings-view-transitions-toggle",
  SettingsViewTransitionsToggle,
);

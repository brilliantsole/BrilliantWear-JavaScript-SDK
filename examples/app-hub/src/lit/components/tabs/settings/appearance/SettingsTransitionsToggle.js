import { waitForGlobals } from "../../../../../utils/cross-origin-storage-utils.js";

const { lit } = await waitForGlobals();

const { LitElement, html } = lit;

import "https://ka-f.webawesome.com/webawesome@3.12.0/components/switch/switch.js";
import { createDisableTransitionsContextConsumer } from "../../../../contexts/disableTransitionsContext.js";

class SettingsTransitionsToggleElement extends LitElement {
  createRenderRoot() {
    return this;
  }

  constructor() {
    super();
    this._transitionsConsumer = createDisableTransitionsContextConsumer(
      this,
      true,
    );
  }

  /** @type {import("../../../../contexts/disableTransitionsContext.js").DisableTransitionsContextState} */
  get disableTransitionsContextState() {
    return this._transitionsConsumer.value.state;
  }
  get isTransitionsDisabled() {
    return this.disableTransitionsContextState.disableTransitions;
  }

  _onChange(event) {
    this.disableTransitionsContextState.disableTransitions =
      !event.target.checked;
    this._transitionsConsumer.value.update(
      this.disableTransitionsContextState,
      true,
    );
  }

  render() {
    return html`<wa-switch
      ?checked=${!this.isTransitionsDisabled}
      @change=${this._onChange}
      >Enable Transitions</wa-switch
    >`;
  }
}

customElements.define(
  "bw-settings-transitions-toggle",
  SettingsTransitionsToggleElement,
);

import { waitForGlobals } from "../../../../../utils/cross-origin-storage-utils.js";

const { lit } = await waitForGlobals();

const { LitElement, html } = lit;

import "https://ka-f.webawesome.com/webawesome@3.12.0/components/switch/switch.js";
import { createDisableViewTransitionsContextConsumer } from "../../../../contexts/disableViewTransitionsContext.js";

class SettingsViewTransitionsToggleElement extends LitElement {
  createRenderRoot() {
    return this;
  }

  constructor() {
    super();
    this._viewTransitionsConsumer = createDisableViewTransitionsContextConsumer(
      this,
      true,
    );
  }

  /** @type {import("../../../../contexts/disableViewTransitionsContext.js").DisableViewTransitionsContextState} */
  get disableViewTransitionsContextState() {
    return this._viewTransitionsConsumer.value.state;
  }
  get isViewTransitionsDisabled() {
    return this.disableViewTransitionsContextState.disableViewTransitions;
  }

  _onChange(event) {
    this.disableViewTransitionsContextState.disableViewTransitions =
      !event.target.checked;
    this._viewTransitionsConsumer.value.update(
      this.disableViewTransitionsContextState,
      true,
    );
  }

  render() {
    return html`<wa-switch
      ?checked=${!this.isViewTransitionsDisabled}
      @change=${this._onChange}
      >Enable View Transitions</wa-switch
    >`;
  }
}

customElements.define(
  "bw-settings-view-transitions-toggle",
  SettingsViewTransitionsToggleElement,
);

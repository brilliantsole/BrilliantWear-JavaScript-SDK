import { waitForGlobals } from "../../../../../utils/cross-origin-storage-utils.js";

const { lit } = await waitForGlobals();

const { LitElement, html } = lit;

import "https://ka-f.webawesome.com/webawesome@3.12.0/components/switch/switch.js";
import { createDisableTransitionsContextConsumer } from "../../../../contexts/disableTransitionsContext.js";
import { createDisableViewTransitionsContextConsumer } from "../../../../contexts/disableViewTransitionsContext.js";

class SettingsAnimationsToggleElement extends LitElement {
  createRenderRoot() {
    return this;
  }

  constructor() {
    super();
    this._transitionsConsumer = createDisableTransitionsContextConsumer(
      this,
      true,
    );
    this._viewTransitionsConsumer = createDisableViewTransitionsContextConsumer(
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

  /** @type {import("../../../../contexts/disableViewTransitionsContext.js").DisableViewTransitionsContextState} */
  get disableViewTransitionsContextState() {
    return this._viewTransitionsConsumer.value.state;
  }
  get isViewTransitionsDisabled() {
    return this.disableViewTransitionsContextState.disableViewTransitions;
  }

  get isAnimationsDisabled() {
    return this.isTransitionsDisabled || this.isViewTransitionsDisabled;
  }

  _onChange(event) {
    const isAnimationsDisabled = !event.target.checked;
    this.disableTransitionsContextState.disableTransitions =
      isAnimationsDisabled;
    this._transitionsConsumer.value.update(
      this.disableTransitionsContextState,
      true,
    );

    this.disableViewTransitionsContextState.disableViewTransitions =
      isAnimationsDisabled;
    this._viewTransitionsConsumer.value.update(
      this.disableViewTransitionsContextState,
      true,
    );
  }

  render() {
    return html`<wa-switch
      ?checked=${!this.isAnimationsDisabled}
      @change=${this._onChange}
      >Enable Animations</wa-switch
    >`;
  }
}

customElements.define(
  "bw-settings-animations-toggle",
  SettingsAnimationsToggleElement,
);

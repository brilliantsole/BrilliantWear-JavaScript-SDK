import { waitForGlobals } from "../../../../../utils/cross-origin-storage-utils.js";

const { lit, litRef } = await waitForGlobals();

const { LitElement, html } = lit;
const { ref, createRef } = litRef;

import "../../../utils/Toggle.js";

import { createSwipeToChangeTabGestureContextConsumer } from "../../../../contexts/swipeToChangeTabGestureContext.js";

class SettingsSwipeToChangeTabGestureToggle extends LitElement {
  createRenderRoot() {
    return this;
  }

  static properties = {
    switch: { type: Boolean },
  };

  ref = createRef();
  swipeToChangeTabConsumer = createSwipeToChangeTabGestureContextConsumer(
    this,
    true,
    () => {
      if (this.ref.value) {
        this.ref.value.checked = this.checked;
      }
    },
  );

  /** @type {import("../../../../contexts/swipeToChangeTabGestureContext.js").SwipeToChangeTabGestureContextState} */
  get swipeToChangeTabState() {
    return this.swipeToChangeTabConsumer.value.state;
  }
  get isSwipeToChangeTabEnabled() {
    return this.swipeToChangeTabState.isSwipeToChangeTabEnabled;
  }

  get checked() {
    return this.isSwipeToChangeTabEnabled;
  }

  _onChange(event) {
    const { checked } = event.target;
    event.target.checked = this.checked;
    this.swipeToChangeTabState.isSwipeToChangeTabEnabled = checked;

    this.swipeToChangeTabConsumer.value.update(
      this.swipeToChangeTabState,
      true,
    );
  }

  render() {
    return html`<bw-toggle
      ${ref(this.ref)}
      ?checked=${this.checked}
      @change=${this._onChange}
      label="Swipe Tabs"
      ?switch=${this.switch}
    ></bw-toggle>`;
  }
}

customElements.define(
  "bw-settings-swipe-to-change-tab-gesture-toggle",
  SettingsSwipeToChangeTabGestureToggle,
);

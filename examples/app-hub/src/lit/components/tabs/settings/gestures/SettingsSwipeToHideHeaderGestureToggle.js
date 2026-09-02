import { waitForGlobals } from "../../../../../utils/cross-origin-storage-utils.js";

const { lit, litRef } = await waitForGlobals();

const { LitElement, html } = lit;
const { ref, createRef } = litRef;

import "../../../utils/Toggle.js";

import { createSwipeToHideHeaderGestureContextConsumer } from "../../../../contexts/swipeToHideHeaderGestureContext.js";

class SettingsSwipeToHideHeaderGestureToggle extends LitElement {
  createRenderRoot() {
    return this;
  }

  static properties = {
    switch: { type: Boolean },
  };

  ref = createRef();
  swipeToHideHeaderConsumer = createSwipeToHideHeaderGestureContextConsumer(
    this,
    true,
    () => {
      if (this.ref.value) {
        this.ref.value.checked = this.checked;
      }
    },
  );

  /** @type {import("../../../../contexts/swipeToHideHeaderGestureContext.js").SwipeToHideHeaderGestureContextState} */
  get swipeToHideHeaderState() {
    return this.swipeToHideHeaderConsumer.value.state;
  }
  get isSwipeToHideHeaderEnabled() {
    return this.swipeToHideHeaderState.isSwipeToHideHeaderEnabled;
  }

  get checked() {
    return this.isSwipeToHideHeaderEnabled;
  }

  _onChange(event) {
    const { checked } = event.target;
    event.target.checked = this.checked;
    this.swipeToHideHeaderState.isSwipeToHideHeaderEnabled = checked;

    this.swipeToHideHeaderConsumer.value.update(
      this.swipeToHideHeaderState,
      true,
    );
  }

  render() {
    return html`<bw-toggle
      ${ref(this.ref)}
      ?checked=${this.checked}
      @change=${this._onChange}
      label="Swipe away Header"
      ?switch=${this.switch}
    ></bw-toggle>`;
  }
}

customElements.define(
  "bw-settings-swipe-to-hide-header-gesture-toggle",
  SettingsSwipeToHideHeaderGestureToggle,
);

import { waitForGlobals } from "../../../../../utils/cross-origin-storage-utils.js";

const { lit, litRef } = await waitForGlobals();

const { LitElement, html } = lit;
const { ref, createRef } = litRef;

import "../../../utils/Toggle.js";
import { createSwipeToChangeTabGestureContextConsumer } from "../../../../contexts/swipeToChangeTabGestureContext.js";
import { createSwipeToHideHeaderGestureContextConsumer } from "../../../../contexts/swipeToHideHeaderGestureContext.js";

import "./SettingsSwipeToHideHeaderGestureToggle.js";
import "./SettingsSwipeToChangeTabGestureToggle.js";

class SettingsGesturesTreeElement extends LitElement {
  createRenderRoot() {
    return this;
  }

  static properties = {
    switch: { type: Boolean },
  };

  ref = createRef();

  _swipeToChangeTabGestureConsumer =
    createSwipeToChangeTabGestureContextConsumer(this, true, () => {
      this._updateChecked();
    });
  /** @type {import("../../../../contexts/swipeToChangeTabGestureContext.js").SwipeToChangeTabGestureContextState} */
  get swipeToChangeTabGestureState() {
    return this._swipeToChangeTabGestureConsumer.value.state;
  }
  get isSwipeToChangeTabEnabled() {
    return this.swipeToChangeTabGestureState.isSwipeToChangeTabEnabled;
  }

  _swipeToHideHeaderGestureConsumer =
    createSwipeToHideHeaderGestureContextConsumer(this, true, () => {
      this._updateChecked();
    });
  /** @type {import("../../../../contexts/swipeToHideHeaderGestureContext.js").SwipeToHideHeaderGestureContextState} */
  get swipeToHideHeaderGestureState() {
    return this._swipeToHideHeaderGestureConsumer.value.state;
  }
  get isSwipeToHideHeaderEnabled() {
    return this.swipeToHideHeaderGestureState.isSwipeToHideHeaderEnabled;
  }

  _onChange(event) {
    const { checked } = event.target;
    const areGesturesEnabled = checked;

    this.swipeToChangeTabGestureState.isSwipeToChangeTabEnabled =
      areGesturesEnabled;
    this._swipeToChangeTabGestureConsumer.value.update(
      this.swipeToChangeTabGestureState,
      true,
    );

    this.swipeToHideHeaderGestureState.isSwipeToHideHeaderEnabled =
      areGesturesEnabled;
    this._swipeToHideHeaderGestureConsumer.value.update(
      this.swipeToHideHeaderGestureState,
      true,
    );
  }

  _updateChecked() {
    if (!this._didFirstUpdate) {
      return;
    }

    if (this.ref.value) {
      if (!this.switch) {
        this.ref.value.indeterminate = this.indeterminate;
      }
      this.ref.value.checked = this.checked;
    }
  }

  get booleans() {
    return [this.isSwipeToChangeTabEnabled, this.isSwipeToHideHeaderEnabled];
  }
  get checked() {
    return this.booleans.every(Boolean);
  }
  get indeterminate() {
    return !this.booleans.every(Boolean) && this.booleans.some(Boolean);
  }

  firstUpdated() {
    this._didFirstUpdate = true;
    this._updateChecked();
  }

  _label = "All Gestures";

  renderToggle() {
    return html`<bw-toggle
      ${ref(this.ref)}
      ?checked=${this.checked}
      @change=${this._onChange}
      label="${this._label}"
      ?switch=${this.switch}
      ?indeterminate=${this.indeterminate}
    ></bw-toggle>`;
  }

  render() {
    const toggle = this.renderToggle();
    if (this.switch) {
      return toggle;
    } else {
      return html`
        <div class="wa-stack wa-gap-xs">
          ${toggle}
          <div class="wa-stack wa-gap-xs">
            <bw-settings-swipe-to-hide-header-gesture-toggle></bw-settings-swipe-to-hide-header-gesture-toggle>
            <bw-settings-swipe-to-change-tab-gesture-toggle></bw-settings-swipe-to-change-tab-gesture-toggle>
          </div>
        </div>
      `;
    }
  }
}

customElements.define("bw-settings-gestures-tree", SettingsGesturesTreeElement);

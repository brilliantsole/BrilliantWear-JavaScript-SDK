import { waitForGlobals } from "../../../../../utils/cross-origin-storage-utils.js";

const { lit, litRef } = await waitForGlobals();

const { LitElement, html } = lit;
const { ref, createRef } = litRef;

import "../../../utils/Toggle.js";

import { createFlipOnChargeContextConsumer } from "../../../../contexts/flipOnChargeContext.js";
import { createBatteryManagerContextConsumer } from "../../../../contexts/batteryManagerContext.js";

class SettingsFlipOnChargeToggle extends LitElement {
  createRenderRoot() {
    return this;
  }

  static properties = {
    switch: { type: Boolean },
  };

  ref = createRef();
  _flipOnChargeConsumer = createFlipOnChargeContextConsumer(this, true, () => {
    if (this.ref.value) {
      this.ref.value.checked = this.checked;
    }
  });

  /** @type {import("../../../../contexts/flipOnChargeContext.js").FlipOnChargeContextState} */
  get flipOnChargeState() {
    return this._flipOnChargeConsumer.value.state;
  }
  get flipOnCharge() {
    return this.flipOnChargeState.flipOnCharge;
  }

  _batteryManagerConsumer = createBatteryManagerContextConsumer(this, true);
  /** @type {import("../../../../contexts/batteryManagerContext.js").BatteryManagerContextState} */
  get batteryManagerContext() {
    return this._batteryManagerConsumer.value.state;
  }
  get isBatteryManagerAvailable() {
    return this.batteryManagerContext.isAvailable;
  }

  _onChange(event) {
    const { checked } = event.target;
    event.target.checked = this.checked;
    this.flipOnChargeState.flipOnCharge = checked;
    this._flipOnChargeConsumer.value.update(this.flipOnChargeState, true);
  }

  get checked() {
    return this.flipOnCharge;
  }

  render() {
    return html`<bw-toggle
      data-touch-only
      ${ref(this.ref)}
      ?checked=${this.checked}
      @change=${this._onChange}
      label="Flip on Charge"
      ?switch=${this.switch}
      ?disabled=${!this.isBatteryManagerAvailable}
    ></bw-toggle>`;
  }
}

customElements.define(
  "bw-settings-flip-on-charge-toggle",
  SettingsFlipOnChargeToggle,
);

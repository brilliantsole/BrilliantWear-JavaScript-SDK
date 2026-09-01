import { waitForGlobals } from "../../../../../utils/cross-origin-storage-utils.js";
import { createIsLeftHandedContextConsumer } from "../../../../contexts/isLeftHandedContext.js";

const { lit } = await waitForGlobals();

const { LitElement, html, css } = lit;

import "../SettingsCard.js";

import "./SettingsLeftHandedToggle.js";
import "./SettingsHideHeaderToggle.js";
import "./SettingsAnchorHeaderToggle.js";
import "./SettingsFlipOnChargeToggle.js";

import { createAnchorHeaderContextConsumer } from "../../../../contexts/anchorHeaderContext.js";
import { createIsHeaderHiddenContextConsumer } from "../../../../contexts/isHeaderHiddenContext.js";
import { createBatteryManagerContextConsumer } from "../../../../contexts/batteryManagerContext.js";
import { createTouchEnabledContextConsumer } from "../../../../contexts/touchEnabledContext.js";

class SettingsInterface extends LitElement {
  _isLeftHandedConsumer = createIsLeftHandedContextConsumer(this);
  _isHeaderHiddenConsumer = createIsHeaderHiddenContextConsumer(this);
  _anchorHeaderConsumer = createAnchorHeaderContextConsumer(this);
  _batteryManagerConsumer = createBatteryManagerContextConsumer(this, true);
  _touchEnabledConsumer = createTouchEnabledContextConsumer(this, true);

  clear() {
    console.log("clear interface settings");
    this._isLeftHandedConsumer.value.clear();
    this._isHeaderHiddenConsumer.value.clear();
    this._anchorHeaderConsumer.value.clear();
  }

  createRenderRoot() {
    return this;
  }

  /** @type {import("../../../../contexts/batteryManagerContext.js").BatteryManagerContextState} */
  get _batteryManagerState() {
    return this._batteryManagerConsumer.value.state;
  }
  /** @type {import("../../../../contexts/touchEnabledContext.js").TouchEnabledContextState} */
  get _touchEnabledState() {
    return this._touchEnabledConsumer.value.state;
  }

  render() {
    const flipOnCharge =
      this._batteryManagerState.isAvailable &&
      this._touchEnabledState.touchEnabled
        ? html`<bw-settings-flip-on-charge-toggle
            switch
          ></bw-settings-flip-on-charge-toggle>`
        : "";

    return html`
      <bw-settings-card label="Interface" @clear=${this.clear}>
        <bw-settings-left-handed-toggle switch></bw-settings-left-handed-toggle>
        <bw-settings-hide-header-toggle switch></bw-settings-hide-header-toggle>
        <bw-settings-anchor-header-toggle
          switch
        ></bw-settings-anchor-header-toggle>
        ${flipOnCharge}
      </bw-settings-card>
    `;
  }
}

customElements.define("bw-settings-interface", SettingsInterface);

import { waitForGlobals } from "../../../../../utils/cross-origin-storage-utils.js";
import { createIsLeftHandedContextConsumer } from "../../../../contexts/isLeftHandedContext.js";

const { lit } = await waitForGlobals();

const { LitElement, html, css } = lit;

import "../SettingsCard.js";

import "./SettingsLeftHandedToggle.js";

class SettingsInterface extends LitElement {
  _isLeftHandedConsumer = createIsLeftHandedContextConsumer(this);

  clear() {
    console.log("clear interface settings");
    this._isLeftHandedConsumer.value.clear();
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <bw-settings-card label="Interface" @clear=${this.clear}>
        <bw-settings-left-handed-toggle switch></bw-settings-left-handed-toggle>
      </bw-settings-card>
    `;
  }
}

customElements.define("bw-settings-interface", SettingsInterface);

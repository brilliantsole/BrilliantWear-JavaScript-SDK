import { waitForGlobals } from "../../../../utils/cross-origin-storage-utils.js";

const { lit, BW } = await waitForGlobals();

const { LitElement, html } = lit;

import "https://ka-f.webawesome.com/webawesome@3.12.0/components/button/button.js";
import "https://ka-f.webawesome.com/webawesome@3.12.0/components/spinner/spinner.js";

class AddDeviceButton extends LitElement {
  createRenderRoot() {
    return this;
  }

  _onClick() {}

  render() {
    const slot = true
      ? html`<wa-icon slot="start" name="plus"></wa-icon>`
      : html`<wa-spinner slot="start"></wa-spinner>`;
    return html`<wa-button
      variant="brand"
      size="s"
      @click=${this._onClick}
      ?disabled=${!BW.Device.CanConnect}
    >
      ${slot} Add Device
    </wa-button>`;
  }
}

customElements.define("bw-add-device-button", AddDeviceButton);

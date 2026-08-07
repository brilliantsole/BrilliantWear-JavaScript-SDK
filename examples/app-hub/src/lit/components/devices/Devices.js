import { waitForGlobals } from "../../../utils/cross-origin-storage-utils.js";

const { lit } = await waitForGlobals();

const { LitElement, html, css } = lit;

class DevicesElement extends LitElement {
  static styles = css`
    :host {
    }
  `;

  render() {
    return html`<h1>Devices</h1>`;
  }
}

customElements.define("bw-devices", DevicesElement);

import { waitForGlobals } from "../../../utils/cross-origin-storage-utils.js";

const { lit } = await waitForGlobals();

const { LitElement, html, css } = lit;

class SettingsElement extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`<h1>Settings</h1>`;
  }
}

customElements.define("bw-settings", SettingsElement);

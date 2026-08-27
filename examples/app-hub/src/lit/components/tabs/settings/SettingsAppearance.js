import { waitForGlobals } from "../../../../utils/cross-origin-storage-utils.js";

const { lit } = await waitForGlobals();

const { LitElement, html } = lit;

class SettingsAppearanceElement extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <div class="wa-stack">
        <h3>Appearance</h3>
        <p>Hello World</p>
      </div>
    `;
  }
}

customElements.define("bw-settings-appearance", SettingsAppearanceElement);

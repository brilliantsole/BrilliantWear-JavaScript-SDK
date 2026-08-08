import { waitForGlobals } from "../../../utils/cross-origin-storage-utils.js";

const { lit } = await waitForGlobals();

const { LitElement, html, css } = lit;

import "./NavButtonLayers.js";
import "./NavButtonApps.js";
import "./NavButtonDevices.js";
import "./NavButtonSettings.js";

class Nav extends LitElement {
  createRenderRoot() {
    return this;
  }

  constructor() {
    super();
    this.setAttribute("role", "navigation");
  }

  render() {
    return html`
      <bw-nav-button-layers></bw-nav-button-layers>
      <bw-nav-button-apps></bw-nav-button-apps>
      <bw-nav-button-devices></bw-nav-button-devices>
      <bw-nav-button-settings></bw-nav-button-settings>
    `;
  }
}

customElements.define("bw-nav", Nav);

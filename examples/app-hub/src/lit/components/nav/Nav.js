import { waitForGlobals } from "../../../utils/cross-origin-storage-utils.js";

const { lit } = await waitForGlobals();

const { LitElement, html, css } = lit;

import "./NavButtonLayers.js";
import "./NavButtonApps.js";
import "./NavButtonDevices.js";
import "./NavButtonSettings.js";

import { defaultTab } from "../AppHub.js";

class Nav extends LitElement {
  static properties = {
    isActive: { type: Boolean },
  };

  static styles = css`
    :host {
      display: flex;
      flex: 0 0 auto;
      flex-direction: var(--nav-flex-direction);
      align-items: center;
      gap: var(--wa-space-2xs);
    }

    /* TODO: - different justify-content for different screen sizes */
  `;

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

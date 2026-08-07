import { waitForGlobals } from "../../../utils/cross-origin-storage-utils.js";
const { lit } = await waitForGlobals();

const { LitElement, html } = lit;

import "./NavButton.js";

class NavButtonApps extends LitElement {
  render() {
    return html`<bw-nav-button href="/apps" icon-name="grip" variant="warning">
      Apps
    </bw-nav-button>`;
  }
}
customElements.define("bw-nav-button-apps", NavButtonApps);

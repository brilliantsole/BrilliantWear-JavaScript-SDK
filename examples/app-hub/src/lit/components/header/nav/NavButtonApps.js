import { waitForGlobals } from "../../../../utils/cross-origin-storage-utils.js";
import { createViewportOrientationContextConsumer } from "../../../contexts/viewportOrientationContext.js";
import { tabIcons, tabVariants } from "../../tabs/tabs.js";
const { lit } = await waitForGlobals();

const { LitElement, html } = lit;

import "../HeaderButton.js";

class NavButtonApps extends LitElement {
  createRenderRoot() {
    return this;
  }

  constructor() {
    super();
    this._viewportOrientationConsumer =
      createViewportOrientationContextConsumer(this, true);
  }

  /** @type {import("../../contexts/viewportOrientationContext.js").ViewportOrientation} */
  get viewportOrientation() {
    return this._viewportOrientationConsumer.value.state.viewportOrientation;
  }

  render() {
    const { name } = tabIcons["apps"][this.viewportOrientation];
    return html`<bw-header-button
      href="/apps"
      icon-name=${name}
      variant=${tabVariants["apps"]}
    >
      Apps
    </bw-header-button>`;
  }
}
customElements.define("bw-nav-button-apps", NavButtonApps);

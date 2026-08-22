import { waitForGlobals } from "../../../utils/cross-origin-storage-utils.js";
import { createViewportOrientationContextConsumer } from "../../contexts/viewportOrientationContext.js";
const { lit } = await waitForGlobals();

const { LitElement, html } = lit;

import "./NavButton.js";

class NavButtonApps extends LitElement {
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
    const iconName =
      this.viewportOrientation == "landscape" ? "grip" : "grip-vertical";
    return html`<bw-nav-button
      href="/apps"
      icon-name=${iconName}
      variant="warning"
    >
      Apps
    </bw-nav-button>`;
  }
}
customElements.define("bw-nav-button-apps", NavButtonApps);

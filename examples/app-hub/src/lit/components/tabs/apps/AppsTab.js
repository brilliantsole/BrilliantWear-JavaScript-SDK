import { waitForGlobals } from "../../../../utils/cross-origin-storage-utils.js";

const { lit } = await waitForGlobals();

const { LitElement, html, css } = lit;

import "https://ka-f.webawesome.com/webawesome@3.12.0/components/divider/divider.js";
import "https://ka-f.webawesome.com/webawesome@3.12.0/components/breadcrumb/breadcrumb.js";
import "https://ka-f.webawesome.com/webawesome@3.12.0/components/breadcrumb-item/breadcrumb-item.js";

import "../TabBreadcrumb.js";
import { createViewportOrientationContextConsumer } from "../../../contexts/viewportOrientationContext.js";

class AppsTab extends LitElement {
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
    const iconName =
      this.viewportOrientation == "landscape" ? "grip" : "grip-vertical";
    return html`
      <div class="wa-stack wa-gap-xs">
        <bw-tab-breadcrumb icon-name=${iconName}> </bw-tab-breadcrumb>

        <div>
          <h3>Apps</h3>
        </div>
      </div>
    `;
  }
}

customElements.define("bw-apps-tab", AppsTab);

import { waitForGlobals } from "../../../../utils/cross-origin-storage-utils.js";

const { lit } = await waitForGlobals();

const { LitElement, html, css } = lit;

import "https://ka-f.webawesome.com/webawesome@3.12.0/components/divider/divider.js";
import "https://ka-f.webawesome.com/webawesome@3.12.0/components/breadcrumb/breadcrumb.js";
import "https://ka-f.webawesome.com/webawesome@3.12.0/components/breadcrumb-item/breadcrumb-item.js";

import "../TabBreadcrumb.js";

class DevicesTab extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <div>
        <h3>Hello World</h3>
      </div>
    `;
  }
}

customElements.define("bw-devices-tab", DevicesTab);

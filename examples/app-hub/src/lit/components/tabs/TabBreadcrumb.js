import { waitForGlobals } from "../../../utils/cross-origin-storage-utils.js";

const { lit, litRepeat } = await waitForGlobals();

const { LitElement, html, css } = lit;
const { repeat } = litRepeat;

import { createNavigationStateContextConsumer } from "../../contexts/navigationStateContext.js";
import { capitalize } from "../../../utils/string-utils.js";

import "https://ka-f.webawesome.com/webawesome@3.12.0/components/divider/divider.js";
import "https://ka-f.webawesome.com/webawesome@3.12.0/components/breadcrumb/breadcrumb.js";
import "https://ka-f.webawesome.com/webawesome@3.12.0/components/breadcrumb-item/breadcrumb-item.js";

class TabBreadcrumb extends LitElement {
  createRenderRoot() {
    return this;
  }

  static properties = {
    iconFamily: { attribute: "icon-family" },
    iconName: { attribute: "icon-name" },
  };

  constructor() {
    super();
    this._navigationStateConsumer = createNavigationStateContextConsumer(
      this,
      true,
      () => this._onNavigationStateUpdate(),
    );
  }

  /** @type {import("../../contexts/navigationStateContext.js").NavigationContextState} */
  get navigationState() {
    return this._navigationStateConsumer.value.state;
  }
  _onNavigationStateUpdate() {
    console.log("_onNavigationStateUpdate");
    this.routeSegments = this.navigationState.route
      .split("/")
      .filter(Boolean)
      .map((string) => capitalize(string));
  }

  render() {
    console.log("routeSegments", this.routeSegments);

    return html`
      <div class="wa-stack wa-gap-2xs">
        <wa-breadcrumb>
          ${repeat(
            this.routeSegments,
            (segment) => segment,
            (segment, index) => {
              if (index == 0) {
                return html`<wa-breadcrumb-item>
                  <wa-icon
                    slot="start"
                    family=${this.iconFamily}
                    name=${this.iconName}
                  ></wa-icon>
                  ${segment}
                </wa-breadcrumb-item>`;
              } else {
                return html`<wa-breadcrumb-item>
                  ${segment}
                </wa-breadcrumb-item>`;
              }
            },
          )}
        </wa-breadcrumb>
        <wa-divider></wa-divider>
      </div>
    `;
  }
}

customElements.define("bw-tab-breadcrumb", TabBreadcrumb);

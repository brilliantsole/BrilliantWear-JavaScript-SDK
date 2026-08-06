import { waitForGlobals } from "../../utils/cross-origin-storage-utils.js";

const { lit, litRouter, litContext } = await waitForGlobals();

const { LitElement, html, css } = lit;
const { Routes } = litRouter;
const { ContextProvider } = litContext;

import { Router } from "../router/Router.js";

import "./Nav.js";

export const defaultTab = "/layers";
import { selectedTabContext } from "../contexts/selectedTabContext.js";

class AppHub extends LitElement {
  router = new Router(
    this,
    [
      { path: "/layers", render: () => html`<bw-layers></bw-layers>` },
      { path: "/apps", render: () => html`<bw-apps></bw-apps>` },
      { path: "/devices", render: () => html`<bw-devices></bw-devices>` },
      { path: "/settings", render: () => html`<bw-settings></bw-settings>` },
    ],
    defaultTab,
  );

  static properties = {
    selectedTab: {
      type: String,
      attribute: "data-selected-tab",
      reflect: true,
    },
  };

  static styles = css`
    :host {
      /* gap: var(--wa-space-3xs); */
      width: 100%;
      height: 100%;
      display: flex;
    }

    main {
      background-color: var(--wa-color-neutral-fill-quiet);
    }
    :host([data-selected-tab="layers"]) main {
      background-color: hsl(
        from var(--wa-color-success-fill-quiet) h calc(s * 0.2) l
      );
    }
    :host([data-selected-tab="apps"]) main {
      background-color: hsl(
        from var(--wa-color-warning-fill-quiet) h calc(s * 0.2) l
      );
    }
    :host([data-selected-tab="devices"]) main {
      background-color: hsl(
        from var(--wa-color-brand-fill-quiet) h calc(s * 0.4) l
      );
    }

    /* touch screens */
    @media (pointer: coarse) {
      @media (orientation: landscape) {
        :host {
          flex-direction: row-reverse;
          bw-nav {
            flex-direction: column;
          }
        }
        :host([data-left-handed]) {
          flex-direction: row;
          bw-nav {
            flex-direction: column;
          }
        }
      }

      @media (orientation: portrait) {
        :host {
          flex-direction: column-reverse;
          bw-nav {
            flex-direction: row-reverse;
          }
        }
        :host([data-left-handed]) {
          bw-nav {
            flex-direction: row;
          }
        }
      }
    }

    /* non-touch screens */
    @media (pointer: fine) {
      @media (orientation: landscape) {
        :host {
          flex-direction: row;
          bw-nav {
            flex-direction: column;
          }
        }
      }

      @media (orientation: portrait) {
        :host {
          flex-direction: column;
          bw-nav {
            flex-direction: row;
          }
        }
      }
    }
  `;

  constructor() {
    super();
    this.selectedTab = defaultTab;
    this.selectedTabProvider = new ContextProvider(this, {
      context: selectedTabContext,
    });
  }

  connectedCallback() {
    super.connectedCallback();
    navigation.addEventListener(
      "currententrychange",
      this._onCurrentEntryChange,
    );
    this.#updateSelectedTab();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    navigation.removeEventListener(
      "currententrychange",
      this._onCurrentEntryChange,
    );
  }

  /** @param {NavigationEventMap["currententrychange"]} e */
  _onCurrentEntryChange = (e) => {
    console.log("_onCurrentEntryChange");
    this.#updateSelectedTab();
  };

  #updateSelectedTab() {
    console.log("#updateSelectedTab");
    const state = navigation.currentEntry.getState();
    const selectedTab = state.route.split("/").filter(Boolean)[0];
    console.log({ selectedTab });
    this.selectedTab = selectedTab;
    this.selectedTabProvider.setValue(selectedTab);
  }

  render() {
    return html`
      <bw-nav></bw-nav>
      <main style="flex: 1;">${this.router.outlet()}</main>
    `;
  }
}
customElements.define("bw-app-hub", AppHub);

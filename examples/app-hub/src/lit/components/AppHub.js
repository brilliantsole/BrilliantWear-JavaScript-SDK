import { waitForGlobals } from "../../utils/cross-origin-storage-utils.js";

const { lit, litRouter, litContext } = await waitForGlobals();

const { LitElement, html, css } = lit;
const { Routes } = litRouter;
const { ContextProvider } = litContext;

import { Router } from "../router/Router.js";

import "./nav/Nav.js";

import "./layers/Layers.js";
import "./apps/Apps.js";
import "./devices/Devices.js";
import "./settings/Settings.js";

export const defaultTab = "/layers";
import { activeTabContext } from "../contexts/activeTabContext.js";

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

  static styles = css`
    :host {
      /* gap: var(--wa-space-3xs); */
      width: 100%;
      height: 100%;
      display: flex;
      padding-left: env(safe-area-inset-left);
      padding-right: env(safe-area-inset-right);
    }

    main {
      overflow-y: scroll;
      padding-left: var(--wa-space-s);
      touch-action: pan-x pan-y;
    }

    bw-nav {
      background-color: var(--wa-color-surface-default);
      touch-action: none;
    }

    @media (orientation: landscape) {
      bw-nav {
        padding-top: var(--wa-space-2xs);
      }
    }
    @media (orientation: portrait) {
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
    this._activeTabProvider = new ContextProvider(this, {
      context: activeTabContext,
    });
  }

  connectedCallback() {
    super.connectedCallback();
    navigation.addEventListener(
      "currententrychange",
      this._onCurrentEntryChange,
    );
    this.#updateActiveTab();
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
    this.#updateActiveTab();
  };

  #updateActiveTab() {
    console.log("#updateActiveTab");
    const state = navigation.currentEntry.getState();
    const activeTab =
      state?.route?.split("/")?.filter(Boolean)?.[0] ?? defaultTab;
    // console.log({ activeTab });
    this.activeTab = activeTab;
  }

  get activeTab() {
    return this._activeTabProvider.value;
  }
  set activeTab(newActiveTab) {
    console.log({ newActiveTab });
    document.documentElement.dataset.activeTab = newActiveTab;
    const color = getComputedStyle(document.documentElement)
      .getPropertyValue("background-color")
      .trim();
    document
      .querySelector('meta[name="theme-color"]')
      .setAttribute("content", color);
    this._activeTabProvider.setValue(newActiveTab);
  }

  render() {
    return html`
      <bw-nav></bw-nav>
      <main style="flex: 1;">${this.router.outlet()}</main>
    `;
  }
}
customElements.define("bw-app-hub", AppHub);

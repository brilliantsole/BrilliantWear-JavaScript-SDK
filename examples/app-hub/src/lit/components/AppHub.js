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
import { screenOrientationContext } from "../contexts/screenOrientationContext.js";
import { isTouch } from "../../utils/environment.js";

class AppHub extends LitElement {
  static properties = {
    screenOrientationType: {
      type: String,
      reflect: true,
      attribute: "data-screen-orientation-type",
    },
    leftHanded: {
      type: Boolean,
      reflect: true,
      attribute: "data-left-handed",
    },
    anchorNav: {
      type: Boolean,
      reflect: true,
      attribute: "data-anchor-nav",
    },
  };

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
      width: 100%;
      height: 100%;
      display: flex;
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
      bw-nav {
      }
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

        :host(
          [data-anchor-nav][data-screen-orientation-type="landscape-secondary"]
        ),
        :host([data-left-handed]:not([data-anchor-nav])) {
          flex-direction: row;
        }

        @supports (padding-inline-end: env(safe-area-inset-right)) {
          :host(
              [data-screen-orientation-type="landscape-secondary"]:not(
                [data-left-handed],
                [data-anchor-nav]
              )
            )
            bw-nav {
            padding-inline-end: calc(
              env(safe-area-inset-right) - var(--wa-space-s)
            );
          }

          :host(
              [data-screen-orientation-type="landscape-primary"]:not(
                  [data-anchor-nav]
                )[data-left-handed]
            )
            bw-nav {
            padding-inline-start: calc(
              env(safe-area-inset-left) - var(--wa-space-s)
            );
          }

          :host(
              [data-screen-orientation-type="landscape-secondary"]:is(
                [data-left-handed],
                [data-anchor-nav]
              )
            )
            main {
            padding-inline-end: calc(
              env(safe-area-inset-right) - var(--wa-space-s)
            );
          }

          :host(
              [data-screen-orientation-type="landscape-primary"]:is(
                [data-anchor-nav],
                :not([data-left-handed])
              )
            )
            main {
            padding-inline-start: calc(
              env(safe-area-inset-left) - var(--wa-space-xs)
            );
          }
        }

        @media (min-height: 5in) {
          bw-nav {
            /* "center" or "end" for large phones/tablets held sideways? */
            justify-content: center;
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
    console.log("AppHub", this);
    this._activeTabProvider = new ContextProvider(this, {
      context: activeTabContext,
    });
    this._screenOrientationProvider = new ContextProvider(this, {
      context: screenOrientationContext,
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this._themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (!this._themeColorMeta) {
      this._themeColorMeta = document.createElement("meta");
      this._themeColorMeta.name = "theme-color";
      document.head.appendChild(this._themeColorMeta);
    }

    // this.leftHanded = true;
    // this.anchorNav = true;

    if ("getBattery" in navigator) {
      navigator.getBattery().then((batteryManager) => {
        console.log("battery", batteryManager);
        this.batteryManager = batteryManager;

        batteryManager.addEventListener(
          "chargingchange",
          this._onBatteryChargingChange,
        );
        batteryManager.addEventListener(
          "levelchange",
          this._onBatteryLevelChange,
        );
        batteryManager.addEventListener(
          "chargingtimechange",
          this._onBatteryChargingTimeChange,
        );
        batteryManager.addEventListener(
          "dischargingtimechange",
          this._onBatteryDischargingTimeChange,
        );
      });
    }

    navigation.addEventListener(
      "currententrychange",
      this._onCurrentEntryChange,
    );
    window.screen.orientation.addEventListener(
      "change",
      this._onOrientationChange,
    );
    this._updateActiveTab();
    this._updateOrientation();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    navigation.removeEventListener(
      "currententrychange",
      this._onCurrentEntryChange,
    );
    if (this.batteryManager) {
      this.batteryManager.removeEventListener(
        "chargingchange",
        this._onBatteryChargingChange,
      );
      this.batteryManager.removeEventListener(
        "levelchange",
        this._onBatteryLevelChange,
      );
      this.batteryManager.removeEventListener(
        "chargingtimechange",
        this._onBatteryChargingTimeChange,
      );
      this.batteryManager.removeEventListener(
        "dischargingtimechange",
        this._onBatteryDischargingTimeChange,
      );
    }
    window.screen.orientation.removeEventListener(
      "change",
      this._onOrientationChange,
    );
  }

  /** @param {ScreenOrientationEventMap["change"]} e */
  _onOrientationChange = (e) => {
    // console.log("_onOrientationChange");
    this._updateOrientation();
  };
  _updateOrientation() {
    // console.log("#updateOrientation");
    const { type, angle } = window.screen.orientation;
    console.log({ type, angle });
    this._screenOrientationProvider.setValue({ type, angle });
    this.screenOrientationType = type;
  }

  _onBatteryChargingChange = (e) => {
    console.log("_onBatteryChargingChange");
    const { charging } = this.batteryManager;
    console.log({ charging });
    if (isTouch) {
      // TODO: - put nav on notch side to avoid holding charging cable
    }
  };
  _onBatteryLevelChange = (e) => {
    console.log("_onBatteryLevelChange");
    const { level } = this.batteryManager;
    console.log({ level });
  };
  _onBatteryChargingTimeChange = (e) => {
    console.log("_onBatteryChargingTimeChange");
    const { chargingTime } = this.batteryManager;
    console.log({ chargingTime });
  };
  _onBatteryDischargingTimeChange = (e) => {
    console.log("_onBatteryDischargingTimeChange");
    const { dischargingTime } = this.batteryManager;
    console.log({ dischargingTime });
  };

  /** @param {NavigationEventMap["currententrychange"]} e */
  _onCurrentEntryChange = (e) => {
    console.log("_onCurrentEntryChange");
    this._updateActiveTab();
  };

  _updateActiveTab() {
    // console.log("#updateActiveTab");
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

    this._updateMetaThemeColor();
    this._activeTabProvider.setValue(newActiveTab);
  }

  _updateMetaThemeColor() {
    const color = getComputedStyle(document.documentElement)
      .getPropertyValue("background-color")
      .trim();
    this._themeColorMeta.setAttribute("content", color);
  }

  render() {
    return html`
      <bw-nav></bw-nav>
      <main style="flex: 1;">${this.router.outlet()}</main>
    `;
  }
}
customElements.define("bw-app-hub", AppHub);

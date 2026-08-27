import "./layers/LayersTab.js";
import "./apps/AppsTab.js";
import "./devices/DevicesTab.js";
import "./settings/SettingsTab.js";

import "./TabBreadcrumb.js";

/** @typedef {"layers" | "apps" | "devices" | "settings"} Tab */
/** @type {Tab} */
export const defaultTab = "layers";
export const defaultPath = `/${defaultTab}`;
/** @type {Tab[]} */
export const tabs = ["layers", "apps", "devices", "settings"];

/** @typedef {import("../../contexts/viewportOrientationContext.js").ViewportOrientation} ViewportOrientation */

/** @typedef {{name: string, family?: string}} Icon */
/** @type {Record<Tab, Icon | Record<ViewportOrientation, Icon>>} */
export const tabIcons = {
  layers: {
    name: "window-restore",
  },
  apps: {
    landscape: {
      name: "grip",
    },
    portrait: {
      name: "grip-vertical",
    },
  },
  devices: {
    name: "bluetooth",
    family: "brands",
  },
  settings: {
    name: "gear",
  },
};

/** @typedef {"brand" | "neutral" | "warning" | "success"} Variant */
/** @type {Record<Tab, Variant>} */
export const tabVariants = {
  layers: "success",
  apps: "warning",
  devices: "brand",
  settings: "neutral",
};

import { registerPlugin } from "@capacitor/core";
export const BluetoothLe = registerPlugin("BluetoothLe", {
  web: () => import("./web.js").then((m) => new m.BluetoothLeWeb()),
});
//# sourceMappingURL=plugin.js.map

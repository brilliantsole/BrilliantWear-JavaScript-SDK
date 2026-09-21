import * as BW from "../../build/brilliantwear.module.js";

const device = new BW.Device();
const toggleConnectionButton = document.getElementById("toggleConnection");
toggleConnectionButton.addEventListener("click", () => {
  device.toggleConnection();
});
device.addEventListener("connectionStatus", () => {
  let innerText = device.connectionStatus;
  switch (device.connectionStatus) {
    case "notConnected":
      innerText = "connect";
      break;
    case "connected":
      innerText = "disconnect";
      break;
  }
  toggleConnectionButton.innerText = innerText;
});
device.addEventListener("isConnected", () => {
  toggleConnectionButton.innerText = device.isConnected
    ? "disconnect"
    : "connect";
});
device.addEventListener("connected", () => {
  device.setSensorConfiguration({ gameRotation: 20 });
});
const quaternionSpan = document.getElementById("quaternion");
device.addEventListener("gameRotation", (event) => {
  quaternionSpan.innerText = JSON.stringify(
    event.message.gameRotationEuler,
    null,
    2,
  );
});

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
export function cssColorToHex(colorStr) {
  // Return early if empty
  if (!colorStr || colorStr === "transparent") return "#000000";

  // Create a 1x1 pixel canvas element
  ctx.width = 1;
  ctx.height = 1;

  // Set the fillStyle to the browser-computed color string
  ctx.fillStyle = colorStr;
  ctx.fillRect(0, 0, 1, 1);

  // Read the exact RGBA values from the pixel
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;

  // Convert RGB integers to a hex string
  const toHex = (val) => val.toString(16).padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

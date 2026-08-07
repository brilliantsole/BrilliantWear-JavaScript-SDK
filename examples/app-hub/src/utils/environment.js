export const isTouch = navigator.maxTouchPoints > 0;

export const isIOS =
  // 1. Detects iPhones, iPods, and legacy iPads
  /iPhone|iPad|iPod/.test(navigator.userAgent) ||
  // 2. Detects modern iPads (which mask themselves as MacIntel computers)
  (navigator.userAgent.includes("Mac") && isTouch);

export const getIsTouch = () => navigator.maxTouchPoints > 0;
export const isTouch = getIsTouch();

export const getIsIOS = () =>
  /iPhone|iPad|iPod/.test(navigator.userAgent) ||
  // 2. Detects modern iPads (which mask themselves as MacIntel computers)
  (navigator.userAgent.includes("Mac") && getIsTouch());
export const isIOS = getIsIOS();

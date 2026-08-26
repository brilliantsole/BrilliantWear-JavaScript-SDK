const capitalizeRegex = /^./;
export const capitalize = (str) =>
  str.replace(capitalizeRegex, (match) => match.toUpperCase());

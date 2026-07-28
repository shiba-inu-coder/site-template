export const safeHTMLWrap = (val: string) => {
  const allowedHTML = [
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "span",
    "strong",
    "a",
    "ul",
    "ol",
    "li",
    "br",
    "i",
    "b",
  ];
  return isHTML(val) && isAllowedHTML(val, allowedHTML)
    ? val
    : `<span>${val}</span>`;
};

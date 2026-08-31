import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = [
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

// Тот же паттерн, что в DOMPurify по умолчанию, но со схемами кроме http(s)
// вырезанными — иначе mailto:/tel: тоже проходят, а нужен только http/https
// и относительные пути.
const HTTP_OR_RELATIVE_URI = /^(?:(?:https?):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i;

export const safeHTMLWrap = (val?: string) =>
  DOMPurify.sanitize(val ?? "", {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ["href"],
    ALLOWED_URI_REGEXP: HTTP_OR_RELATIVE_URI,
  });

import { compile } from "path-to-regexp";

export const buildURL = <T extends object | undefined>(
  path: string,
  parameters: T,
  query: Record<string, any> = {},
): string => {
  const url = compile(path, {
    encode: (value) => encodeURIComponent(value).replace(/%2F/g, "/"),
  })(parameters);

  const queryString = new URLSearchParams(query).toString();
  return queryString ? `${url}?${queryString}` : url;
};

export const isDev = process.env.NODE_ENV === "development";
export const PostSlugRegex =
  /^[a-z0-9]+(?:-[a-z0-9]+)*(\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/;

export const TimeoutLoadingGAandGTM = 3000; // 3 seconds

export const refLinkTypes = [
  {
    label: "Casino",
    value: "casino",
  },
  {
    label: "Bookmaker",
    value: "bookmaker",
  },
];

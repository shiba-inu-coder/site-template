export enum EntityModel {
  Writer = "Writer",
  User = "User",
  Post = "Post",
  Session = "Session",
  Setting = "Setting",
  Casino = "Casino",
  Bookmaker = "Bookmaker",
  PaymentMethod = "PaymentMethod",
  SoftwareProvider = "SoftwareProvider",
  GameType = "GameType",
  Sport = "Sport",
  Bonus = "Bonus",
}

export type DropdowOptionsList = "image" | "refLink" | "refLinkBtn" | "default";

export type FormMode = "create" | "edit";

export type Option = { label: string; value: string };

export type RefLinkType = "casino" | "bookmaker";

export type CookieOptions = {
  maxAge?: number;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: boolean | "strict" | "lax" | "none";
  path?: string;
  domain?: string;
};

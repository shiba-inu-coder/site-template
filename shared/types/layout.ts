export interface HeaderItem {
  kind: "ref" | "page" | "logo";
  label: string;
  link?: string;
  style: "primary" | "active" | "link";
  position: "left" | "center" | "right";
  children?: HeaderItem[];
}

export const ALIGN = {
  left: "left",
  center: "center",
  right: "right",
} as const;

export type ALIGN_TYPE = (typeof ALIGN)[keyof typeof ALIGN];

export type ORIENTATION_TYPE = "horizontal" | "vertical";
export type MODE = "single" | "double";

export type ITEM_ADD_POSITION = "top" | "bottom";

export const STYLE_CLASS = {
  selected: "selected",
  addItem: "add-item",
} as const;

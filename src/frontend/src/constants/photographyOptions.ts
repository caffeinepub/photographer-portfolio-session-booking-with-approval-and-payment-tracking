// Sports and concert photography options
export const PHOTOGRAPHY_CATEGORIES = [
  { value: "sports", label: "Sports" },
  { value: "concert", label: "Concert" },
] as const;

export const SESSION_TYPES = [
  { value: "sports", label: "Sports Coverage" },
  { value: "concert", label: "Concert Coverage" },
] as const;

export type CategoryValue = (typeof PHOTOGRAPHY_CATEGORIES)[number]["value"];
export type SessionTypeValue = (typeof SESSION_TYPES)[number]["value"];

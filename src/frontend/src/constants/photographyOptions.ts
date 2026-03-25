// Sports and concert photography options
export const PHOTOGRAPHY_CATEGORIES = [
  { value: "sports", label: "Sports" },
  { value: "concert", label: "Concert" },
] as const;

export const SESSION_TYPES = [
  { value: "sports", label: "Sports Coverage" },
] as const;

export const SPORT_TYPES = [
  { value: "baseball", label: "Baseball" },
  { value: "basketball", label: "Basketball" },
  { value: "football", label: "Football" },
  { value: "soccer", label: "Soccer" },
  { value: "track", label: "Track & Field" },
  { value: "other", label: "Other" },
] as const;

export type CategoryValue = (typeof PHOTOGRAPHY_CATEGORIES)[number]["value"];
export type SessionTypeValue = (typeof SESSION_TYPES)[number]["value"];
export type SportTypeValue = (typeof SPORT_TYPES)[number]["value"];

export function formatLongDate(iso) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function truncate(str = "", len = 140) {
  if (str.length <= len) return str;
  return str.slice(0, len - 1) + "…";
}
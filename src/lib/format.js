export function formatDateTime(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatTime(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--:--";
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function titleCase(value) {
  if (typeof value !== "string" || value.trim() === "") {
    return "Unknown";
  }

  return value
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function statusTheme(status) {
  switch (status) {
    case "confirmed":
      return "bg-blue-500/20 text-blue-100 border-blue-300/35";
    case "pending":
      return "bg-amber-500/20 text-amber-100 border-amber-300/35";
    case "completed":
      return "bg-emerald-500/20 text-emerald-100 border-emerald-300/35";
    case "cancelled":
      return "bg-rose-500/20 text-rose-100 border-rose-300/35";
    default:
      return "bg-slate-500/20 text-slate-100 border-slate-300/35";
  }
}

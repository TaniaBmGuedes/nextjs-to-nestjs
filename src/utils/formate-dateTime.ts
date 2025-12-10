import { format, formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";

export function formatDateTime(rawDate: string) {
  const date = new Date(rawDate);
  return format(date, "dd/MM/yyyy 'at' HH'h'mm", {
    locale: pt,
  });
}

export function formatRelativeDate(rawDate: string): string {
  const date = new Date(rawDate);

  return formatDistanceToNow(date, {
    locale: pt,
    addSuffix: true,
  });
}

export function formatHour(timestampMs: number): string {
  const date = new Date(timestampMs);

  return format(date, "HH:mm:ss", {
    locale: pt,
  });
}

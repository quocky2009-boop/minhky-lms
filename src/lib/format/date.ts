export const BUSINESS_TIMEZONE = "Asia/Ho_Chi_Minh";

type DateInput = Date | string | number;

function toDate(value: DateInput): Date {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new RangeError("Giá trị ngày/giờ không hợp lệ.");
  }
  return date;
}

function parts(date: Date, options: Intl.DateTimeFormatOptions) {
  const formatted = new Intl.DateTimeFormat("en-GB", {
    timeZone: BUSINESS_TIMEZONE,
    ...options,
  }).formatToParts(date);
  return Object.fromEntries(formatted.map((p) => [p.type, p.value])) as Record<string, string>;
}

/** dd/MM/yyyy theo múi giờ Asia/Ho_Chi_Minh. Đây là hàm định dạng ngày duy nhất của ứng dụng. */
export function formatDate(value: DateInput): string {
  const p = parts(toDate(value), { day: "2-digit", month: "2-digit", year: "numeric" });
  return `${p.day}/${p.month}/${p.year}`;
}

/** HH:mm (24 giờ) theo múi giờ Asia/Ho_Chi_Minh. */
export function formatTime(value: DateInput): string {
  const p = parts(toDate(value), { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  return `${p.hour}:${p.minute}`;
}

/** HH:mm, dd/MM/yyyy */
export function formatDateTime(value: DateInput): string {
  return `${formatTime(value)}, ${formatDate(value)}`;
}

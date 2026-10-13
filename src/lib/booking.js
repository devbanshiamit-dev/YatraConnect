const RECORDS_KEY = "yatra-records";

export const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const pad = (n) => String(n).padStart(2, "0");

function toISODate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function todayISO() {
  return toISODate(new Date());
}

export function addDaysISO(iso, days) {
  const [y, m, d] = iso.split("-").map(Number);
  return toISODate(new Date(y, m - 1, d + days));
}

export function isValidISODate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? "")) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

export function formatDate(iso) {
  if (!isValidISODate(iso)) return "—";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function nightsBetween(checkIn, checkOut) {
  const [ay, am, ad] = checkIn.split("-").map(Number);
  const [by, bm, bd] = checkOut.split("-").map(Number);
  return Math.round((new Date(by, bm - 1, bd) - new Date(ay, am - 1, ad)) / 86400000);
}

export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function makeReference(prefix) {
  const code = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `YC-${prefix}-${code}`;
}

export function storeRecord(record) {
  try {
    const parsed = JSON.parse(localStorage.getItem(RECORDS_KEY) ?? "[]");
    if (!Array.isArray(parsed)) throw new Error("Stored booking data is invalid.");
    const saved = parsed;
    saved.push(record);
    localStorage.setItem(RECORDS_KEY, JSON.stringify(saved));
    return { success: true, record };
  } catch (error) {
    return { success: false, error };
  }
}

export function isValidPhone(value) {
  const normalized = String(value ?? "").trim();
  const digits = normalized.replace(/\D/g, "");
  return /^[+\d][\d\s().-]*$/.test(normalized) && digits.length >= 7 && digits.length <= 15;
}

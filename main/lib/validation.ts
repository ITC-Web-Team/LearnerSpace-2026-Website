export function isValidRepositoryUrl(value: string) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) && url.hostname.length > 0;
  } catch {
    return false;
  }
}

export function normalizeRepositoryUrl(value: string) {
  return value.trim();
}
const API_BASE = import.meta.env.VITE_API_URL ?? "";
const STALE_TIME = 10 * 60_000;

interface CachedEntry<T> {
  fetchedAt: number;
  data: T;
}

export async function fetchJson<T>(path: string, ttl = STALE_TIME): Promise<T> {
  const key = `portfolio-cache:${path}`;
  try {
    const raw = sessionStorage.getItem(key);
    if (raw) {
      const entry = JSON.parse(raw) as CachedEntry<T>;
      if (Date.now() - entry.fetchedAt < ttl) return entry.data;
    }
  } catch {
    sessionStorage.removeItem(key);
  }

  const res = await fetch(`${API_BASE}${path}`, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);

  const data = (await res.json()) as T;
  try {
    const entry: CachedEntry<T> = { fetchedAt: Date.now(), data };
    sessionStorage.setItem(key, JSON.stringify(entry));
  } catch {
    /* storage full — ignore */
  }
  return data;
}

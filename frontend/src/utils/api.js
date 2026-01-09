const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(path, { method = "GET", body } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(payload.message || `HTTP chyba ${res.status}`);

  return payload;
}

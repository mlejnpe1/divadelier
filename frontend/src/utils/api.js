const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(
  path,
  { method = "GET", body, auth = false } = {}
) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    credentials: auth ? "include" : "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `HTTP chyba ${res.status}`);
  }

  return res.json();
}

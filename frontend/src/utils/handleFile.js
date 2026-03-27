const API_URL = import.meta.env.VITE_API_URL;

export async function uploadFile({ file, scope, slug = "" }) {
  if (!file) {
    throw new Error("Chybí soubor.");
  }

  if (!scope) {
    throw new Error("Chybí scope.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("scope", scope);
  formData.append("slug", slug);

  const res = await fetch(`${API_URL}/api/uploads`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const payload = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(payload.message || "Upload se nepodařil.");
  }

  return payload;
}

export async function deleteUploadedFile(key) {
  if (!String(key || "").trim()) {
    throw new Error("Chybí key souboru.");
  }

  const res = await fetch(`${API_URL}/api/uploads`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      key: String(key).trim(),
    }),
  });

  const payload = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(payload.message || "Smazání souboru se nepodařilo.");
  }

  return payload;
}

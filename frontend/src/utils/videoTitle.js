export function displayVideoTitle(title, kind) {
  const value = String(title || "").trim();
  const prefix =
    kind === "poetrycast"
      ? /^PoetryCast\s*[-–—:]\s*/i
      : kind === "news"
        ? /^TV\s*VV(?:\s*\(=Televize ve výloze\))?\s*[-–—]\s*Novinky z výlohy\s*[:\-–—]\s*/i
      : /^TV\s*VV(?:\s*\(=Televize ve výloze\))?\s*[-–—]\s*Speciál z Divadeliéru\s*[-–—]\s*/i;
  return value.replace(prefix, "").trim() || value;
}

import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
} from "./metadata.js";

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([name, value]) => {
    element.setAttribute(name, value);
  });
}

function upsertLink(selector, attributes) {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("link");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([name, value]) => {
    element.setAttribute(name, value);
  });
}

export function applyPageMetadata({
  path,
  title,
  description,
  image = DEFAULT_OG_IMAGE,
  index = true,
}) {
  const canonicalUrl = new URL(path || "/", SITE_URL).toString();
  const robots = index
    ? "index, follow, max-image-preview:large"
    : "noindex, nofollow";

  document.title = title;
  upsertMeta('meta[name="description"]', {
    name: "description",
    content: description,
  });
  upsertMeta('meta[name="robots"]', { name: "robots", content: robots });
  upsertLink('link[rel="canonical"]', {
    rel: "canonical",
    href: canonicalUrl,
  });

  const socialMetadata = [
    ['meta[property="og:type"]', { property: "og:type", content: "website" }],
    [
      'meta[property="og:site_name"]',
      { property: "og:site_name", content: SITE_NAME },
    ],
    ['meta[property="og:locale"]', { property: "og:locale", content: "cs_CZ" }],
    ['meta[property="og:title"]', { property: "og:title", content: title }],
    [
      'meta[property="og:description"]',
      { property: "og:description", content: description },
    ],
    ['meta[property="og:url"]', { property: "og:url", content: canonicalUrl }],
    ['meta[property="og:image"]', { property: "og:image", content: image }],
    [
      'meta[property="og:image:alt"]',
      {
        property: "og:image:alt",
        content: "Divadeliér – kulturní prostor ve Vysokém Mýtě",
      },
    ],
    [
      'meta[name="twitter:card"]',
      { name: "twitter:card", content: "summary_large_image" },
    ],
    ['meta[name="twitter:title"]', { name: "twitter:title", content: title }],
    [
      'meta[name="twitter:description"]',
      { name: "twitter:description", content: description },
    ],
    ['meta[name="twitter:image"]', { name: "twitter:image", content: image }],
  ];

  socialMetadata.forEach(([selector, attributes]) =>
    upsertMeta(selector, attributes),
  );
}

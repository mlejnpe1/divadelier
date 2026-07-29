import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import {
  DEFAULT_OG_IMAGE,
  SEO_PAGES,
  SITE_NAME,
  SITE_URL,
  getSeoForPath,
} from "../src/seo/metadata.js";

const distDirectory = join(process.cwd(), "dist");
const templatePath = join(distDirectory, "index.html");
const template = await readFile(templatePath, "utf8");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function renderSeoHead(page) {
  const canonicalUrl = new URL(page.path || "/", SITE_URL).toString();
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);
  const robots =
    page.index === false
      ? "noindex, nofollow"
      : "index, follow, max-image-preview:large";

  return `<meta name="seo-head-start" content="divadelier">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="robots" content="${robots}">
    <link rel="canonical" href="${canonicalUrl}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${SITE_NAME}">
    <meta property="og:locale" content="cs_CZ">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:image" content="${DEFAULT_OG_IMAGE}">
    <meta property="og:image:alt" content="Divadeliér – kulturní prostor ve Vysokém Mýtě">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${DEFAULT_OG_IMAGE}">
    <meta name="seo-head-end" content="divadelier">`;
}

function renderPage(page) {
  const seoHeadPattern =
    /<meta name="seo-head-start" content="divadelier"\s*\/?>[\s\S]*?<meta name="seo-head-end" content="divadelier"\s*\/?>/;

  if (!seoHeadPattern.test(template)) {
    throw new Error("SEO head markers are missing from the Vite build output.");
  }

  return template.replace(seoHeadPattern, renderSeoHead(page));
}

for (const page of SEO_PAGES) {
  const outputPath =
    page.path === "/"
      ? templatePath
      : join(distDirectory, page.path.slice(1), "index.html");

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, renderPage(page), "utf8");
}

const notFoundPage = getSeoForPath("/404");
await writeFile(
  join(distDirectory, "404.html"),
  renderPage(notFoundPage),
  "utf8",
);

const sitemapUrls = SEO_PAGES.filter(
  ({ index = true, sitemap = true }) => index && sitemap,
).map(({ path }) => {
  const location = new URL(path, SITE_URL).toString();
  return `  <url><loc>${escapeHtml(location)}</loc></url>`;
});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.join("\n")}
</urlset>
`;

await writeFile(join(distDirectory, "sitemap.xml"), sitemap, "utf8");

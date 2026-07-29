export const SITE_URL = "https://divadelier.cz";
export const SITE_NAME = "Divadeliér";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-divadelier.jpg`;

export const DEFAULT_DESCRIPTION =
  "Divadeliér je otevřený kulturní prostor ve Vysokém Mýtě pro divadlo, koncerty, přednášky, výstavy, kurzy a promítání.";

export const SEO_PAGES = [
  {
    path: "/",
    title: "Divadeliér – divadlo a kulturní prostor ve Vysokém Mýtě",
    description: DEFAULT_DESCRIPTION,
  },
  {
    path: "/kontakt",
    title: "Kontakt a adresa | Divadeliér Vysoké Mýto",
    description:
      "Kontaktujte Divadeliér. Najdete nás na adrese Pražská 8 ve Vysokém Mýtě. Informace ke kurzům, akcím, pronájmu a spolupráci.",
  },
  {
    path: "/drZdiv",
    title: "Dr. ZDIV – dětské divadelní skupiny | Divadeliér",
    description:
      "Dr. ZDIV jsou dětské divadelní skupiny Divadeliéru plné energie, hravosti a vlastní tvorby pro mladé divadelníky.",
  },
  {
    path: "/divan",
    title: "Divan – divadelní skupina pro dospělé | Divadeliér",
    description:
      "Divan je skupina dospělých divadelních nadšenců ve Vysokém Mýtě, která rozvíjí herecké dovednosti a tvoří představení.",
  },
  {
    path: "/vvv",
    title: "Výstavy ve výloze (VVV) | Divadeliér",
    description:
      "Aktuální a připravované Výstavy ve výloze Divadeliéru ve Vysokém Mýtě. Objevte vystavující autory a jejich tvorbu.",
  },
  {
    path: "/tvvv",
    title: "TV VV – Televize ve výloze | Divadeliér",
    description:
      "TV VV přináší rozhovory, reportáže a speciály z Výstav ve výloze a kulturního dění v Divadeliéru.",
  },
  {
    path: "/historie",
    title: "Historie Divadeliéru | Vysoké Mýto",
    description:
      "Prohlédněte si historii Divadeliéru, jeho divadelních skupin, výstav a kulturních akcí ve Vysokém Mýtě.",
  },
  {
    path: "/kurzy",
    title: "Divadelní kurzy pro děti i dospělé | Divadeliér",
    description:
      "Pravidelné i jednorázové divadelní kurzy, workshopy a individuální příprava pro děti, dospělé i studenty ve Vysokém Mýtě.",
  },
  {
    path: "/akce",
    title: "Program akcí | Divadeliér Vysoké Mýto",
    description:
      "Aktuální program Divadeliéru: divadelní představení, koncerty, přednášky, besedy, workshopy a další kulturní akce.",
  },
  {
    path: "/let-andelu",
    title: "Let andělů ve Vysokém Mýtě | Divadeliér",
    description:
      "Let andělů je tradiční předvánoční akce Divadeliéru s kostýmy, světly a velkými loutkami v ulicích Vysokého Mýta.",
  },
  {
    path: "/pronajem",
    title: "Pronájem kulturního prostoru | Divadeliér",
    description:
      "Pronajměte si komorní prostor Divadeliéru ve Vysokém Mýtě pro divadlo, workshop, přednášku, výstavu, setkání nebo tvorbu.",
  },
  {
    path: "/obchodni-podminky",
    title: "Obchodní podmínky | Divadeliér",
    description: "Obchodní podmínky provozovatele webu Divadeliér.",
    sitemap: false,
  },
  {
    path: "/zasady-zpracovani-osobnich-udaju",
    title: "Zásady zpracování osobních údajů | Divadeliér",
    description:
      "Informace o zpracování a ochraně osobních údajů na webu Divadeliér.",
    sitemap: false,
  },
  {
    path: "/zasady-cookies",
    title: "Zásady cookies | Divadeliér",
    description: "Informace o používání cookies na webu Divadeliér.",
    sitemap: false,
  },
  {
    path: "/mimosoudni-reseni-spotrebitelskych-sporu",
    title: "Mimosoudní řešení spotřebitelských sporů | Divadeliér",
    description:
      "Informace o mimosoudním řešení spotřebitelských sporů pro návštěvníky webu Divadeliér.",
    sitemap: false,
  },
  {
    path: "/login",
    title: "Přihlášení | Divadeliér",
    description: "Přihlášení do správy webu Divadeliér.",
    index: false,
    sitemap: false,
  },
  {
    path: "/eshop",
    title: "E-shop je dočasně nedostupný | Divadeliér",
    description: "E-shop Divadeliéru je momentálně mimo provoz.",
    index: false,
    sitemap: false,
  },
];

export function getSeoForPath(pathname) {
  const normalizedPath =
    pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  const staticPage = SEO_PAGES.find(({ path }) => path === normalizedPath);

  if (staticPage) return staticPage;

  if (/^\/akce\/[^/]+$/.test(normalizedPath)) {
    return {
      path: normalizedPath,
      title: "Detail akce | Divadeliér",
      description: "Podrobnosti o kulturní akci v Divadeliéru.",
    };
  }

  if (/^\/vvv\/[^/]+$/.test(normalizedPath)) {
    return {
      path: normalizedPath,
      title: "Detail výstavy | Divadeliér",
      description: "Podrobnosti o Výstavě ve výloze Divadeliéru.",
    };
  }

  return {
    path: normalizedPath,
    title: "Stránka nenalezena | Divadeliér",
    description: "Požadovaná stránka na webu Divadeliér nebyla nalezena.",
    index: false,
    sitemap: false,
  };
}

export function toMetaDescription(value, fallback) {
  const normalized = String(value || "")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) return fallback;
  if (normalized.length <= 160) return normalized;

  return `${normalized.slice(0, 157).trimEnd()}…`;
}

const sortImageEntries = (entries) =>
  entries
    .sort(([a], [b]) =>
      a.localeCompare(b, undefined, {
        numeric: true,
        sensitivity: "base",
      }),
    )
    .map(([, url]) => url)
    .filter(Boolean);

const heroImages = sortImageEntries(
  Object.entries(
    import.meta.glob("../assets/images/hero-landingPage/*.{jpg,jpeg,png,webp}", {
      eager: true,
      query: "?url",
      import: "default",
    }),
  ),
);

const rentalImages = sortImageEntries(
  Object.entries(
    import.meta.glob("../assets/images/rental/*.{jpg,jpeg,png,webp}", {
      eager: true,
      query: "?url",
      import: "default",
    }),
  ),
);

const divanImages = sortImageEntries(
  Object.entries(
    import.meta.glob("../assets/images/divan/*.{jpg,jpeg,png,webp}", {
      eager: true,
      query: "?url",
      import: "default",
    }),
  ),
);

const vesaciImages = sortImageEntries(
  Object.entries(
    import.meta.glob("../assets/images/drzdiv-vesaci/*.{jpg,jpeg,png,webp}", {
      eager: true,
      query: "?url",
      import: "default",
    }),
  ),
);

const malcaciImages = sortImageEntries(
  Object.entries(
    import.meta.glob("../assets/images/drzdiv-malcaci/*.{jpg,jpeg,png,webp}", {
      eager: true,
      query: "?url",
      import: "default",
    }),
  ),
);

const palcaciImages = sortImageEntries(
  Object.entries(
    import.meta.glob("../assets/images/drzdiv-palcaci/*.{jpg,jpeg,png,webp}", {
      eager: true,
      query: "?url",
      import: "default",
    }),
  ),
);

const prstenaciImages = sortImageEntries(
  Object.entries(
    import.meta.glob(
      "../assets/images/drzdiv-prstenaci/*.{jpg,jpeg,png,webp}",
      {
        eager: true,
        query: "?url",
        import: "default",
      },
    ),
  ),
);

const takeGallery = (...imageSets) => {
  const combined = imageSets.flat().filter(Boolean);
  return Array.from(new Set(combined)).slice(0, 5);
};

const visualPresets = [
  {
    key: "sunlight",
    cover: heroImages[3] || heroImages[0] || rentalImages[0] || divanImages[0] || "",
    gallery: takeGallery(heroImages.slice(0, 5), rentalImages.slice(0, 2)),
  },
  {
    key: "studio",
    cover: rentalImages[2] || rentalImages[0] || heroImages[1] || divanImages[0] || "",
    gallery: takeGallery(rentalImages.slice(0, 5), heroImages.slice(0, 2)),
  },
  {
    key: "ensemble",
    cover: divanImages[4] || divanImages[0] || heroImages[2] || rentalImages[0] || "",
    gallery: takeGallery(divanImages.slice(0, 5), heroImages.slice(0, 2)),
  },
];

const customGroupImages = {
  vesaci: vesaciImages,
  malcaci: malcaciImages,
  palcaci: palcaciImages,
  prstenaci: prstenaciImages,
};

const pickPresetIndex = (title, index = 0) => {
  const normalized = String(title || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (normalized.includes("mlad") || normalized.includes("priprav")) return 0;
  if (normalized.includes("star") || normalized.includes("pokroc")) return 1;
  if (normalized.includes("soubor") || normalized.includes("divad")) return 2;

  return index % visualPresets.length;
};

export const getMeetingVisual = (meeting, index = 0) => {
  const normalizedTitle = String(meeting?.title || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const customKey = Object.keys(customGroupImages).find((key) =>
    normalizedTitle.includes(key),
  );
  const customImages = customKey ? customGroupImages[customKey] : [];

  if (customImages.length) {
    return {
      cover: customImages[0],
      gallery: customImages.slice(0, 5),
    };
  }

  const preset = visualPresets[pickPresetIndex(meeting?.title, index)];

  return {
    cover: preset.cover,
    gallery: preset.gallery,
  };
};

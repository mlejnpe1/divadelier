import Exhibition from "../models/Exhibition.js";
import Action from "../models/Action.js";

function normalizeExhibition(doc) {
  return {
    kind: "exhibition",
    _id: String(doc._id),
    title: doc.title || "",
    description: doc.information || "",
    date: doc.date || null,
    coverImage: {
      url: String(doc.coverImage?.url || ""),
      alt: String(doc.coverImage?.alt || ""),
    },
  };
}

function normalizeAction(doc) {
  return {
    kind: "action",
    _id: String(doc._id),
    title: doc.title || "",
    description: doc.description || "",
    date: doc.date || null,
    coverImage: {
      url: String(doc.coverImage?.url || ""),
      alt: String(doc.coverImage?.alt || ""),
    },
  };
}

function matchesQuery(item, q) {
  if (!q) {
    return true;
  }

  const s = q.toLowerCase();
  return (
    String(item.title || "")
      .toLowerCase()
      .includes(s) ||
    String(item.description || "")
      .toLowerCase()
      .includes(s)
  );
}

function toValidTime(value) {
  if (!value) {
    return null;
  }

  const t = new Date(value).getTime();
  if (!Number.isFinite(t)) {
    return null;
  }

  return t;
}

function sortByDateDesc(items) {
  return [...items].sort((a, b) => {
    const ad = toValidTime(a.date);
    const bd = toValidTime(b.date);

    if (ad === null && bd === null) {
      return 0;
    }
    if (ad === null) {
      return 1;
    }
    if (bd === null) {
      return -1;
    }

    return bd - ad;
  });
}

function pickFeatured(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  // Vždy převést na lokální "date-only" (00:00 local) nebo null.
  function parseToLocalDateOnly(value) {
    if (!value) {
      return null;
    }

    if (value instanceof Date) {
      if (Number.isNaN(value.getTime())) {
        return null;
      }
      return new Date(value.getFullYear(), value.getMonth(), value.getDate());
    }

    const s = String(value);

    // čisté YYYY-MM-DD -> bereme jako lokální datum (bez timezone posunů)
    const m = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.exec(s);
    if (m) {
      const y = Number(m[1]);
      const mo = Number(m[2]) - 1;
      const d = Number(m[3]);
      return new Date(y, mo, d);
    }

    // ostatní formáty (např. ISO s časem/Z) -> naparsovat a oříznout na lokální den
    const dt = new Date(s);
    if (Number.isNaN(dt.getTime())) {
      return null;
    }

    return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
  }

  function dateKeyLocal(dt) {
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, "0");
    const d = String(dt.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  const today = new Date();
  const todayDateOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const todayKey = dateKeyLocal(todayDateOnly);

  const scored = items
    .map((x) => {
      const dt = parseToLocalDateOnly(x.date);
      if (!dt) {
        return null;
      }

      const key = dateKeyLocal(dt);
      const dayDiff = Math.round(
        (dt.getTime() - todayDateOnly.getTime()) / 86400000,
      );

      const bucket = key === todayKey ? 0 : dayDiff >= 0 ? 1 : 2;
      const distance = key === todayKey ? 0 : Math.abs(dayDiff);

      return { item: x, bucket, distance };
    })
    .filter(Boolean);

  if (scored.length === 0) {
    return items[0];
  }

  scored.sort((a, b) => {
    if (a.bucket !== b.bucket) {
      return a.bucket - b.bucket;
    }
    if (a.distance !== b.distance) {
      return a.distance - b.distance;
    }
    return 0;
  });

  return scored[0].item;
}

export async function getTimeline(req, res) {
  try {
    const type = String(req.query.type || "all");
    const q = String(req.query.q || "").trim();

    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.max(
      1,
      Math.min(50, parseInt(req.query.limit || "8", 10)),
    );

    const wantActions = type === "all" || type === "action";
    const wantExhibitions = type === "all" || type === "exhibition";

    const [actions, exhibitions] = await Promise.all([
      wantActions ? Action.find().lean() : Promise.resolve([]),
      wantExhibitions ? Exhibition.find().lean() : Promise.resolve([]),
    ]);

    let items = [
      ...actions.map(normalizeAction),
      ...exhibitions.map(normalizeExhibition),
    ];

    if (q) {
      items = items.filter((x) => matchesQuery(x, q));
    }

    items = sortByDateDesc(items);

    const total = items.length;
    const pageCount = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, pageCount);

    const start = (safePage - 1) * limit;
    const paged = items.slice(start, start + limit);

    return res.status(200).json({
      items: paged,
      total,
      page: safePage,
      limit,
      pageCount,
    });
  } catch (error) {
    console.error("Error in getTimeline Controller.", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

export async function getFeaturedTimelineItem(req, res) {
  try {
    const [actions, exhibitions] = await Promise.all([
      Action.find().lean(),
      Exhibition.find().lean(),
    ]);

    const items = sortByDateDesc([
      ...actions.map(normalizeAction),
      ...exhibitions.map(normalizeExhibition),
    ]);

    const featured = pickFeatured(items);
    if (!featured) {
      return res.status(404).json({ message: "Item not found." });
    }

    return res.status(200).json(featured);
  } catch (error) {
    console.error("Error in getFeaturedTimelineItem Controller.", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

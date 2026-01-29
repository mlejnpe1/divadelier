import Exhibition from "../models/Exhibition.js";
import Action from "../models/Actions.js";

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
  if (!q) return true;
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

function sortByDate(items, dir) {
  const sign = dir === "date_asc" ? 1 : -1;

  return items.sort((a, b) => {
    const ad = a.date ? new Date(a.date).getTime() : 0;
    const bd = b.date ? new Date(b.date).getTime() : 0;
    return sign * (ad - bd);
  });
}

function pickFeatured(items) {
  if (!Array.isArray(items) || items.length === 0) return null;

  const now = new Date();
  const withDate = items
    .map((x) => ({
      ...x,
      __t: x.date ? new Date(x.date).getTime() : null,
    }))
    .filter((x) => x.__t !== null && !Number.isNaN(x.__t));

  if (withDate.length === 0) return items[0];

  const upcoming = withDate.filter((x) => x.__t >= now.getTime());
  const pool = upcoming.length > 0 ? upcoming : withDate;

  pool.sort(
    (a, b) => Math.abs(a.__t - now.getTime()) - Math.abs(b.__t - now.getTime()),
  );
  const best = pool[0];
  const { __t, ...clean } = best;
  return clean;
}

export async function getTimeline(req, res) {
  try {
    const type = String(req.query.type || "all"); // all|action|exhibition
    const q = String(req.query.q || "").trim();
    const sort = String(req.query.sort || "date_desc"); // date_desc|date_asc

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

    if (q) items = items.filter((x) => matchesQuery(x, q));

    items = sortByDate(items, sort);

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

    const items = [
      ...actions.map(normalizeAction),
      ...exhibitions.map(normalizeExhibition),
    ];

    const featured = pickFeatured(items);
    if (!featured) return res.status(404).json({ message: "Item not found." });

    return res.status(200).json(featured);
  } catch (error) {
    console.error("Error in getFeaturedTimelineItem Controller.", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

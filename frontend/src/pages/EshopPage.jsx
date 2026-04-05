import React, { useMemo, useState } from "react";
import { ChevronRight, Filter, Package2, Plus } from "lucide-react";
import Hero from "../components/layout/Hero.jsx";
import Section from "../components/layout/Section.jsx";
import ScrollHint from "../components/layout/ScrollHint.jsx";
import Button from "../components/layout/Button.jsx";
import InquiryModal from "../components/InquiryModal.jsx";
import ListToolbar from "../components/layout/ListToolbar.jsx";
import ShopItemCard from "../components/shop/ShopItemCard.jsx";
import ShopItemFormModal from "../components/shop/ShopItemFormModal.jsx";
import ShopImageLightbox from "../components/shop/ShopImageLightbox.jsx";
import { useFetch } from "../hooks/useFetch.js";
import { useAuth } from "../hooks/useAuth.js";
import { useDebouncedValue } from "../hooks/useDebouncedValue.js";
import { apiFetch } from "../utils/api.js";
import { toastAction } from "../utils/toastAction.jsx";
import { confirmToast } from "../utils/confirmToast.jsx";

function buildShopInquiryMessage(item) {
  return `Dobrý den,\n\nmám zájem o produkt „${item.title}“ za ${item.price} Kč.\nProsím o více informací k dostupnosti a dalšímu postupu.\n\nDěkuji.`;
}

function getCategoryLabel(category) {
  if (category === "divadelier") {
    return "Divadelier";
  }

  if (category === "vvv") {
    return "Výstavy ve výloze";
  }

  return "Všechny produkty";
}

function getSourceLabel(shopId) {
  return Number(shopId) === 1 ? "Výstavy ve výloze" : "Divadelier";
}

function buildPath({ refreshKey }) {
  const params = new URLSearchParams();
  params.set("r", String(refreshKey));
  return `/api/shopItems?${params.toString()}`;
}

function formatProductCount(count) {
  if (count === 1) {
    return "1 produkt";
  }

  if (count >= 2 && count <= 4) {
    return `${count} produkty`;
  }

  return `${count} produktů`;
}

export default function EshopPage() {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [query, setQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const debouncedQuery = useDebouncedValue(query, 300);
  const path = useMemo(() => buildPath({ refreshKey }), [refreshKey]);

  const { data, loading, error } = useFetch(path);
  const items = Array.isArray(data) ? data : [];

  const categoryCounts = useMemo(
    () => ({
      all: items.length,
      divadelier: items.filter((item) => Number(item.shop_id) !== 1).length,
      vvv: items.filter((item) => Number(item.shop_id) === 1).length,
    }),
    [items],
  );

  const filteredItems = useMemo(() => {
    const normalizedQuery = debouncedQuery.trim().toLowerCase();

    let nextItems = items.filter((item) => {
      if (activeCategory === "divadelier") {
        return Number(item.shop_id) !== 1;
      }

      if (activeCategory === "vvv") {
        return Number(item.shop_id) === 1;
      }

      return true;
    });

    if (normalizedQuery) {
      nextItems = nextItems.filter((item) => {
        return (
          String(item.title || "")
            .toLowerCase()
            .includes(normalizedQuery) ||
          String(item.description || "")
            .toLowerCase()
            .includes(normalizedQuery)
        );
      });
    }

    return [...nextItems].sort((a, b) => {
      if (sortBy === "title") {
        return String(a.title || "").localeCompare(String(b.title || ""), "cs");
      }

      if (sortBy === "price-asc") {
        return Number(a.price || 0) - Number(b.price || 0);
      }

      if (sortBy === "price-desc") {
        return Number(b.price || 0) - Number(a.price || 0);
      }

      return (
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
      );
    });
  }, [activeCategory, debouncedQuery, items, sortBy]);

  const openInquiry = (item) => {
    setSelectedItem(item);
    setInquiryOpen(true);
  };

  const handleInquirySubmit = async (payload) => {
    await apiFetch("/api/inquiries", {
      method: "POST",
      body: {
        ...payload,
        type: "shop",
        context: `${selectedItem?.title || ""} • ${selectedItem?.price || 0} Kč`,
      },
    });
  };

  const openCreateItem = () => {
    setEditingItem(null);
    setFormOpen(true);
  };

  const openEditItem = (item) => {
    setEditingItem(item);
    setFormOpen(true);
  };

  const closeForm = () => {
    setEditingItem(null);
    setFormOpen(false);
  };

  const refreshShop = () => {
    setRefreshKey((value) => value + 1);
  };

  const handleDeleteItem = async (id) => {
    const ok = await confirmToast({
      message: "Opravdu chcete smazat tento produkt?",
      description: "Tuto položku e-shopu nelze vrátit zpět.",
      confirmText: "Smazat",
      danger: true,
    });

    if (!ok) {
      return;
    }

    await toastAction(
      () => apiFetch(`/api/shopItems/${id}`, { method: "DELETE" }),
      {
        loading: "Mažu produkt...",
        success: "Produkt smazán.",
        error: "Nepodařilo se smazat produkt.",
      },
    );

    refreshShop();
  };

  return (
    <>
      <Hero
        title="E-shop Divadeliéru"
        subtitle="Autorské předměty, drobnosti a výběr z výstav"
        description="Podpořte Divadeliér a vystavující autory. V e-shopu najdete produkty z vlastní nabídky i vybrané věci z Výstav ve výloze."
        buttonText="Projít nabídku"
        onButtonClick={() => {
          const el = document.getElementById("shopSection");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        children={
          <div className="w-full max-w-3xl">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/18 bg-[linear-gradient(145deg,rgba(255,248,236,0.84),rgba(255,232,190,0.36))] p-6 shadow-[0_28px_75px_rgba(60,28,0,0.22)] backdrop-blur-xl md:p-7">
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/28 blur-3xl" />
              <div className="pointer-events-none absolute -left-8 bottom-0 h-28 w-28 rounded-full bg-[#f5a623]/20 blur-3xl" />

              <div className="relative space-y-6">
                <div className="flex flex-wrap gap-2">
                  {[
                    "originální věci",
                    "objednávka přes poptávku",
                    "osobní domluva",
                  ].map((pill) => (
                    <span
                      key={pill}
                      className="inline-flex rounded-full border border-white/50 bg-white/60 px-3 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#7a4d16] shadow-[0_10px_26px_rgba(15,23,42,0.05)]"
                    >
                      {pill}
                    </span>
                  ))}
                </div>

                <div className="rounded-[1.8rem] border border-white/30 bg-white/52 p-6 shadow-[0_18px_44px_rgba(15,23,42,0.08)] backdrop-blur-md">
                  <h2 className="mt-3 text-2xl font-bold leading-tight text-[#3f250f]">
                    Věci z Divadeliéru a Výstav ve výloze
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5f4126]">
                    Najdete tu obrazy, vývory i další autorské předměty. E-shop
                    funguje jednoduše přes poptávku a navazuje na osobnější tón
                    celého webu.
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-[1.35rem] border border-white/45 bg-white/64 px-4 py-4 shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#9a590b]">
                        Nabídka
                      </p>
                      <p className="mt-2 text-sm font-medium text-[#3f250f]">
                        obrazy, vývory, autorské předměty
                      </p>
                    </div>

                    <div className="rounded-[1.35rem] border border-white/45 bg-white/64 px-4 py-4 shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#9a590b]">
                        Sekce
                      </p>
                      <p className="mt-2 text-sm font-medium text-[#3f250f]">
                        Divadelier a Výstavy ve výloze
                      </p>
                    </div>

                    <div className="rounded-[1.35rem] border border-white/45 bg-white/64 px-4 py-4 shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#9a590b]">
                        Aktuálně
                      </p>
                      <p className="mt-2 text-sm font-medium text-[#3f250f]">
                        {formatProductCount(items.length)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      />

      <div className="relative">
        <ScrollHint variant="overlay" color="light" />
      </div>

      <InquiryModal
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        onSubmit={handleInquirySubmit}
        title="Poptávka produktu"
        subtitle="Ozveme se vám s dostupností a dalším postupem."
        contextLabel="Vybraný produkt"
        contextValue={
          selectedItem ? `${selectedItem.title} • ${selectedItem.price} Kč` : ""
        }
        contextType="shop"
        initialMessage={
          selectedItem ? buildShopInquiryMessage(selectedItem) : ""
        }
        summary={
          selectedItem
            ? {
                title: selectedItem.title,
                price: `${selectedItem.price} Kč`,
                label: getSourceLabel(selectedItem.shop_id),
                imageUrl: selectedItem.image?.url || "",
                imageAlt: selectedItem.image?.alt || selectedItem.title,
              }
            : null
        }
      />

      {previewItem ? (
        <ShopImageLightbox
          item={previewItem}
          onClose={() => setPreviewItem(null)}
        />
      ) : null}

      {user && (
        <ShopItemFormModal
          isOpen={formOpen}
          isEdit={Boolean(editingItem?._id)}
          initial={editingItem}
          onClose={closeForm}
          onSaved={() => {
            closeForm();
            refreshShop();
          }}
          modalKey={editingItem?._id || "new-shop-item"}
        />
      )}

      <Section border={true}>
        <div className="mb-6 rounded-[1.75rem] border border-white/45 bg-[linear-gradient(145deg,rgba(255,255,255,0.82),rgba(247,241,233,0.74))] px-5 py-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl md:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-sm">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#9a590b]">
                Jak to funguje
              </p>
              <p className="mt-2 text-sm leading-7 text-[#5f4a35]">
                Jednoduchý postup bez košíku a bez zbytečných kroků.
              </p>
            </div>

            <div className="flex flex-col gap-2 lg:hidden">
              {[
                "Vyberete si produkt",
                "Odešlete poptávku",
                "Ozveme se vám",
              ].map((step, index, array) => (
                <React.Fragment key={step}>
                  <div className="rounded-[1.4rem] border border-white/50 bg-white/72 px-5 py-3 text-center shadow-[0_10px_26px_rgba(15,23,42,0.05)] backdrop-blur-md">
                    <span className="text-sm font-semibold text-[#3f250f]">
                      {step}
                    </span>
                  </div>
                  {index < array.length - 1 ? (
                    <div className="flex justify-center py-1">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/45 bg-white/64 shadow-[0_8px_20px_rgba(15,23,42,0.05)]">
                        <ChevronRight
                          size={16}
                          className="rotate-90 text-[#c46f04]"
                        />
                      </div>
                    </div>
                  ) : null}
                </React.Fragment>
              ))}
            </div>

            <div className="hidden items-center justify-end gap-3 lg:flex">
              {[
                "Vyberete si produkt",
                "Odešlete poptávku",
                "Ozveme se vám",
              ].map((step, index, array) => (
                <React.Fragment key={step}>
                  <div className="rounded-full border border-white/50 bg-white/72 px-5 py-3 shadow-[0_10px_26px_rgba(15,23,42,0.05)] backdrop-blur-md">
                    <span className="text-sm font-semibold text-[#3f250f]">
                      {step}
                    </span>
                  </div>
                  {index < array.length - 1 ? (
                    <span className="text-lg font-semibold text-[#c46f04]">
                      &gt;
                    </span>
                  ) : null}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div
          id="shopSection"
          className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div className="flex items-center gap-3">
            <Package2 className="h-8 w-8 text-[#f5a623]" />
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Nabídka e-shopu
              </h2>
              <p className="mt-2 text-sm leading-7 text-[#5f4a35]">
                {getCategoryLabel(activeCategory)} •{" "}
                {formatProductCount(filteredItems.length)}
              </p>
            </div>
          </div>
        </div>

        <div className="sticky top-[4.75rem] z-20 mb-6 rounded-[1.9rem] border border-white/50 bg-[linear-gradient(145deg,rgba(255,255,255,0.82),rgba(250,244,235,0.74))] p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex rounded-full border border-white/50 bg-white/55 p-1 shadow-[0_16px_34px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                {[
                  { id: "all", label: "Vše", count: categoryCounts.all },
                  {
                    id: "divadelier",
                    label: "Divadelier",
                    count: categoryCounts.divadelier,
                  },
                  {
                    id: "vvv",
                    label: "Výstavy ve výloze",
                    count: categoryCounts.vvv,
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveCategory(tab.id)}
                    className={
                      "rounded-full px-4 py-2 text-sm font-semibold transition " +
                      (activeCategory === tab.id
                        ? "bg-[#f5a623] text-white shadow-[0_12px_26px_rgba(245,166,35,0.24)]"
                        : "text-[#6d573d] hover:bg-white/65")
                    }
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>

              {user ? (
                <Button onClick={openCreateItem}>
                  <Plus size={18} />
                  Přidat produkt
                </Button>
              ) : null}
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <ListToolbar query={query} setQuery={setQuery} />

              <label className="inline-flex items-center gap-3 rounded-[1.25rem] border border-white/45 bg-white/68 px-4 py-3 text-sm font-medium text-[#5f4126] shadow-[0_12px_30px_rgba(15,23,42,0.06)] backdrop-blur-md">
                <Filter size={16} className="text-[#c46f04]" />
                Řadit podle
                <select
                  className="bg-transparent text-sm font-medium text-gray-800 outline-none"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                >
                  <option value="newest">Nejnovějších</option>
                  <option value="title">Názvu A-Z</option>
                  <option value="price-asc">Nejnižší ceny</option>
                  <option value="price-desc">Nejvyšší ceny</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex h-40 items-center justify-center rounded-[1.9rem] border border-white/45 bg-white/62 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-[#f5a623] border-solid" />
          </div>
        ) : error ? (
          <div className="rounded-[1.9rem] border border-red-200 bg-red-50/90 px-6 py-10 text-center text-red-700">
            {error}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-[1.9rem] border border-white/45 bg-[linear-gradient(145deg,rgba(255,255,255,0.84),rgba(247,241,233,0.76))] px-6 py-10 text-center shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-[#746250]">
              E-shop
            </p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">
              Pro zvolený filtr tu zatím nejsou žádné produkty
            </h3>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item) => (
              <ShopItemCard
                key={item._id}
                item={item}
                user={user}
                onInquiry={openInquiry}
                onPreview={setPreviewItem}
                onEdit={openEditItem}
                onDelete={handleDeleteItem}
              />
            ))}
          </div>
        )}
      </Section>
    </>
  );
}

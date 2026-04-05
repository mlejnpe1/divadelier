import React from "react";
import Placeholder from "../../assets/images/placeholder.png";
import Button from "../layout/Button";
import {
  DeleteActionButton,
  EditActionButton,
} from "../layout/ActionIconButton";

function sourceLabel(shopId) {
  return Number(shopId) === 1 ? "Výstavy ve výloze" : "Divadelier";
}

export default function ShopItemCard({
  item,
  user,
  onInquiry,
  onEdit,
  onDelete,
  onPreview,
}) {
  const imageUrl = item.image?.url || Placeholder;
  const hasRealImage = Boolean(item.image?.url);

  return (
    <article className="group relative overflow-hidden rounded-[1.95rem] border border-white/45 bg-[linear-gradient(145deg,rgba(255,255,255,0.88),rgba(247,241,233,0.78))] shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_72px_rgba(15,23,42,0.12)]">
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/35 blur-3xl" />
      <div className="pointer-events-none absolute -left-8 bottom-0 h-24 w-24 rounded-full bg-[#f5a623]/14 blur-3xl" />

      <div className="relative h-[300px] overflow-hidden border-b border-white/30">
        <img
          src={imageUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl opacity-35"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.24),rgba(15,23,42,0.14))]" />
        <button
          type="button"
          onClick={() => {
            if (hasRealImage) {
              onPreview?.(item);
            }
          }}
          className={`relative h-full w-full ${hasRealImage ? "cursor-zoom-in" : "cursor-default"}`}
          aria-label={
            hasRealImage
              ? `Zobrazit produkt ${item.title || ""} ve velkém náhledu`
              : `Produkt ${item.title || ""}`
          }
        >
          <img
            src={imageUrl}
            alt={item.image?.alt || item.title || "Produkt"}
            className="h-full w-full object-contain p-5"
            loading="lazy"
          />
        </button>

        <div className="absolute left-4 top-4 inline-flex rounded-full border border-white/55 bg-white/72 px-3 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#8a5a11] shadow-[0_10px_24px_rgba(15,23,42,0.06)] backdrop-blur-md">
          {sourceLabel(item.shop_id)}
        </div>

        {hasRealImage ? (
          <div className="pointer-events-none absolute bottom-4 left-4 inline-flex rounded-full border border-white/40 bg-slate-950/48 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur-xl">
            Kliknutím zvětšíte
          </div>
        ) : null}

        {user ? (
          <div className="absolute right-4 top-4 flex items-center gap-2">
            <EditActionButton
              label="Upravit produkt"
              onClick={() => onEdit?.(item)}
            />
            <DeleteActionButton
              label="Smazat produkt"
              onClick={() => onDelete?.(item._id)}
            />
          </div>
        ) : null}
      </div>

      <div className="relative flex min-h-[250px] flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-2xl font-bold leading-tight text-gray-900">
              {item.title}
            </h3>
            <p className="mt-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#8a5a11]">
              {sourceLabel(item.shop_id)}
            </p>
          </div>

          <div className="shrink-0 rounded-full border border-[#ffd799]/40 bg-[rgba(245,166,35,0.12)] px-4 py-2 text-right shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
            <div className="text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-[#8a5a11]">
              Cena
            </div>
            <div className="mt-1 text-lg font-semibold text-gray-900">
              {item.price} Kč
            </div>
          </div>
        </div>

        {item.description ? (
          <p className="mt-4 line-clamp-3 text-sm leading-8 text-[#5f4a35]">
            {item.description}
          </p>
        ) : (
          <p className="mt-4 text-sm leading-8 text-[#7a6751]">
            Produkt z nabídky Divadeliéru. V případě zájmu nám napište a ozveme
            se vám s detaily.
          </p>
        )}

        <div className="mt-auto flex flex-wrap gap-3 pt-6">
          {hasRealImage ? (
            <Button
              type="button"
              variant="secondary"
              onClick={() => onPreview?.(item)}
              className="border-white/55 bg-white/70"
            >
              Zvětšit fotku
            </Button>
          ) : null}
          <Button type="button" onClick={() => onInquiry?.(item)}>
            Mám zájem
          </Button>
        </div>
      </div>
    </article>
  );
}

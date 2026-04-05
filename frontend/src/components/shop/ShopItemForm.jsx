import React, { useEffect, useState } from "react";
import { ImagePlus, Package, Tag, X } from "lucide-react";
import toast from "react-hot-toast";
import { toastAction } from "../../utils/toastAction";
import { apiFetch } from "../../utils/api";
import Button from "../layout/Button";
import Placeholder from "../../assets/images/placeholder.png";
import useShopItemUploadSession from "../../hooks/useShopItemUploadSession.js";
import {
  fieldClass,
  sectionClass,
} from "../exhibitions/exhibitionFormStyles.js";

function createEmptyDraft() {
  return {
    shop_id: 0,
    title: "",
    description: "",
    price: "",
    contact: "",
    image: { url: "", alt: "", key: "" },
  };
}

function buildDraft(initial) {
  if (!initial) {
    return createEmptyDraft();
  }

  return {
    shop_id: Number(initial.shop_id ?? 0),
    title: initial.title || "",
    description: initial.description || "",
    price:
      initial.price === null || initial.price === undefined
        ? ""
        : String(initial.price),
    contact: initial.contact || "",
    image: {
      url: initial.image?.url || "",
      alt: initial.image?.alt || "",
      key: initial.image?.key || "",
    },
  };
}

export default function ShopItemForm({
  initial,
  onSaved,
  onClose,
  onRegisterRequestClose,
}) {
  const [draft, setDraft] = useState(() => buildDraft(initial));
  const [saving, setSaving] = useState(false);

  const isEdit = Boolean(initial?._id);

  useEffect(() => {
    setDraft(buildDraft(initial));
  }, [initial]);

  const saveItem = async () => {
    if (!draft.title.trim()) {
      toast.error("Zadej název produktu.");
      return null;
    }

    if (!draft.price || !Number.isFinite(Number(draft.price))) {
      toast.error("Zadej platnou cenu produktu.");
      return null;
    }

    const payload = {
      shop_id: Number(draft.shop_id ?? 0),
      title: draft.title.trim(),
      description: draft.description.trim(),
      price: Number(draft.price),
      contact: draft.contact.trim(),
      image: {
        url: draft.image?.url?.trim() || "",
        alt: draft.image?.alt?.trim() || "",
        key: draft.image?.key?.trim() || "",
      },
    };

    setSaving(true);

    try {
      const saved = await toastAction(
        () =>
          apiFetch(
            isEdit ? `/api/shopItems/${initial._id}` : "/api/shopItems",
            {
              method: isEdit ? "PUT" : "POST",
              body: payload,
            },
          ),
        {
          loading: isEdit ? "Ukládám produkt..." : "Přidávám produkt...",
          success: isEdit ? "Produkt aktualizován." : "Produkt přidán.",
          error: isEdit
            ? "Nepodařilo se uložit produkt."
            : "Nepodařilo se přidat produkt.",
        },
      );

      onSaved?.(saved);
      return saved;
    } finally {
      setSaving(false);
    }
  };

  const {
    handleCancel,
    handleSubmit,
    uploadManagedFile,
    removeManagedFile,
    isUploading,
  } = useShopItemUploadSession({
    draft,
    onClose,
    onSubmit: saveItem,
  });

  useEffect(() => {
    onRegisterRequestClose?.(() => handleCancel());
    return () => {
      onRegisterRequestClose?.(null);
    };
  }, [handleCancel, onRegisterRequestClose]);

  const uploadImageFile = async (file) => {
    if (!file) {
      return;
    }

    await uploadManagedFile({
      file,
      previousKey: draft.image?.key,
      onUploaded: (uploaded) => {
        setDraft((prev) => ({
          ...prev,
          image: {
            url: uploaded.url,
            alt:
              prev.image?.alt?.trim() ||
              prev.title?.trim() ||
              "Produktová fotografie",
            key: uploaded.key,
          },
        }));
      },
    });
  };

  const clearImage = async () => {
    await removeManagedFile({
      key: draft.image?.key,
      clearState: () =>
        setDraft((prev) => ({
          ...prev,
          image: { url: "", alt: "", key: "" },
        })),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative overflow-hidden rounded-[2rem] border border-white/50 bg-[linear-gradient(145deg,rgba(255,255,255,0.78),rgba(255,247,237,0.68))] p-5 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur-2xl md:p-7"
    >
      <div className="pointer-events-none absolute -left-12 top-10 h-40 w-40 rounded-full bg-[#f5a623]/18 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-48 w-48 rounded-full bg-white/35 blur-3xl" />

      <div className="relative space-y-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-gray-900">
              {isEdit ? "Upravit produkt" : "Přidat produkt"}
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">
              Vyplň název, cenu a zvol kategorii.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={handleCancel} variant="secondary">
              <X size={18} />
              Zrušit
            </Button>

            <Button
              type="submit"
              disabled={saving || isUploading}
              className="disabled:hover:translate-y-0 disabled:hover:scale-100"
            >
              {saving ? "Ukládám..." : "Uložit produkt"}
            </Button>
          </div>
        </div>

        <div className={`${sectionClass} grid gap-4 md:grid-cols-2`}>
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Package size={16} className="text-[#c46f04]" />
              Název produktu
            </span>
            <input
              type="text"
              value={draft.title}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, title: event.target.value }))
              }
              className={fieldClass}
              placeholder="povinné"
            />
          </label>

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Tag size={16} className="text-[#c46f04]" />
              Cena v Kč
            </span>
            <input
              type="number"
              min="0"
              step="1"
              value={draft.price}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, price: event.target.value }))
              }
              className={fieldClass}
              placeholder="povinné"
            />
          </label>

          <label className="block">
            <span className="mb-2 text-sm font-semibold text-gray-700">
              Sekce e-shopu
            </span>
            <select
              value={String(draft.shop_id)}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  shop_id: Number(event.target.value),
                }))
              }
              className={fieldClass}
            >
              <option value="0">Divadelier</option>
              <option value="1">Výstavy ve výloze</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 text-sm font-semibold text-gray-700">
              Kontaktní e-mail
            </span>
            <input
              type="email"
              value={draft.contact}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, contact: event.target.value }))
              }
              className={fieldClass}
              placeholder="nepovinné"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="mb-2 text-sm font-semibold text-gray-700">
              Popis produktu
            </span>
            <textarea
              rows={4}
              value={draft.description}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              className={fieldClass}
              placeholder="nepovinné"
            />
          </label>
        </div>

        <div className={sectionClass}>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">
                Produktová fotografie
              </h4>
            </div>

            <div className="flex flex-wrap gap-2">
              <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#f5a623] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(245,166,35,0.28)] transition hover:-translate-y-0.5 hover:bg-[#e39a1b]">
                <ImagePlus size={18} />
                {draft.image?.url ? "Nahradit fotku" : "Nahrát fotku"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="hidden"
                  onChange={async (event) => {
                    await uploadImageFile(event.target.files?.[0]);
                    event.target.value = "";
                  }}
                />
              </label>

              <Button
                type="button"
                variant="secondary"
                onClick={clearImage}
                disabled={!draft.image?.url}
              >
                Odebrat fotku
              </Button>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-[1.7rem] border border-white/45 bg-white/62 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
            <div className="relative h-[280px]">
              <img
                src={draft.image?.url || Placeholder}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl opacity-35"
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.24),rgba(15,23,42,0.12))]" />
              <img
                src={draft.image?.url || Placeholder}
                alt={draft.image?.alt || draft.title || "Produkt"}
                className="relative h-full w-full object-contain p-4"
              />
            </div>
          </div>

          <label className="mt-4 block">
            <span className="mb-2 text-sm font-semibold text-gray-700">
              Alt text fotografie
            </span>
            <input
              type="text"
              value={draft.image?.alt || ""}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  image: { ...(prev.image || {}), alt: event.target.value },
                }))
              }
              className={fieldClass}
              placeholder="nepovinné"
            />
          </label>
        </div>
      </div>
    </form>
  );
}

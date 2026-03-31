import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import Hero from "../components/layout/Hero.jsx";
import Section from "../components/layout/Section.jsx";
import Button from "../components/layout/Button.jsx";
import SpecialForm from "../components/specials/SpecialForm.jsx";
import SpecialsList from "../components/specials/SpecialList.jsx";
import Pagination from "../components/layout/Pagiantion.jsx";
import ListToolbar from "../components/layout/ListToolbar.jsx";
import ScrollHint from "../components/layout/ScrollHint.jsx";
import { useFetch } from "../hooks/useFetch.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import { useListControls } from "../hooks/useListControls.jsx";
import { toastAction } from "../utils/toastAction.jsx";
import { apiFetch } from "../utils/api.js";
import { confirmToast } from "../utils/confirmToast.jsx";

const EMPTY_SPECIAL_DRAFT = {
  name: "",
  authorName: "",
  information: "",
  link: "",
};

const TVVVPage = () => {
  const { data, loading } = useFetch("/api/specials");
  const { user } = useAuth();
  const [specials, setSpecials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState(EMPTY_SPECIAL_DRAFT);

  useEffect(() => {
    if (Array.isArray(data)) setSpecials(data);
  }, [data]);

  const isEdit = Boolean(editingId);

  const controls = useListControls(specials, {
    pageSize: 8,
    getSortValue: (s) => new Date(s.createdAt || 0),
    sortDirection: "desc",
    searchFields: [
      (s) => s.name,
      (s) => s.authorName,
      (s) => s.information,
      (s) => s.link,
    ],
  });

  const openCreate = () => {
    setEditingId(null);
    setDraft(EMPTY_SPECIAL_DRAFT);
    setShowForm(true);
  };

  const openEdit = (s) => {
    setEditingId(s._id);
    setDraft({
      name: s.name || "",
      authorName: s.authorName || "",
      information: s.information || "",
      link: s.link || "",
    });
    setShowForm(true);
  };

  const close = () => {
    setEditingId(null);
    setDraft(EMPTY_SPECIAL_DRAFT);
    setShowForm(false);
  };

  const validate = (d) => {
    if (!d.name?.trim()) return "Zadej název speciálu.";
    if (!d.link?.trim()) return "Zadej odkaz.";
    try {
      new URL(d.link.trim());
    } catch {
      return "Odkaz musí být validní URL (např. https://...).";
    }
    return null;
  };

  const onSave = async (e) => {
    e?.preventDefault?.();

    const err = validate(draft);
    if (err) return toast.error(err);

    const payload = {
      name: draft.name.trim(),
      authorName: (draft.authorName || "").trim(),
      information: (draft.information || "").trim(),
      link: draft.link.trim(),
    };

    setCreating(true);
    try {
      const saved = await toastAction(
        () =>
          apiFetch(isEdit ? `/api/specials/${editingId}` : "/api/specials", {
            method: isEdit ? "PUT" : "POST",
            body: payload,
          }),
        {
          loading: isEdit ? "Ukládám změny..." : "Přidávám speciál...",
          success: isEdit ? "Speciál aktualizován." : "Speciál přidán.",
          error: isEdit
            ? "Chyba při ukládání."
            : "Nepodařilo se přidat speciál.",
        },
      );

      setSpecials((prev) =>
        isEdit
          ? prev.map((x) => (x._id === saved._id ? saved : x))
          : [saved, ...prev],
      );

      close();
    } finally {
      setCreating(false);
    }

    controls.setQuery("");
    controls.setPage(1);
  };

  const onDelete = async (id) => {
    const ok = await confirmToast({
      message: "Opravdu chcete smazat tento speciál?",
      description: "Tuto akci nelze vrátit zpět.",
      confirmText: "Smazat",
      danger: true,
    });
    if (!ok) return;

    await toastAction(
      () => apiFetch(`/api/specials/${id}`, { method: "DELETE" }),
      {
        loading: "Mažu speciál...",
        success: "Speciál smazán.",
        error: "Nepodařilo se smazat speciál.",
      },
    );

    setSpecials((prev) => prev.filter((s) => s._id !== id));
    if (editingId === id) close();

    controls.setPage((p) => Math.max(1, Math.min(p, controls.pageCount)));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Hero
        title="TV VV – Televize ve výloze"
        subtitle="Archiv i aktuální přehled speciálů z Divadelieru."
        buttonText="Přejít na speciály"
        onButtonClick={() => {
          const el = document.getElementById("specialsSection");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />
      <div className="relative">
        <ScrollHint variant="overlay" color="light" />
      </div>

      <Section border={true}>
        <p className="text-gray-700">
          Televize ve výloze vás každý týden informuje o událostech v
          Divadelieru v Novinkách z výlohy a ve Speciálu z Divadelieru se
          můžete podívat na rozhovory s úžasnými hosty, kteří Divadelier
          navštívili či v něm vystupovali.
        </p>
      </Section>

      <Section id="specialsSection">
        <div className="relative overflow-hidden rounded-[2rem] md:p-8">
          <div className="relative mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-[#3d2514]">
                Speciály z Divadeliéru
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6b4b2b] md:text-base">
                Výběr rozhovorů, hostů a záznamů z TV VV v jednom přehledném
                archivu.
              </p>
            </div>

            {user && (
              <Button onClick={openCreate}>
                <Plus size={18} />
                Přidat speciál
              </Button>
            )}
          </div>

          {user && showForm && (
            <div className="relative mb-6 md:p-6">
              <SpecialForm
                isEdit={isEdit}
                draft={draft}
                setDraft={setDraft}
                creating={creating}
                onClose={close}
                onSubmit={onSave}
              />
            </div>
          )}

          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-[#f5a623] border-solid" />
            </div>
          ) : (
            <div className="relative md:p-6">
              <ListToolbar
                query={controls.query}
                setQuery={controls.setQuery}
                totalCount={controls.totalCount}
                filteredCount={controls.filteredCount}
              />

              <SpecialsList
                specials={controls.items}
                user={user}
                onEdit={openEdit}
                onDelete={onDelete}
              />

              <Pagination
                page={controls.page}
                pageCount={controls.pageCount}
                onPageChange={controls.setPage}
              />
            </div>
          )}
        </div>
      </Section>
    </div>
  );
};

export default TVVVPage;

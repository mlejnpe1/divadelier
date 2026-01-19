import React, { useEffect, useMemo, useState } from "react";
import Hero from "../components/Hero.jsx";
import Section from "../components/Section.jsx";
import { useFetch } from "../hooks/useFetch.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import SpecialsList from "../components/SpecialList.jsx";
import { Plus } from "lucide-react";
import SpecialForm from "../components/SpecialForm.jsx";
import { toastAction } from "../utils/toastAction.jsx";
import { apiFetch } from "../utils/api.js";
import { confirmToast } from "../utils/confirmToast.jsx";
import Pagination from "../components/Pagiantion.jsx";
import { useListControls } from "../hooks/useListControls.jsx";
import ListToolbar from "../components/ListToolbar.jsx";

const EMPTY_SPECIAL_DRAFT = { name: "", information: "", link: "" };

const TVVVPage = () => {
  const { data, loading } = useFetch("/api/specials");
  const { user } = useAuth();
  const [specials, setSpecials] = useState([]);

  useEffect(() => {
    if (Array.isArray(data)) setSpecials(data);
  }, [data]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState(EMPTY_SPECIAL_DRAFT);

  const isEdit = Boolean(editingId);

  const openCreate = () => {
    setEditingId(null);
    setDraft(EMPTY_SPECIAL_DRAFT);
    setShowForm(true);
  };

  const openEdit = (s) => {
    setEditingId(s._id);
    setDraft({
      name: s.name || "",
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

    setQuery("");
    setPage(1);
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

    setPage((p) => Math.max(1, Math.min(p, pageCount)));
  };

  const controls = useListControls(specials, {
    pageSize: 8,
    getSortValue: (s) => s.name,
    searchFields: [(s) => s.name, (s) => s.information, (s) => s.link],
  });

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      <Hero
        title="TV VV – Televize ve výloze"
        subtitle="Archiv i aktuální přehled speciálů z Divadeliéru."
        buttonText="Přejít na speciály"
        onButtonClick={() => {
          const el = document.getElementById("specialsSection");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />

      <Section border={true}>
        <p className="text-gray-700">
          Televize ve výloze Vás každý týden informuje o událostech v
          Divadeliéru v Novinkách z výlohy a ve Speciálu z Divadeliéru se můžete
          podívat na rozhovory s úžasnými hosty, kteří Divadeliér navštívili, či
          v něm vystupovali.
        </p>
      </Section>

      <Section border={true} id="specialsSection">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Speciály z Divadeliéru</h2>

          {user && (
            <button
              onClick={openCreate}
              className="flex items-center gap-2 bg-[#f5a623] text-white px-4 py-2 rounded-full font-semibold shadow hover:shadow-md hover:scale-105 transition"
            >
              <Plus size={18} />
              Přidat speciál
            </button>
          )}
        </div>

        {user && showForm && (
          <SpecialForm
            isEdit={isEdit}
            draft={draft}
            setDraft={setDraft}
            creating={creating}
            onClose={close}
            onSubmit={onSave}
          />
        )}

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#f5a623] border-solid" />
          </div>
        ) : (
          <>
            <ListToolbar
              query={controls.query}
              setQuery={controls.setQuery}
              totalCount={controls.totalCount}
              filteredCount={controls.filteredCount}
            />

            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#f5a623] border-solid" />
              </div>
            ) : (
              <SpecialsList
                specials={controls.items}
                user={user}
                onEdit={openEdit}
                onDelete={onDelete}
              />
            )}

            <Pagination
              page={controls.page}
              pageCount={controls.pageCount}
              onPageChange={controls.setPage}
            />
          </>
        )}
      </Section>
    </div>
  );
};

export default TVVVPage;

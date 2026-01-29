import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Hero from "../components/layout/Hero";
import Section from "../components/layout/Section";
import { Plus } from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import { useFetch } from "../hooks/useFetch";

import ListToolbar from "../components/layout/ListToolbar";
import Pagination from "../components/layout/Pagiantion";
import { useListControls } from "../hooks/useListControls";

import TimelineList from "../components/actions/TimelineList";
import ActionForm from "../components/actions/ActionForm";

import { confirmToast } from "../utils/confirmToast";
import { toastAction } from "../utils/toastAction";
import { apiFetch } from "../utils/api";

export default function ActionsPage() {
  const { user } = useAuth();

  const { data: featured } = useFetch("/api/timeline/featured");
  const { data: timelineData, loading } = useFetch("/api/timeline");

  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    setTimeline(timelineData?.items || []);
  }, [timelineData]);

  const controls = useListControls(timeline, {
    pageSize: 5,
    getSortValue: (x) => x.title,
    searchFields: [(x) => x.title, (x) => x.description],
  });

  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();
  const [actionFormOpen, setActionFormOpen] = useState(false);
  const [editingAction, setEditingAction] = useState(null);

  const refreshTimeline = async () => {
    const fresh = await apiFetch("/api/timeline");
    setTimeline(fresh.items || []);
  };

  const handleDeleteAction = async (id) => {
    const ok = await confirmToast({
      message: "Opravdu chcete smazat tuto akci?",
      description: "Tuto akci nelze vrátit zpět.",
      confirmText: "Smazat",
      danger: true,
    });
    if (!ok) return;

    await toastAction(
      () => apiFetch(`/api/actions/${id}`, { method: "DELETE" }),
      {
        loading: "Mažu akci...",
        success: "Akce smazána.",
        error: "Nepodařilo se smazat akci.",
      },
    );

    await refreshTimeline();
  };

  const openEditAction = (item) => {
    setEditingAction(item);
    setActionFormOpen(true);
  };

  const openCreateAction = () => {
    setEditingAction(null);
    setActionFormOpen(true);
  };

  const onSavedAction = async (saved) => {
    setTimeline((prev) => {
      const next = Array.isArray(prev) ? [...prev] : [];
      const idx = next.findIndex(
        (x) => x.kind === "action" && x._id === saved._id,
      );

      const normalized = { ...saved, kind: "action" };

      if (idx >= 0) next[idx] = normalized;
      else next.unshift(normalized);

      return next;
    });

    await refreshTimeline();
  };

  return (
    <>
      <Hero
        title={featured?.title || "Akce Divadeliéru"}
        subtitle="Výstavy i akce na jednom místě"
        description={featured?.description || ""}
        buttonText="Výstavy ve výloze"
        onButtonClick={() => navigate("/vvv#fullExhibitionPlan")}
      />

      <Section border={true}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Timeline akcí</h2>

          {user && (
            <button
              onClick={openCreateAction}
              className="flex items-center gap-2 bg-[#f5a623] text-white px-4 py-2 rounded-full shadow hover:scale-105 transition"
            >
              <Plus size={18} />
              Přidat akci
            </button>
          )}
        </div>

        {user && actionFormOpen && (
          <ActionForm
            initial={editingAction}
            onClose={() => setActionFormOpen(false)}
            onSaved={onSavedAction}
          />
        )}

        {!loading && (
          <>
            <ListToolbar
              query={controls.query}
              setQuery={controls.setQuery}
              totalCount={controls.totalCount}
              filteredCount={controls.filteredCount}
            />

            <TimelineList
              items={controls.items}
              user={user}
              onEditAction={(item) => openEditAction(item)}
              onDeleteAction={(id) => handleDeleteAction(id)}
              onEditExhibition={() => navigate("/vvv#fullExhibitionPlan")}
              onDeleteExhibition={() => navigate("/vvv#fullExhibitionPlan")}
            />

            <Pagination
              page={controls.page}
              pageCount={controls.pageCount}
              onPageChange={controls.setPage}
            />
          </>
        )}
      </Section>
    </>
  );
}

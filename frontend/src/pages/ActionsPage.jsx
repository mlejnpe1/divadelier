import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import Hero from "../components/layout/Hero";
import Section from "../components/layout/Section";
import { PartyPopper, Plus } from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import { useFetch } from "../hooks/useFetch";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

import ListToolbar from "../components/layout/ListToolbar";
import Pagination from "../components/layout/Pagiantion";
import TimelineList from "../components/actions/TimelineList";
import ActionForm from "../components/actions/ActionForm";

import { confirmToast } from "../utils/confirmToast";
import { toastAction } from "../utils/toastAction";
import { apiFetch } from "../utils/api";

export default function ActionsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [featured, setFeatured] = useState(null);
  const [timeline, setTimeline] = useState([]);

  const [actionFormOpen, setActionFormOpen] = useState(false);
  const [editingAction, setEditingAction] = useState(null);

  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);

  const limit = 8;
  const type = "all";

  const timelineUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    params.set("type", type);

    if (debouncedQuery.trim()) {
      params.set("q", debouncedQuery.trim());
    }

    return `/api/timeline?${params.toString()}`;
  }, [page, debouncedQuery, limit, type]);

  const { data: timelineData, loading } = useFetch(timelineUrl);

  const refreshFeatured = async () => {
    const fresh = await apiFetch("/api/timeline/featured");
    setFeatured(fresh || null);
  };

  useEffect(() => {
    setTimeline(timelineData?.items || []);
  }, [timelineData]);

  useEffect(() => {
    refreshFeatured();
  }, []);

  const buildTimelineUrl = () => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    params.set("type", type);

    if (query.trim()) {
      params.set("q", query.trim());
    }

    return `/api/timeline?${params.toString()}`;
  };

  const refreshTimeline = async () => {
    const fresh = await apiFetch(buildTimelineUrl());
    setTimeline(fresh.items || []);
  };

  const refreshAll = async () => {
    await Promise.all([refreshTimeline(), refreshFeatured()]);
  };

  const handleDeleteAction = async (id) => {
    const ok = await confirmToast({
      message: "Opravdu chcete smazat tuto akci?",
      description: "Tuto akci nelze vrátit zpět.",
      confirmText: "Smazat",
      danger: true,
    });

    if (!ok) {
      return;
    }

    await toastAction(
      () => apiFetch(`/api/actions/${id}`, { method: "DELETE" }),
      {
        loading: "Mažu akci...",
        success: "Akce smazána.",
        error: "Nepodařilo se smazat akci.",
      },
    );

    await refreshAll();
  };

  const openEditAction = (item) => {
    setEditingAction(item);
    setActionFormOpen(true);
  };

  const openCreateAction = () => {
    setEditingAction(null);
    setActionFormOpen(true);
  };

  const onSavedAction = async () => {
    await refreshAll();
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
          <div className="flex gap-3 items-center">
            <PartyPopper color="#f5a623" size={32} />
            <h2 className="text-3xl font-bold">Na jaké akce se můžete těšit</h2>
          </div>
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

        <ListToolbar
          query={query}
          setQuery={(v) => {
            setPage(1);
            setQuery(v);
          }}
        />

        <div className="relative">
          {loading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-start justify-end p-2 z-10">
              <span className="text-sm text-gray-500">Načítám…</span>
            </div>
          )}

          <TimelineList
            items={timeline}
            user={user}
            onEditAction={(item) => openEditAction(item)}
            onDeleteAction={(id) => handleDeleteAction(id)}
            onEditExhibition={() => navigate("/vvv#fullExhibitionPlan")}
            onDeleteExhibition={() => navigate("/vvv#fullExhibitionPlan")}
          />
        </div>

        <Pagination
          page={timelineData?.page ?? page}
          pageCount={timelineData?.pageCount ?? 1}
          onPageChange={(p) => setPage(p)}
        />
      </Section>
    </>
  );
}

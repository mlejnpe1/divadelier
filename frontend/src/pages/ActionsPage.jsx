import React, { useEffect, useMemo, useState } from "react";
import { PartyPopper, Plus } from "lucide-react";
import Hero from "../components/layout/Hero";
import Section from "../components/layout/Section";
import Button from "../components/layout/Button";
import ListToolbar from "../components/layout/ListToolbar";
import Pagination from "../components/layout/Pagiantion";
import TimelineList from "../components/actions/TimelineList";
import ActionFormModal from "../components/actions/ActionFormModal.jsx";
import ScrollHint from "../components/layout/ScrollHint";
import { useAuth } from "../hooks/useAuth";
import { useFetch } from "../hooks/useFetch";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { confirmToast } from "../utils/confirmToast";
import { toastAction } from "../utils/toastAction";
import { apiFetch } from "../utils/api";

export default function ActionsPage() {
  const { user } = useAuth();
  const now = new Date(Date.now());
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const [featured, setFeatured] = useState(null);
  const [actionFormOpen, setActionFormOpen] = useState(false);
  const [editingAction, setEditingAction] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [listRefresh, setListRefresh] = useState(0);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);

  const timelineUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.set("r", String(listRefresh));
    if (selectedMonth) {
      params.set("month", String(selectedMonth));
    }

    if (debouncedQuery.trim()) {
      params.set("q", debouncedQuery.trim());
    }

    return `/api/actions?${params.toString()}`;
  }, [selectedMonth, debouncedQuery, listRefresh]);

  const { data: timelineData, loading } = useFetch(timelineUrl);

  const refreshFeatured = async () => {
    try {
      const fresh = await apiFetch("/api/actions/featured");
      setFeatured(fresh || null);
    } catch (error) {
      if (String(error?.message || "").includes("404")) {
        setFeatured(null);
        return;
      }

      console.error(error);
    }
  };

  useEffect(() => {
    refreshFeatured();
  }, []);

  useEffect(() => {
    if (
      !loading &&
      selectedMonth !== null &&
      Array.isArray(timelineData?.months) &&
      !timelineData.months.includes(selectedMonth)
    ) {
      setSelectedMonth(timelineData?.month ?? null);
    }
  }, [loading, selectedMonth, timelineData?.month, timelineData?.months]);

  const monthItems = useMemo(() => {
    if (!Array.isArray(timelineData?.months)) {
      return [];
    }

    return timelineData.months.map((month) => ({
      value: month,
      label: new Date(`${month}-01T00:00:00`).toLocaleDateString("cs-CZ", {
        month: "long",
      }),
    }));
  }, [timelineData?.months]);

  const activeMonth = selectedMonth ?? timelineData?.month ?? null;

  const refreshAll = async () => {
    setListRefresh((value) => value + 1);
    await refreshFeatured();
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
        title={featured?.title || "Akce Divadelieru"}
        subtitle="Přehled chystaných akcí"
        description={featured?.description || ""}
      />
      <div className="relative">
        <ScrollHint variant="overlay" color="light" />
      </div>
      <Section border={true}>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PartyPopper color="#f5a623" size={32} />
            <h2 className="text-3xl font-bold">Na jaké akce se můžete těšit</h2>
          </div>
          {user && (
            <Button onClick={openCreateAction}>
              <Plus size={18} />
              Přidat akci
            </Button>
          )}
        </div>

        {user && (
          <ActionFormModal
            isOpen={actionFormOpen}
            isEdit={Boolean(editingAction?._id)}
            initial={editingAction}
            onClose={() => setActionFormOpen(false)}
            onSaved={onSavedAction}
            modalKey={editingAction?._id || "new-action"}
          />
        )}

        <ListToolbar
          query={query}
          setQuery={(v) => {
            setSelectedMonth(currentMonth);
            setQuery(v);
          }}
        />

        <TimelineList
          items={timelineData?.items || []}
          loading={loading}
          user={user}
          onEditAction={(item) => openEditAction(item)}
          onDeleteAction={(id) => handleDeleteAction(id)}
        />

        <Pagination
          page={activeMonth}
          pageCount={monthItems.length}
          items={monthItems}
          itemTypeLabel="měsíc"
          onPageChange={(month) => setSelectedMonth(month)}
        />
      </Section>
    </>
  );
}

import React, { useEffect, useMemo, useState } from "react";
import { Archive, PartyPopper, Plus } from "lucide-react";
import Hero from "../components/layout/Hero";
import Section from "../components/layout/Section";
import Button from "../components/layout/Button";
import ListToolbar from "../components/layout/ListToolbar";
import Pagination from "../components/layout/Pagiantion";
import TimelineList from "../components/actions/TimelineList";
import ActionArchiveList from "../components/actions/ActionArchiveList.jsx";
import ActionFormModal from "../components/actions/ActionFormModal.jsx";
import ScrollHint from "../components/layout/ScrollHint";
import { useAuth } from "../hooks/useAuth";
import { useFetch } from "../hooks/useFetch";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { confirmToast } from "../utils/confirmToast";
import { toastAction } from "../utils/toastAction";
import { apiFetch } from "../utils/api";

function pluralizeActionCount(count) {
  if (count === 1) {
    return "akci";
  }

  if (count >= 2 && count <= 4) {
    return "akce";
  }

  return "akcí";
}

function pluralizeActionSubject(count) {
  if (count === 1) {
    return "akce";
  }

  if (count >= 2 && count <= 4) {
    return "akce";
  }

  return "akcí";
}

function formatArchiveResult(result) {
  const archivedCount = Number(result?.archivedCount || 0);
  const failedCount = Number(result?.failedCount || 0);

  if (archivedCount === 0 && failedCount === 0) {
    return "Nebyly nalezeny žádné akce k archivaci.";
  }

  if (failedCount === 0) {
    return `Archivováno ${archivedCount} ${pluralizeActionCount(archivedCount)}.`;
  }

  if (archivedCount === 0) {
    return `Archivace selhala u ${failedCount} ${pluralizeActionCount(failedCount)}.`;
  }

  return `Archivováno ${archivedCount} ${pluralizeActionCount(archivedCount)}, u ${failedCount} ${pluralizeActionCount(failedCount)} selhala.`;
}

export default function ActionsPage() {
  const { user } = useAuth();
  const now = new Date(Date.now());
  const currentYear = now.getFullYear();
  const currentMonth = `${currentYear}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const [featured, setFeatured] = useState(null);
  const [actionFormOpen, setActionFormOpen] = useState(false);
  const [editingAction, setEditingAction] = useState(null);
  const [viewMode, setViewMode] = useState("current");
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedArchiveYear, setSelectedArchiveYear] = useState(null);
  const [listRefresh, setListRefresh] = useState(0);
  const [query, setQuery] = useState("");
  const [lastArchiveResult, setLastArchiveResult] = useState(null);
  const debouncedQuery = useDebouncedValue(query, 300);

  const timelineUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.set("r", String(listRefresh));
    params.set("view", viewMode);

    if (viewMode === "current" && selectedMonth) {
      params.set("month", String(selectedMonth));
    }
    if (viewMode === "archive" && selectedArchiveYear) {
      params.set("year", String(selectedArchiveYear));
    }

    if (debouncedQuery.trim()) {
      params.set("q", debouncedQuery.trim());
    }

    return `/api/actions?${params.toString()}`;
  }, [debouncedQuery, listRefresh, selectedArchiveYear, selectedMonth, viewMode]);

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
      viewMode === "current" &&
      !loading &&
      selectedMonth !== null &&
      Array.isArray(timelineData?.months) &&
      !timelineData.months.includes(selectedMonth)
    ) {
      setSelectedMonth(timelineData?.month ?? null);
    }
  }, [loading, selectedMonth, timelineData?.month, timelineData?.months, viewMode]);

  useEffect(() => {
    if (
      viewMode === "archive" &&
      !loading &&
      selectedArchiveYear !== null &&
      Array.isArray(timelineData?.years) &&
      !timelineData.years.includes(selectedArchiveYear)
    ) {
      setSelectedArchiveYear(timelineData?.year ?? null);
    }
  }, [loading, selectedArchiveYear, timelineData?.year, timelineData?.years, viewMode]);

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

  const archiveYearItems = useMemo(() => {
    if (!Array.isArray(timelineData?.years)) {
      return [];
    }

    return timelineData.years.map((year) => ({
      value: year,
      label: String(year),
    }));
  }, [timelineData?.years]);

  const activeMonth = selectedMonth ?? timelineData?.month ?? null;
  const activeArchiveYear = selectedArchiveYear ?? timelineData?.year ?? null;
  const pendingArchiveCount = Number(timelineData?.pendingArchiveCount || 0);
  const pendingArchiveYears = Array.isArray(timelineData?.pendingArchiveYears)
    ? timelineData.pendingArchiveYears
    : [];
  const failedArchiveItems = Array.isArray(lastArchiveResult?.failedItems)
    ? lastArchiveResult.failedItems
    : [];

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

  const handleArchiveOldActions = async () => {
    const ok = await confirmToast({
      message: "Archivovat starší akce?",
      description:
        "Akce z minulých let se označí jako archivní a smažou se jejich fotky z R2 úložiště.",
      confirmText: "Archivovat",
    });

    if (!ok) {
      return;
    }

    setLastArchiveResult(null);

    const result = await toastAction(
      () => apiFetch("/api/actions/archive-old", { method: "POST" }),
      {
        loading: "Archivuji starší akce...",
        success: (result) => formatArchiveResult(result),
        error: "Archivaci starších akcí se nepodařilo dokončit.",
      },
    );

    setLastArchiveResult(result);
    setViewMode("archive");
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
        title={
          viewMode === "archive"
            ? "Archiv akcí"
            : featured?.title || "Akce Divadelieru"
        }
        subtitle={
          viewMode === "archive"
            ? "Přehled akcí z minulých let"
            : "Přehled chystaných akcí"
        }
        description={
          viewMode === "archive"
            ? "Jednoduchý archiv akcí za předchozí roky, řazený po jednotlivých ročnících."
            : featured?.description || ""
        }
      />
      <div className="relative">
        <ScrollHint variant="overlay" color="light" />
      </div>
      <Section border={true}>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {viewMode === "archive" ? (
              <Archive color="#8c6a43" size={32} />
            ) : (
              <PartyPopper color="#f5a623" size={32} />
            )}
            <h2 className="text-3xl font-bold">
              {viewMode === "archive"
                ? "Archiv akcí"
                : "Na jaké akce se můžete těšit"}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <Button onClick={openCreateAction}>
                <Plus size={18} />
                Přidat akci
              </Button>
            )}
          </div>
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

        <div className="mb-6 flex justify-center">
          <div className="inline-flex rounded-full border border-white/50 bg-white/55 p-1 shadow-[0_16px_34px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <button
              type="button"
              onClick={() => setViewMode("current")}
              className={
                "rounded-full px-4 py-2 text-sm font-semibold transition " +
                (viewMode === "current"
                  ? "bg-[#f5a623] text-white shadow-[0_12px_26px_rgba(245,166,35,0.24)]"
                  : "text-[#6d573d] hover:bg-white/65")
              }
            >
              Aktuální akce
            </button>
            <button
              type="button"
              onClick={() => setViewMode("archive")}
              className={
                "rounded-full px-4 py-2 text-sm font-semibold transition " +
                (viewMode === "archive"
                  ? "bg-[#8c6a43] text-white shadow-[0_12px_26px_rgba(92,66,38,0.2)]"
                  : "text-[#6d573d] hover:bg-white/65")
              }
            >
              Archiv
            </button>
          </div>
        </div>

        {user?.admin && pendingArchiveCount > 0 ? (
          <div className="mb-6 overflow-hidden rounded-[1.6rem] border border-[#f5a623]/30 bg-[linear-gradient(145deg,rgba(255,248,236,0.92),rgba(255,234,196,0.62))] p-5 shadow-[0_18px_44px_rgba(95,47,0,0.1)] backdrop-blur-xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9a590b]">
                  Archivace čeká
                </p>
                <p className="mt-2 text-lg font-semibold text-gray-900">
                  Je potřeba archivovat {pendingArchiveCount}{" "}
                  {pendingArchiveCount === 1
                    ? "akci"
                    : pendingArchiveCount >= 2 && pendingArchiveCount <= 4
                      ? "akce"
                      : "akcí"}
                  {pendingArchiveYears.length
                    ? ` z let ${pendingArchiveYears.join(", ")}`
                    : "."}
                </p>
                <p className="mt-2 text-sm leading-7 text-[#6b5237]">
                  Archivace smaže cover i fotku autora z R2 a přesune starší
                  akce do jednoduchého archivu.
                </p>
              </div>

              <div className="flex-shrink-0">
                <Button variant="secondary" onClick={handleArchiveOldActions}>
                  Archivovat teď
                </Button>
              </div>
            </div>
          </div>
        ) : null}

        {user?.admin && viewMode === "archive" && failedArchiveItems.length > 0 ? (
          <div className="mb-6 overflow-hidden rounded-[1.6rem] border border-[#b85c38]/25 bg-[linear-gradient(145deg,rgba(255,245,240,0.95),rgba(255,232,223,0.78))] p-5 shadow-[0_18px_44px_rgba(122,52,19,0.09)] backdrop-blur-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#a64924]">
              Některé akce nešly archivovat
            </p>
            <p className="mt-2 text-base font-semibold text-gray-900">
              U {failedArchiveItems.length} {pluralizeActionSubject(failedArchiveItems.length)} se nepodařilo dokončit mazání fotek z R2.
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-7 text-[#6b4032]">
              {failedArchiveItems.map((item) => (
                <li key={item._id}>
                  {item.title || "Akce bez názvu"}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <ListToolbar
          query={query}
          setQuery={(v) => {
            if (viewMode === "current") {
              setSelectedMonth(currentMonth);
            }
            if (viewMode === "archive") {
              setSelectedArchiveYear(null);
            }
            setQuery(v);
          }}
        />

        {viewMode === "archive" ? (
          <>
            <ActionArchiveList
              items={timelineData?.items || []}
              loading={loading}
              user={user}
              activeYear={activeArchiveYear}
              total={timelineData?.total || 0}
              onDeleteAction={(id) => handleDeleteAction(id)}
            />

            <Pagination
              page={activeArchiveYear}
              pageCount={archiveYearItems.length}
              items={archiveYearItems}
              itemTypeLabel="rok"
              onPageChange={(year) => setSelectedArchiveYear(year)}
            />
          </>
        ) : (
          <>
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
          </>
        )}
      </Section>
    </>
  );
}

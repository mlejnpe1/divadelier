import React from "react";
import { CalendarDays, Images } from "lucide-react";
import {
  DeleteActionButton,
  EditActionButton,
} from "../layout/ActionIconButton";

export default function MeetingCard({
  meeting,
  user,
  onEdit,
  onDelete,
  onSelect,
  visual,
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect?.();
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit?.();
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      className="group relative min-h-[22rem] cursor-pointer overflow-hidden rounded-[2rem] border border-[#ffd799]/18 text-left shadow-[0_22px_60px_rgba(70,30,0,0.18)] transition duration-500 hover:border-[#ffd799]/34"
    >
      {visual?.cover && (
        <img
          src={visual.cover}
          alt={`Fotografie skupiny ${meeting.title}`}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#220b01]/94 via-[#a45108]/54 to-[#f9d08d]/18" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(245,166,35,0.32),rgba(120,42,0,0.18)_45%,rgba(32,10,2,0.68))]" />
      <div className="absolute -left-10 top-10 h-32 w-32 rounded-full bg-[#f5a623]/36 blur-3xl transition duration-700 group-hover:scale-110" />
      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#ffcf80]/22 blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#3f1500]/80 to-transparent" />

      <div className="relative flex h-full items-end p-5 md:p-6">
        <div className="w-full rounded-[1.7rem] border border-[#ffe1b0]/26 bg-[rgba(245,166,35,0.24)] p-5 text-white shadow-[inset_0_1px_0_rgba(255,244,223,0.28),0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-xl transition duration-500 group-hover:bg-[rgba(245,166,35,0.3)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[#fff0d6]">
                Dr. ZDIV
              </p>
              <h3 className="mt-2 text-xl font-bold md:text-2xl">
                {meeting.title}
              </h3>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full border border-[#ffe1b0]/24 bg-[rgba(255,214,145,0.16)] px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#fff5e8]">
              <Images size={14} />
              Galerie
            </span>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-[#fff7ec] md:text-base">
            {meeting.information}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#ffe1b0]/24 bg-[rgba(255,214,145,0.16)] px-3 py-2 text-xs font-medium text-[#fff8ef]">
              <CalendarDays size={14} />
              Kdy se scházíme: {meeting.day_in_week}
            </p>

            {user && (
              <div className="flex items-center gap-2">
                <EditActionButton
                  label={`Upravit schůzku ${meeting.title}`}
                  onClick={handleEdit}
                  tone="dark"
                />
                <DeleteActionButton
                  label={`Smazat schůzku ${meeting.title}`}
                  onClick={handleDelete}
                  tone="dark"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

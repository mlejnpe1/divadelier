import React from "react";
import { fieldClass, sectionClass } from "./exhibitionFormStyles.js";

export default function ExhibitionBasicFields({ draft, setDraft }) {
  return (
    <section className={sectionClass}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-gray-800">
            Název výstavy
          </span>
          <input
            value={draft.title}
            onChange={(event) =>
              setDraft((prev) => ({ ...prev, title: event.target.value }))
            }
            placeholder="Název výstavy"
            className={fieldClass}
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-gray-800">Datum *</span>
          <input
            required
            type="date"
            value={draft.date}
            onChange={(event) =>
              setDraft((prev) => ({ ...prev, date: event.target.value }))
            }
            className={fieldClass}
          />
        </label>
      </div>

      <label className="mt-4 block space-y-2">
        <span className="text-sm font-semibold text-gray-800">O výstavě</span>
        <textarea
          value={draft.information}
          onChange={(event) =>
            setDraft((prev) => ({
              ...prev,
              information: event.target.value,
            }))
          }
          rows={4}
          placeholder="Stručný popis výstavy"
          className={`${fieldClass} min-h-[132px] resize-y`}
        />
      </label>
    </section>
  );
}

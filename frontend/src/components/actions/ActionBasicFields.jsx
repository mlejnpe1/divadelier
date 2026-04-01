import React from "react";
import { fieldClass, sectionClass } from "./actionFormStyles.js";

export default function ActionBasicFields({ draft, setDraft }) {
  return (
    <section className={sectionClass}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-gray-800">
            Název akce *
          </span>
          <input
            required
            value={draft.title}
            onChange={(event) =>
              setDraft((prev) => ({ ...prev, title: event.target.value }))
            }
            placeholder="Název akce"
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
        <span className="text-sm font-semibold text-gray-800">O akci</span>
        <textarea
          value={draft.description}
          onChange={(event) =>
            setDraft((prev) => ({
              ...prev,
              description: event.target.value,
            }))
          }
          rows={4}
          placeholder="Stručný popis akce"
          className={`${fieldClass} min-h-[132px] resize-y`}
        />
      </label>
    </section>
  );
}

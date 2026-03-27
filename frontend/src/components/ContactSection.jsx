import React, { useState } from "react";
import { Megaphone } from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch } from "../utils/api";
import Button from "./layout/Button";

export default function ContactSection({
  icon = <Megaphone className="mr-3 h-8 w-8 text-[#f5a623]" />,
  title = "Máte zájem vystavovat?",
  subtitle = "Neváhejte se nám ozvat, rádi s vámi probereme možnosti a termíny.",
  note = "Odpovíme co nejdříve (obvykle do 1–2 pracovních dnů).",
  endpoint = "/api/contact",
  page = "VVV",
  className = "",
}) {
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formEl = e.currentTarget;
    const form = new FormData(formEl);

    const payload = {
      name: String(form.get("name") || "").trim(),
      email: String(form.get("email") || "").trim(),
      message: String(form.get("message") || "").trim(),
      company: String(form.get("company") || "").trim(),
      page,
    };

    if (!payload.name || !payload.email || !payload.message) {
      toast.error("Vyplňte prosím jméno, e-mail a zprávu.");
      return;
    }

    setSending(true);
    try {
      await apiFetch(endpoint, { method: "POST", body: payload });
      toast.success("Děkujeme! Zpráva byla odeslána.");
      formEl.reset();
    } catch (err) {
      console.error("contact submit failed:", err);
      toast.error(err?.message || "Nepodařilo se odeslat zprávu.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={className}>
      <div className="mb-8 flex items-center">
        {icon}
        <div>
          <h2 className="text-3xl font-bold">{title}</h2>
          {subtitle ? <p className="mt-1 text-gray-600">{subtitle}</p> : null}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
        {note ? (
          <div className="border-b bg-gray-50 p-6">
            <p className="text-sm text-gray-600">{note}</p>
          </div>
        ) : null}

        <form className="flex flex-col gap-4 p-6" onSubmit={handleSubmit}>
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              name="name"
              type="text"
              placeholder="Vaše jméno"
              required
              className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5a623]"
            />
            <input
              name="email"
              type="email"
              placeholder="Váš e-mail"
              required
              className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5a623]"
            />
          </div>

          <textarea
            name="message"
            placeholder="Vaše zpráva"
            rows={5}
            required
            className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5a623]"
          />

          <div className="flex items-center justify-end pt-2">
            <Button
              type="submit"
              disabled={sending}
              className="disabled:hover:translate-y-0 disabled:hover:scale-100"
            >
              {sending ? "Odesílám..." : "Odeslat zprávu"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

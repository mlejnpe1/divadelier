import React, { useState } from "react";
import { Megaphone } from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch } from "../utils/api";

export default function ContactSection({
  icon = <Megaphone className="w-8 h-8 text-[#f5a623] mr-3" />,
  title = "Máte zájem vystavovat?",
  subtitle = "Neváhejte se nám ozvat — rádi s vámi probereme možnosti a termíny.",
  note = "Odpovíme co nejdříve (obvykle do 1–2 pracovních dnů).",
  endpoint = "/api/contact",
  page = "VVV",
  className = "",
}) {
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formEl = e.currentTarget; // ✅ uložit hned
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
      const res = await apiFetch(endpoint, { method: "POST", body: payload });

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
      <div className="flex items-center mb-8">
        {icon}
        <div>
          <h2 className="text-3xl font-bold">{title}</h2>
          {subtitle ? <p className="text-gray-600 mt-1">{subtitle}</p> : null}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {note ? (
          <div className="p-6 border-b bg-gray-50">
            <p className="text-sm text-gray-600">{note}</p>
          </div>
        ) : null}

        <form className="p-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* honeypot */}
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              type="text"
              placeholder="Vaše jméno"
              required
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5a623]"
            />
            <input
              name="email"
              type="email"
              placeholder="Váš e-mail"
              required
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5a623]"
            />
          </div>

          <textarea
            name="message"
            placeholder="Vaše zpráva"
            rows={5}
            required
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5a623]"
          />

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={sending}
              className="bg-[#f5a623] text-white px-6 py-2 rounded-full font-semibold shadow hover:shadow-md hover:scale-105 transform transition duration-300 disabled:opacity-60 disabled:hover:scale-100"
            >
              {sending ? "Odesílám…" : "Odeslat zprávu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

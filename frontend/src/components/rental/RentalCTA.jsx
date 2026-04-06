import { useState } from "react";
import { Mail, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch } from "../../utils/api";
import InquiryModal from "../InquiryModal";
import Button from "../layout/Button";

export default function RentCTA() {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (payload) => {
    await apiFetch("/api/inquiries", {
      method: "POST",
      body: {
        ...payload,
        subject: "Poptávka – Pronájem prostoru",
        source: "rental",
      },
    });

    toast.success("Děkujeme! Poptávka odeslána.");
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-[2rem] border border-[#ead3af]/75 bg-[linear-gradient(145deg,rgba(255,249,239,0.96),rgba(255,231,187,0.78))] p-8 text-center shadow-[0_28px_70px_rgba(94,55,8,0.1)] backdrop-blur-xl">
        <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/35 blur-3xl" />
        <div className="pointer-events-none absolute -left-8 bottom-0 h-24 w-24 rounded-full bg-[#f5a623]/18 blur-3xl" />

        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/58 px-4 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#9a590b] shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
            <Sparkles size={14} className="text-[#f5a623]" />
            Pronájem
          </div>

          <h3 className="text-2xl font-bold text-[#3f250f]">
            Máte zájem o pronájem prostoru Divadelieru?
          </h3>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#5f4a35] sm:text-base">
            Napište nám nezávazně, rádi s vámi projdeme možnosti využití
            prostoru a domluvíme se na vhodné podobě pronájmu.
          </p>

          <div className="mt-6 flex flex-col items-center gap-3">
            <Button onClick={() => setOpen(true)}>
              <Mail size={18} />
              Nezávazně poptat pronájem
            </Button>

            <p className="text-sm text-[#6a4a20]">
              nebo zavolejte na&nbsp;
              <a
                href="tel:+420777076901"
                className="font-semibold text-[#3f250f] hover:underline"
              >
                +420&nbsp;777&nbsp;076&nbsp;901
              </a>
            </p>
          </div>
        </div>
      </div>

      <InquiryModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        title="Poptávka pronájmu"
        subtitle="Rádi s vámi projdeme možnosti využití prostoru."
        contextLabel="Typ poptávky"
        contextValue="Pronájem prostoru Divadelieru"
        contextType="rental"
      />
    </>
  );
}

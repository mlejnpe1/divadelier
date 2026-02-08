import { useState } from "react";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch } from "../../utils/api";
import InquiryModal from "../InquiryModal";

export default function RentCTA() {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (payload) => {
    await apiFetch("/api/inquiries", {
      method: "POST",
      body: {
        ...payload,
        subject: `Poptávka – Pronájem prostoru`,
        source: "rental",
      },
    });

    toast.success("Děkujeme! Poptávka odeslána.");
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center space-y-4">
      <h3 className="text-2xl font-bold text-gray-900">
        Máte zájem o pronájem prostoru Divadeliéru?
      </h3>

      <p className="text-gray-700">
        Napište nám nezávazně – rádi s vámi projdeme možnosti využití prostoru.
      </p>

      <div className="flex flex-col items-center gap-2 mt-4">
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#f5a623] text-white font-semibold shadow hover:shadow-md hover:scale-[1.02] transition"
        >
          <Mail size={18} />
          Nezávazně poptat pronájem
        </button>

        <p className="text-sm text-gray-600">
          nebo zavolejte na&nbsp;
          <a
            href="tel:+420777076901"
            className="font-semibold text-gray-900 hover:underline"
          >
            +420&nbsp;777&nbsp;076&nbsp;901
          </a>
        </p>
      </div>

      <InquiryModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        title="Poptávka pronájmu"
        subtitle="Rádi s vámi projdeme možnosti využití prostoru."
        contextLabel="Typ poptávky"
        contextValue="Pronájem prostoru Divadeliéru"
        contextType="rental"
      />
    </div>
  );
}

import { useState } from "react";
import { Mail } from "lucide-react";
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
    <div className="space-y-4 rounded-2xl bg-white p-8 text-center shadow-lg">
      <h3 className="text-2xl font-bold text-gray-900">
        Máte zájem o pronájem prostoru Divadelieru?
      </h3>

      <p className="text-gray-700">
        Napište nám nezávazně, rádi s vámi projdeme možnosti využití prostoru.
      </p>

      <div className="mt-4 flex flex-col items-center gap-2">
        <Button onClick={() => setOpen(true)}>
          <Mail size={18} />
          Nezávazně poptat pronájem
        </Button>

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
        contextValue="Pronájem prostoru Divadelieru"
        contextType="rental"
      />
    </div>
  );
}

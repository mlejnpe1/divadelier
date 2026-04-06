import ScrollHint from "../layout/ScrollHint.jsx";
import { Lightbulb, Sofa } from "lucide-react";

export default function RentalPracticalInfoSection() {
  return (
    <>
      <div className="relative">
        <ScrollHint variant="overlay" target="practicalInfo" />
      </div>

      <div className="mb-8 space-y-3">
        <div className="flex items-center gap-3">
          <Lightbulb className="h-7 w-7 text-[#f5a623]" />
          <h2 className="text-3xl font-bold uppercase tracking-[0.12em] text-[#9a590b]">
            Praktické informace
          </h2>
        </div>
        <p className="max-w-3xl text-sm leading-7 text-[#5f4a35] sm:text-base">
          Základní přehled o kapacitě, technickém zázemí a vybavení prostoru pro
          zkoušky, kurzy i komorní akce.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-[1.9rem] border border-[#ead3af]/75 bg-[linear-gradient(145deg,rgba(255,249,239,0.96),rgba(255,231,187,0.78))] p-6 shadow-[0_24px_58px_rgba(94,55,8,0.08)] backdrop-blur-xl">
          <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/35 blur-3xl" />
          <div className="pointer-events-none absolute -left-8 bottom-0 h-20 w-20 rounded-full bg-[#f5a623]/16 blur-3xl" />

          <div className="relative">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/58 px-4 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#9a590b] shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
              <Sofa size={14} className="text-[#f5a623]" />
              Prostor
            </div>

            <h3 className="text-lg font-semibold text-[#3f250f]">Prostor</h3>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-[#5f4a35] sm:text-base">
              <li>• Kapacita: 30 diváků + 15 kurzistů v akci</li>
              <li>
                • Vhodné pro: představení komorních divadel bytového typu,
                představení pro děti, přednášky, workshopy, autorská čtení,
                jednodenní výstavy…
              </li>
              <li>
                • Denní světlo / zatemnění: zářivky, žárovky, k dispozici dva
                divadelní reflektory, možnost zatemnit závěsy
              </li>
            </ul>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[1.9rem] border border-[#ead3af]/75 bg-[linear-gradient(145deg,rgba(255,249,239,0.96),rgba(255,231,187,0.78))] p-6 shadow-[0_24px_58px_rgba(94,55,8,0.08)] backdrop-blur-xl">
          <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/35 blur-3xl" />
          <div className="pointer-events-none absolute -left-8 bottom-0 h-20 w-20 rounded-full bg-[#f5a623]/16 blur-3xl" />

          <div className="relative">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/58 px-4 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#9a590b] shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
              <Lightbulb size={14} className="text-[#f5a623]" />
              Vybavení
            </div>

            <h3 className="text-lg font-semibold text-[#3f250f]">Vybavení</h3>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-[#5f4a35] sm:text-base">
              <li>
                • Židle / stoly: 30 ks, měkké pucánky 10ks, polštáře 10ks, tři
                skládací stoly
              </li>
              <li>• Zvuk: reprobedna, mikrofon bez stojanu</li>
              <li>• Wi-Fi / zázemí: ano, projektor, dva malířské stojany</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

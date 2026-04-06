import { Sparkles } from "lucide-react";

const useCases = [
  {
    title: "Divadelní zkoušky",
    text: "Prostor pro práci s pohybem i hlasem.",
  },
  {
    title: "Kurzy a workshopy",
    text: "Komorní vzdělávání i pravidelné lekce.",
  },
  {
    title: "Besedy a setkání",
    text: "Příjemná atmosféra pro komunitní akce.",
  },
  {
    title: "Focení / natáčení",
    text: "Zajímavé světlo a charakter místa.",
  },
  {
    title: "Kreativní dílny",
    text: "Pro tvoření, příběhy i práci s dětmi.",
  },
  { title: "Komorní akce", text: "Malý formát, velká atmosféra." },
];

export default function RentalUseCasesSection() {
  return (
    <>
      <div className="mb-8 space-y-3">
        <div className="flex items-center gap-3">
          <Sparkles className="h-7 w-7 text-[#f5a623]" />
          <h2 className="text-3xl font-bold uppercase tracking-[0.12em]">
            Na co se prostor hodí
          </h2>
        </div>
        <p className="max-w-3xl text-sm leading-7 text-[#5f4a35] sm:text-base">
          Divadeliér funguje jako komorní a proměnlivý prostor. Hodí se pro
          zkoušení, sdílení, tvorbu i menší veřejná setkání.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {useCases.map((item) => (
          <div
            key={item.title}
            className="group relative overflow-hidden rounded-[1.75rem] border border-[#ebd2ad]/75 bg-[linear-gradient(145deg,rgba(255,249,239,0.92),rgba(255,234,198,0.76))] p-5 shadow-[0_18px_42px_rgba(94,55,8,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_54px_rgba(94,55,8,0.12)]"
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/35 blur-3xl transition duration-300 group-hover:bg-white/45" />
            <div className="pointer-events-none absolute -left-8 bottom-0 h-20 w-20 rounded-full bg-[#f5a623]/18 blur-3xl" />

            <div className="relative">
              <div className="mb-4 inline-flex rounded-full border border-white/60 bg-white/58 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#9a590b] shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                Pronájem
              </div>

              <h3 className="text-lg font-semibold text-[#3f250f]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#5f4a35]">
                {item.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

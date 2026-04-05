import HeroBG1 from "../../assets/images/heroBG1.webp";
import { ScrollText } from "lucide-react";

export default function HistoryAside() {
  return (
    <aside
      className="relative hidden h-screen self-start overflow-hidden md:sticky md:top-0 md:flex md:w-1/3 md:flex-col md:justify-center p-10 shadow-inner lg:w-1/3"
      style={{
        backgroundImage: `url(${HeroBG1})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#5a3900]/65 via-[#8a5a11]/65 to-[#f4efe8]/25" />
      <div className="pointer-events-none absolute right-[-6rem] top-1/2 h-[20rem] w-[20rem] -translate-y-1/2 rounded-full bg-orange-300/20 blur-3xl" />
      <div className="pointer-events-none absolute left-[-4rem] bottom-[-4rem] h-48 w-48 rounded-full bg-amber-200/10 blur-3xl" />

      <div className="relative z-10">
        <div className="overflow-hidden rounded-[2rem] border border-white/18 bg-[linear-gradient(145deg,rgba(255,255,255,0.18),rgba(255,247,237,0.1))] p-6 shadow-[0_25px_70px_rgba(15,23,42,0.22)] backdrop-blur-2xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center text-white">
              <ScrollText size={30} />
            </div>
            <h1 className="text-4xl font-bold text-white">
              Historie Divadeliéru
            </h1>
          </div>
          <p className="leading-relaxed text-white/88">
            Divadeliér vznikl z touhy spojit divadlo, hudbu a vizuální umění v
            jeden celek. Od skromných začátků se stal místem, které dává prostor
            experimentu, autorské tvorbě i komunitnímu dění. Podívejme se
            společně na nejdůležitější milníky naší cesty.
          </p>
        </div>
      </div>
    </aside>
  );
}

import React from "react";
import {
  Bird,
  CalendarDays,
  ChevronRight,
  MapPinned,
  Sparkles,
  Users,
} from "lucide-react";
import Hero from "../components/layout/Hero.jsx";
import Section from "../components/layout/Section.jsx";
import ScrollHint from "../components/layout/ScrollHint.jsx";
import Button from "../components/layout/Button.jsx";
import Gallery from "../components/layout/Gallery.jsx";
import HeroMediaShowcase from "../components/layout/HeroMediaShowcase.jsx";

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

const images = Object.values(
  import.meta.glob("../assets/images/let-andelu/*.{jpg,png,jpeg,webp}", {
    eager: true,
    query: "?url",
    import: "default",
  }),
);

const ORIGINAL_TEXTS = [
  "Originální akce, kdy každý rok 23. 12. v 16.00 od Divadeliéru vyletí andělé a do 17.00 hodin můžete potkat v centru Vysokého Mýta čtyři obří osvětlené loutky andělů, které nesou členové divadelních skupin Divadeliéru v převlecích andělů.",
  "Andělská ulička je strážená jedním z velkých andělů a osvětlená svíčkami a kdo chce, může se k nám v andělském převleku přidat. Andělé tak otevřou Vánoce, neboť právě oni to byli, kdo oznámili Marii, že se jí narodí Ježíšek, a když se narodil, andělů bylo plné nebe a radovali se. Radujme se s nimi. 😊",
];

const EVENT_FACTS = [
  {
    title: "Kdy",
    value: "23. prosince, 16.00 - 17.00",
    note: "Každoroční předvánoční setkání",
    Icon: CalendarDays,
  },
  {
    title: "Kde",
    value: "Od Divadeliéru do centra Vysokého Mýta",
    note: "Průvod a setkávání v ulicích města",
    Icon: MapPinned,
  },
  {
    title: "Co zažijete",
    value: "Andělský průvod, loutky, světla a svíčky",
    note: "Velcí papíroví andělé a andělská ulička",
    Icon: Sparkles,
  },
  {
    title: "Pro koho",
    value: "Pro veřejnost i členy divadelních skupin Divadeliéru",
    note: "V andělském převleku se můžete přidat",
    Icon: Users,
  },
];

const PROGRAM_STEPS = [
  {
    title: "Odlet od Divadeliéru",
    text: "V 16.00 akce začíná u Divadeliéru. Odtud andělé vyrážejí do města a otevírají slavnostní předvánoční hodinu.",
  },
  {
    title: "Průchod městem",
    text: "Centrem Vysokého Mýta procházejí členové divadelních skupin Divadeliéru v kostýmech andělů a nesou čtyři obří osvětlené papírové loutky.",
  },
  {
    title: "Andělská ulička",
    text: "Jedno z klíčových zastavení tvoří andělská ulička se svíčkami, kterou střeží jeden z velkých andělů a která zesiluje poetickou i slavnostní atmosféru celé akce.",
  },
  {
    title: "Otevření Vánoc",
    text: "Let andělů není jen průvod. Je to společný městský rituál, kterým se symbolicky otevírá vánoční čas a radostné setkání lidí v ulicích.",
  },
];

const INVOLVEMENT_POINTS = [
  "kdo chce, může se přidat v andělském převleku",
  "akce je otevřená setkání lidí v ulicích města",
  "výraznou součástí jsou členové divadelních skupin Divadeliéru a jejich kostýmy",
  "fotografie a atmosféra celé hodiny tvoří důležitou paměť akce",
];

function SectionBadge({ children }) {
  return (
    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#9a590b]">
      {children}
    </p>
  );
}

function EventFactCard({ title, value, note, Icon }) {
  return (
    <article className="rounded-[1.75rem] border border-white/45 bg-[linear-gradient(160deg,rgba(255,255,255,0.76),rgba(255,245,226,0.5))] p-5 shadow-[0_18px_38px_rgba(15,23,42,0.06)] backdrop-blur-xl">
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-[rgba(245,166,35,0.14)] text-[#c46f04] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
        <Icon size={18} />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-3 text-base leading-7 text-[#5f4126]">{value}</p>
      <p className="mt-2 text-sm leading-6 text-[#7a664f]">{note}</p>
    </article>
  );
}

function ProgramStep({ index, title, text }) {
  return (
    <article className="relative rounded-[1.85rem] border border-white/45 bg-white/68 p-6 shadow-[0_18px_42px_rgba(15,23,42,0.06)] backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/45 bg-[rgba(245,166,35,0.14)] text-sm font-semibold text-[#9a590b]">
          {index}
        </div>
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="mt-4 text-base leading-8 text-[#5f4a35]">{text}</p>
    </article>
  );
}

export default function LetAndeluPage() {
  return (
    <>
      <Hero
        title="Let andělů"
        subtitle="23. prosince ve Vysokém Mýtě"
        description="Výrazná předvánoční akce Divadeliéru, při které městem procházejí andělé v kostýmech a nesou velké osvětlené papírové loutky."
        buttonText="Přejít na galerii"
        onButtonClick={() => scrollToId("gallerySection")}
        children={
          <HeroMediaShowcase
            images={images}
            interval={4200}
            heightClassName="h-[320px] md:h-[480px] lg:h-[560px]"
            badges={["23. prosince", "Vysoké Mýto"]}
            badgesAlignment="right"
          />
        }
      />

      <div className="relative">
        <ScrollHint variant="overlay" color="light" />
      </div>

      <Section id="aboutSection" border={true}>
        <div className="relative overflow-hidden rounded-[2rem] border border-white/45 bg-[linear-gradient(145deg,rgba(255,255,255,0.84),rgba(247,241,233,0.74))] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-8">
          <div className="pointer-events-none absolute -left-10 top-8 h-28 w-28 rounded-full bg-[#f5a623]/14 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 rounded-full bg-white/45 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
            <div>
              <SectionBadge>Oficiální popis akce</SectionBadge>
              <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-900">
                Let andělů
              </h2>

              <div className="mt-5 space-y-5 text-base leading-8 text-[#5f4a35]">
                {ORIGINAL_TEXTS.map((text) => (
                  <p key={text}>{text}</p>
                ))}
              </div>
            </div>

            <div className="rounded-[1.8rem] border border-[#ffd799]/28 bg-[linear-gradient(145deg,rgba(255,248,236,0.8),rgba(255,234,196,0.46))] p-6 shadow-[0_18px_44px_rgba(95,47,0,0.08)]">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/45 bg-white/70 text-[#c46f04]">
                  <Bird size={18} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Charakter akce
                </h3>
              </div>

              <p className="mt-5 text-sm leading-7 text-[#5f4a35]">
                Prezentační stránka je stavěná jako kulturní událost s vlastní
                atmosférou, historií a vizuální silou. Místo stručného detailu
                programu pracuje s obrazem, trasou akce, zapojením lidí a
                galerií.
              </p>

              <div className="mt-5 space-y-3">
                {INVOLVEMENT_POINTS.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-white/35 bg-white/55 px-4 py-3"
                  >
                    <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-[#c46f04]" />
                    <p className="text-sm leading-7 text-[#5f4a35]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section border={true}>
        <div className="mb-6">
          <SectionBadge>Rychlé informace</SectionBadge>
          <h2 className="mt-3 text-3xl font-bold text-gray-900">
            Co je dobré vědět hned
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {EVENT_FACTS.map((fact) => (
            <EventFactCard key={fact.title} {...fact} />
          ))}
        </div>
      </Section>

      <Section border={true}>
        <div className="mb-6">
          <SectionBadge>Jak akce probíhá</SectionBadge>
          <h2 className="mt-3 text-3xl font-bold text-gray-900">
            Struktura prezentační stránky i samotného zážitku
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {PROGRAM_STEPS.map((step, index) => (
            <ProgramStep
              key={step.title}
              index={index + 1}
              title={step.title}
              text={step.text}
            />
          ))}
        </div>
      </Section>

      <Section id="gallerySection" border={true}>
        <div className="mb-6 text-center">
          <h2 className="mt-3 text-3xl font-bold text-gray-900">
            Galerie Letu andělů
          </h2>
        </div>

        <div className="rounded-[2rem] border border-white/45 bg-[linear-gradient(145deg,rgba(255,255,255,0.82),rgba(247,241,233,0.74))] p-5 shadow-[0_20px_54px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-6">
          <Gallery images={images} />
        </div>
      </Section>

      <Section border={true}>
        <div className="relative overflow-hidden rounded-[2rem] border border-white/45 bg-[linear-gradient(145deg,rgba(255,248,236,0.82),rgba(255,234,196,0.44))] p-6 shadow-[0_22px_60px_rgba(95,47,0,0.08)] backdrop-blur-xl md:p-8">
          <div className="pointer-events-none absolute -right-10 top-0 h-28 w-28 rounded-full bg-white/28 blur-3xl" />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <SectionBadge>Zapojení veřejnosti</SectionBadge>
              <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-900">
                Kdo chce, může se k andělům přidat
              </h2>
              <p className="mt-4 text-base leading-8 text-[#5f4a35]">
                Let andělů má být vidět, ale také sdílet. Pokud chcete být u
                toho blíž, můžete se přidat v andělském převleku nebo akci
                sledovat jako součást předvánočního setkání v centru města.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button href="/akce">Další akce</Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

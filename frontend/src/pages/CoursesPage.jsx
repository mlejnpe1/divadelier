import React, { useMemo, useState } from "react";
import Section from "../components/layout/Section.jsx";
import Hero from "../components/layout/Hero.jsx";
import CourseItemCard from "../components/courses/CourseItemCard.jsx";
import Accordion from "../components/courses/Accordion.jsx";
import LecturerPhoto from "../assets/images/adela.webp";
import InquiryModal from "../components/InquiryModal.jsx";
import toast from "react-hot-toast";
import { apiFetch } from "../utils/api.js";
import ScrollHint from "../components/layout/ScrollHint.jsx";
import Button from "../components/layout/Button.jsx";
import {
  BookOpenText,
  GraduationCap,
  Sparkles,
  UserRound,
  UsersRound,
  WandSparkles,
} from "lucide-react";

function mailto(subject, body = "") {
  const s = encodeURIComponent(subject);
  const b = encodeURIComponent(body);
  return `mailto:divadelier@divadelier.cz?subject=${s}&body=${b}`;
}

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function CoursesPage() {
  const customHref = useMemo(() => {
    return mailto(
      "Kurz na míru",
      "Dobrý den,\n\nmám zájem o kurz na míru.\n- Skupina / jednotlivec:\n- Počet účastníků:\n- Téma / cíl:\n- Preferovaný termín:\n\nDěkuji.",
    );
  }, []);

  const SECTIONS = useMemo(
    () => [
      {
        id: "group-regular",
        title: "Skupinové – pravidelné",
        subtitle: "Pravidelná setkávání, dlouhodobý rozvoj a společná tvorba.",
        items: [
          {
            title: "Dr. ZDIV",
            meta: "Dramaťák pro děti • 2 představení ročně",
            price: "1700 Kč / pololetí",
            badges: [
              "Prosinec: stínové divadlo",
              "Květen/červen: představení v M-klubu",
            ],
            description:
              "Dramaťák vycházející z přirozenosti a hravosti dětí. Rozvíjí spolupráci, osobnost, komunikační a prezentační dovednosti, výslovnost i herecké aktivity.",
            ctaText: "Přihlásit se",
            ctaHref: mailto("Přihláška – Dr. ZDIV"),
          },
          {
            title: "Divan",
            meta: "Divadelní skupina dospělých • tvorba na míru skupině",
            price: "500 Kč / lekce",
            badges: ["Pro dospělé nadšence", "Profesionální vedení"],
            description:
              "Skupina dospělých, kteří mají rádi divadlo a volný čas tráví divadelní tvorbou. Obsah je tvořen dle chuti a potřeb skupiny v konturách profesionálního vedení.",
            ctaText: "Domluvit účast",
            ctaHref: mailto("Zájem – Divan"),
          },
        ],
      },
      {
        id: "group-once",
        title: "Skupinové – jednorázové",
        subtitle: "Jednorázové akce a tematické kurzy pro skupiny i děti.",
        items: [
          {
            title: "Kurz na míru pro skupinu (děti i dospělí)",
            meta: "60 minut • max. 10 účastníků (mimo Divadeliér může být více)",
            price: "3000 Kč / 60 min",
            badges: [
              "Spolupráce ve skupině",
              "Veřejné vystupování",
              "Hlasová hygiena",
            ],
            description:
              "Potřebujete zlepšit spolupráci ve skupině, prozkoumat téma skrze příběh, osvojit si základní dovednosti hlasové hygieny nebo umět veřejně vystoupit a mluvit? Kurz připravíme přesně pro vás.",
            ctaText: "Chci kurz na míru",
            ctaHref: customHref,
          },
          {
            title: "Sobotní divadelní hodinka pro děti",
            meta: "1× měsíčně • školkové děti • rodiče mohou být přítomni • max. 10 dětí",
            price: "100 Kč / dítě",
            badges: [
              "Divadelní hra",
              "Pohádka / dětský příběh",
              "Inspirace dětskou literaturou",
            ],
            description:
              "Děti si projdou pohádkou či dětským příběhem skrze divadelní hru. Přátelský prostor pro malé (už ne miminka) a jejich rodiče.",
            ctaText: "Zjistit termín",
            ctaHref: mailto("Dotaz – Sobotní divadelní hodinka"),
          },
        ],
      },
      {
        id: "individual-regular",
        title: "Individuální – pravidelné",
        subtitle: "Dlouhodobá příprava s jasným cílem a vedením na míru.",
        items: [
          {
            title: "Přípravné kurzy k talentovým zkouškám",
            meta: "DAMU • JAMU • konzervatoře • výběr textu a interpretace",
            price: "500 - 1300 Kč / lekce",
            badges: ["Na VŠ ideálně od září", "Na SŠ nejpozději listopad"],
            description:
              "Pomoc s výběrem textu a přípravou interpretace. Cena se přizpůsobuje finančním možnostem studenta.",
            ctaText: "Domluvit přípravu",
            ctaHref: mailto("Zájem – Talentovky"),
          },
        ],
      },
      {
        id: "individual-once",
        title: "Individuální – jednorázové",
        subtitle:
          "Jednorázový intenzivní posun v tom, co teď nejvíc potřebujete.",
        items: [
          {
            title: "Kurz na míru pro jednotlivce",
            meta: "60 minut • rétorika • přednes • tréma • role a emoce",
            price: "1500 Kč / 60 min",
            badges: ["Přednes a prezentace", "Práce s trémou", "Rétorika"],
            description:
              "Chcete zlepšit rétorické dovednosti, přednes nebo prezentaci, překonat trému či prozkoumat emoce skrze roli? Připravíme individuální kurz přesně pro vás.",
            ctaText: "Chci individuální kurz",
            ctaHref: customHref,
          },
        ],
      },
    ],
    [customHref],
  );

  const HERO_TRACKS = useMemo(
    () => [
      {
        id: "group-regular",
        icon: UsersRound,
        title: "Skupinové kurzy",
        text: "Pravidelná setkávání i jednorázové workshopy pro děti a dospělé.",
      },
      {
        id: "individual-regular",
        icon: GraduationCap,
        title: "Talentovky",
        text: "Cílená individuální příprava na DAMU, JAMU i konzervatoře.",
      },
      {
        id: "individual-once",
        icon: WandSparkles,
        title: "Kurz na míru",
        text: "Rétorika, přednes, práce s trémou i konkrétní zadání pro jednotlivce i skupiny.",
      },
    ],
    [],
  );

  const LECTURER_HIGHLIGHTS = useMemo(
    () => [
      "Divadelní pedagogika a dramatická výchova",
      "Práce s hlasem, přednesem a prezentací",
      "Režie, scénáře a autorská tvorba",
      "Zkušenosti se školami i profesionálním divadlem",
    ],
    [],
  );

  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [selectedCourseTitle, setSelectedCourseTitle] = useState("");

  const handleSubmit = async (payload) => {
    await apiFetch("/api/inquiries", {
      method: "POST",
      body: {
        ...payload,
        subject: `Poptávka – Poptávka kurzu`,
        source: "course",
      },
    });

    toast.success("Děkujeme! Poptávka odeslána.");
  };

  return (
    <>
      <Hero
        title="Kurzy Divadeliéru"
        subtitle="Skupinově i individuálně"
        description="Pravidelné i jednorázové kurzy pro děti, dospělé i studenty. Najděte si formu, která vám sedí – nebo si nechte připravit kurz na míru."
        buttonText="Přejít na nabídku kurzů"
        onButtonClick={() => {
          const el = document.getElementById("offerSection");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        children={
          <div className="w-full max-w-3xl">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/18 bg-[linear-gradient(145deg,rgba(255,248,236,0.84),rgba(255,232,190,0.36))] p-6 shadow-[0_28px_75px_rgba(60,28,0,0.22)] backdrop-blur-xl md:p-7">
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/28 blur-3xl" />
              <div className="pointer-events-none absolute -left-8 bottom-0 h-28 w-28 rounded-full bg-[#f5a623]/20 blur-3xl" />

              <div className="relative">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#9a590b]">
                  Jakou cestou se vydat
                </p>
                <h2 className="mt-3 text-3xl font-bold leading-tight text-[#3f250f]">
                  Kurzy, které se přizpůsobí tomu, kde právě jste
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5f4126]">
                  Dlouhodobé skupiny, jednorázové divadelní workshopy i
                  individuální příprava pro konkrétní cíl. Vyberte si formát,
                  který vám dává smysl právě teď.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {HERO_TRACKS.map((track) => {
                    const Icon = track.icon;

                    return (
                      <button
                        key={track.id}
                        type="button"
                        onClick={() => scrollToId(track.id)}
                        className="group rounded-[1.6rem] border border-white/24 bg-white/50 p-4 text-left shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/66"
                      >
                        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/35 bg-[rgba(245,166,35,0.14)] text-[#c46f04] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
                          <Icon size={20} />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold text-gray-900">
                          {track.title}
                        </h3>
                        <p className="mt-2 text-sm leading-7 text-[#5f4a35]">
                          {track.text}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        }
      />
      <div className="relative">
        <ScrollHint variant="overlay" color="light" />
      </div>
      <InquiryModal
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        onSubmit={handleSubmit}
        title="Nezávazná přihláška"
        subtitle="Ozveme se vám s detaily ke kurzu."
        contextLabel="Vybraný kurz"
        contextValue={selectedCourseTitle}
        contextType="course"
      />

      <Section id="offerSection" border={true}>
        <div className="relative overflow-hidden rounded-[1.9rem] border border-white/45 bg-[linear-gradient(145deg,rgba(255,255,255,0.84),rgba(247,241,233,0.76))] p-5 shadow-[0_20px_56px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6">
          <div className="pointer-events-none absolute -left-8 top-4 h-24 w-24 rounded-full bg-[#f5a623]/14 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-white/45 blur-3xl" />

          <div className="relative">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#9a590b]">
              Nabídka kurzů
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-900">
              Vyberte si formát, který vám sedí
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5f4a35]">
              Nabídku jsme rozdělili podle typu práce a intenzity. Můžete
              přeskočit rovnou k části, která vás zajímá nejvíc.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {SECTIONS.map((s) => (
                <Button
                  key={s.id}
                  type="button"
                  onClick={() => scrollToId(s.id)}
                  variant="secondary"
                  size="sm"
                  className="border-white/55 bg-white/72 text-[#5f4126] shadow-[0_12px_30px_rgba(15,23,42,0.06)] backdrop-blur-md hover:bg-white"
                >
                  {s.title}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section border={true}>
        <div
          id="lecturer"
          className="relative overflow-hidden rounded-[2rem] border border-white/45 bg-[linear-gradient(145deg,rgba(255,255,255,0.84),rgba(247,241,233,0.74))] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-8"
        >
          <div className="pointer-events-none absolute -left-10 top-8 h-28 w-28 rounded-full bg-[#f5a623]/14 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 rounded-full bg-white/45 blur-3xl" />

          <div className="relative grid grid-cols-1 items-start gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(260px,360px)]">
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#9a590b]">
                Lektorské vedení
              </p>
              <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-900">
                Mgr. Adéla Pellarová
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-8 text-[#5f4a35]">
                Kurzy vede divadelní pedagožka, herečka a autorka, která staví
                výuku na přirozenosti, hlasu, spolupráci a odvaze vystoupit
                před druhé.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {LECTURER_HIGHLIGHTS.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-2 rounded-full border border-white/55 bg-white/72 px-4 py-2 text-sm font-medium text-[#5f4126] shadow-[0_10px_24px_rgba(15,23,42,0.06)] backdrop-blur-md"
                  >
                    <Sparkles size={15} className="text-[#c46f04]" />
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.6rem] border border-[#ffd799]/28 bg-[rgba(255,248,236,0.75)] p-5 shadow-[0_16px_38px_rgba(95,47,0,0.08)]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/45 bg-white/70 text-[#c46f04]">
                      <BookOpenText size={18} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Zkušenosti v praxi
                    </h3>
                  </div>
                  <ul className="mt-4 space-y-3 text-sm leading-7 text-[#5f4a35]">
                    <li>
                      Dramatická výchova na ZŠ a spolupráce se speciálními
                      pedagogy.
                    </li>
                    <li>
                      Prevence šikany, regulace agrese a videotréning ve
                      školách.
                    </li>
                    <li>
                      Sobotní divadelní dopoledne v Motole a pedagogická práce
                      s dětmi.
                    </li>
                  </ul>
                </div>

                <div className="rounded-[1.6rem] border border-white/45 bg-white/64 p-5 shadow-[0_16px_38px_rgba(15,23,42,0.06)]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/45 bg-[rgba(245,166,35,0.14)] text-[#c46f04]">
                      <UserRound size={18} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Divadlo a autorská práce
                    </h3>
                  </div>
                  <ul className="mt-4 space-y-3 text-sm leading-7 text-[#5f4a35]">
                    <li>Herečka profesionálního divadla Di a vedoucí Divadeliéru.</li>
                    <li>Režie, scénáře v databázi Dilia a básnická tvorba.</li>
                    <li>
                      Výroční cena Města Vysokého Mýta 2024 za kulturu.
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6">
                <Accordion title="Celý profil lektorky">
                  <div className="space-y-4 leading-8">
                    <p>
                      V současné době hraje, píše divadelní hry, režíruje,
                      navrhuje scény inscenací, vede Divadeliér ve Vysokém Mýtě,
                      který je domovskou scénou profesionálnímu souboru divadla
                      Di, dramatickým kurzům pro děti i dospělé (Dr. ZDIV,
                      Divan), Výstavám ve výloze, TV VV a kulturním akcím
                      vzácných hostů a plánuje v Divadeliéru otevřít Hereckou
                      laboratoř.
                    </p>
                    <p>
                      Lektoruje a rozvíjí herecké dovednosti. Nejvíce ji ovlivnil
                      Ivan Vyskočil hereckou disciplínou Dialogické jednání,
                      hlasovou výchovou ji provedla Šárka Šternbergová,
                      pohybovou průpravou Zdena Kratochvílová, hereckou Hana
                      Smrčková, dramaturgickou Zdena Josková, scénografickou
                      Karel Vostárek, režijní Aleš Bergman a další pedagogové
                      DAMU. Divadelně obohacující pro ni byly studijní pobyty v
                      Anglii, Maďarsku a Dánsku.
                    </p>
                    <p>
                      Její scénáře naleznete v databázi Dilia, hra Spolu byla
                      přeložena do polštiny (Wspolnie – Jan Węglowski), píše
                      básně.
                    </p>
                    <p>
                      Za rok 2024 získala Výroční cenu Města Vysokého Mýta 2024
                      za kulturu za vedení divadla Di, Divadeliéru, autorskou a
                      režijní práci i organizaci Letu andělů.
                    </p>
                  </div>
                </Accordion>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-[#f5a623]/12 blur-3xl" />
              <div className="relative overflow-hidden rounded-[1.9rem] border border-white/50 bg-white/55 p-3 shadow-[0_22px_56px_rgba(15,23,42,0.1)] backdrop-blur-xl">
                <img
                  src={LecturerPhoto}
                  alt="Mgr. Adéla Pellarová"
                  className="aspect-[3/4] w-full rounded-[1.5rem] object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </Section>
      <div className="relative">
        <ScrollHint variant="overlay" />
      </div>
      {SECTIONS.map((section) => (
        <Section key={section.id} border={true}>
          <div
            id={section.id}
            className={`scroll-mt-20 overflow-hidden rounded-[1.95rem] border p-6 shadow-[0_22px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:scroll-mt-24 md:p-8 ${
              section.id.includes("individual")
                ? "border-white/45 bg-[linear-gradient(145deg,rgba(255,255,255,0.86),rgba(247,241,233,0.74))]"
                : "border-[#ffd799]/24 bg-[linear-gradient(145deg,rgba(255,248,236,0.82),rgba(255,234,196,0.44))]"
            }`}
          >
            <div className="pointer-events-none absolute" />
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#9a590b]">
                  {section.id.includes("individual")
                    ? "Individuální práce"
                    : "Skupinový formát"}
                </p>
                <h2 className="mt-3 text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
                  {section.title}
                </h2>
              </div>

              <p className="max-w-2xl text-sm leading-7 text-[#5f4a35] sm:text-base">
                {section.subtitle}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
              {section.items.map((c) => (
                <CourseItemCard
                  key={c.title}
                  title={c.title}
                  description={c.description}
                  price={c.price}
                  meta={c.meta}
                  badges={c.badges}
                  ctaText={c.ctaText}
                  accent={
                    section.id.includes("individual") ? "ivory" : "warm"
                  }
                  onCtaClick={() => {
                    setSelectedCourseTitle(c.title);
                    setInquiryOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        </Section>
      ))}
    </>
  );
}

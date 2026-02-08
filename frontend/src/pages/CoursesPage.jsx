import React, { useMemo, useState } from "react";
import Section from "../components/layout/Section.jsx";
import Hero from "../components/layout/Hero.jsx";
import CourseItemCard from "../components/courses/CourseItemCard.jsx";
import Accordion from "../components/courses/Accordion.jsx";
import LecturerPhoto from "../assets/images/adela.webp";
import InquiryModal from "../components/InquiryModal.jsx";
import toast from "react-hot-toast";
import { apiFetch } from "../utils/api.js";

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
  const signupHref = useMemo(() => {
    return mailto(
      "Přihláška na kurz",
      "Dobrý den,\n\nmám zájem o kurz:\n- Název kurzu:\n- Jméno účastníka:\n- Věk (pokud dítě):\n- Telefon:\n\nDěkuji.",
    );
  }, []);

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
            price: "300–1000 Kč / lekce",
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
      />

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
        <div className="flex flex-wrap gap-2">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => scrollToId(s.id)}
              className="px-4 py-2 rounded-full border bg-white hover:bg-gray-50 transition text-sm"
            >
              {s.title}
            </button>
          ))}
        </div>
      </Section>

      <Section border={true}>
        <div
          id="lecturer"
          className="scroll-mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 items-start"
        >
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold">
              Lektorka kurzů: Mgr. Adéla Pellarová
            </h2>

            <ul className="mt-4 list-disc pl-6 text-gray-700 space-y-2">
              <li>
                Dramatická výchova na ZŠ, spolupráce se speciálními pedagogy.
              </li>
              <li>
                Prevence šikany, regulace agrese, videotréning ve školách.
              </li>
              <li>Sobotní divadelní dopoledne (Motol – dětská psychiatrie).</li>
              <li>Herečka profesionálního divadla Di, vedoucí Divadeliéru.</li>
              <li>Režie, scénáře (Dilia), básnická tvorba.</li>
            </ul>

            <div className="mt-6">
              <Accordion title="Celý profil lektorky">
                <div className="space-y-3">
                  <p>
                    Během DAMU studijní pobyt v Anglii (strukturované drama),
                    pobyt v Maďarsku (divadlo ve výchově). Po studiu pobyt v
                    Dánsku (specifika dánského školství).
                  </p>
                  <p>
                    Velmi mě ovlivnilo dialogické jednání Ivana Vyskočila na
                    DAMU. Spolupracovala jsem se speciálními pedagogy, PPP a
                    podílela se na projektech eliminace šikany ve školách.
                  </p>
                  <p>
                    V současnosti se věnuji profesionálnímu divadlu Di, vedení
                    Divadeliéru, režii, psaní scénářů a organizaci kulturních
                    akcí.
                  </p>
                  <p>
                    Jsem autorkou akce Let andělů (23. 12.) a každoročně
                    realizujeme stínové divadlo ve výlohách Divadeliéru.
                  </p>
                  <p>
                    Byla jsem 2× nominována na Výroční cenu města Vysokého Mýta
                    a za rok 2024 jsem toto ocenění za kulturu obdržela.
                  </p>
                </div>
              </Accordion>
            </div>
          </div>
          <div className="md:col-span-1">
            <img
              src={LecturerPhoto}
              alt="Mgr. Adéla Pellarová"
              className="w-full rounded-2xl shadow-md object-cover aspect-[3/4]"
              loading="lazy"
            />
          </div>
        </div>
      </Section>

      {SECTIONS.map((section) => (
        <Section key={section.id} border={true}>
          <div id={section.id} className="scroll-mt-24">
            <h2 className="text-3xl font-bold">{section.title}</h2>
            <p className="text-gray-700 mt-2">{section.subtitle}</p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.items.map((c) => (
                <CourseItemCard
                  key={c.title}
                  title={c.title}
                  description={c.description}
                  price={c.price}
                  meta={c.meta}
                  badges={c.badges}
                  ctaText={c.ctaText}
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

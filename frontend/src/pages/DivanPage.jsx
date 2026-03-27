import React from "react";
import { ScrollTextIcon, Signature } from "lucide-react";
import Hero from "../components/layout/Hero";
import Gallery from "../components/layout/Gallery";
import ImageRotator from "../components/layout/ImageRotator";
import Section from "../components/layout/Section";
import ScrollHint from "../components/layout/ScrollHint";
import Button from "../components/layout/Button";

const images = Object.values(
  import.meta.glob("../assets/images/divan/*.{jpg,png,jpeg}", {
    eager: true,
    query: "?url",
    import: "default",
  }),
);

const heroImages = Object.values(
  import.meta.glob("../assets/images/hero-divanPage/*.{jpg,png,jpeg}", {
    eager: true,
    query: "?url",
    import: "default",
  }),
);

const INTRO_TEXT = `
Jednoho dne v létě roku 2015 se domluvilo pár kamarádek, kamarádů a známých, slovo dalo slovo. Navíc se ke všemu přičetla ochota Adélky podělit se s námi ostatními o svoje zkušenosti a pedagogické schopnosti okolo divadla a jeho režie, a vést nás.

Tak se stalo, že jsme se začali pravidelně scházet, nadšeně dělat Adélčina cvičení a úkoly, jejichž smysl jsme zpočátku sice všichni nechápali, ale o to víc jsme se vyblbnuli. Líbila se nám všem ta úžasná možnost vychutnávat si naplno všelijaké to pitvoření se a přehánění, znovu v sobě objevovat možná někdy pozapomenutou dětskou hravost a poškádlit si svá ega coby úctyhodných dospěláků, rodičů a občanů.

Jak jsme si tak navzájem blbnuli a hecovali se, že jako přeci nebudeme zkoušet jen tak bez cíle, přišla opravdová výzva ve chvíli, kdy nám Adélka přinesla vytištěný a pečlivě upravený scénář první hry co zkusíme zahrát s tím, že:

„…protože nás je víc než postav ve scénáři, a abyste se nehádali kdo toho textu má víc a kdo míň, zahrají si všechny holky všechny ženský role a všichni kluci zase všechny mužský role, a basta…“.

No a tak jsme začali…

Historii Divanu si můžete prohlédnout na historických webových stránkách.
`;

const DivanPage = () => {
  return (
    <div>
      <Hero
        title="Divan"
        subtitle="Skupina dospělých divadelních nadšenců, která skrze vedení Adély Pellarové objevuje a rozvíjí herecké dovednosti a tvoří divadelní představení."
        description="Termíny schůzek: Pátek 19.00 – 21.00"
        children={
          <ImageRotator
            images={heroImages}
            interval={4000}
            className="h-80 w-3/4 md:h-96 md:w-full"
          />
        }
        onButtonClick={() => {
          const el = document.getElementById("joinSection");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        buttonText="Chci se přidat"
      />
      <div className="relative">
        <ScrollHint variant="overlay" color="light" />
      </div>
      <Section border={true}>
        <div className="mb-8 flex items-center">
          <ScrollTextIcon className="mr-3 h-8 w-8 text-[#f5a623]" />
          <h2 className="text-3xl font-bold">Jak to celé vzniklo</h2>
        </div>
        <p className="whitespace-pre-line text-lg text-gray-700 md:text-xl">
          {INTRO_TEXT}
        </p>
        <div className="mt-4">
          <Button
            href="https://www.divan.tode.cz/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Historické stránky
          </Button>
        </div>
      </Section>

      <Section id="joinSection" border={true}>
        <div className="mb-8 flex items-center">
          <Signature className="mr-3 h-8 w-8 text-[#f5a623]" />
          <h2 className="text-3xl font-bold">Chci se přidat</h2>
        </div>
        <p className="whitespace-pre-line text-lg text-gray-700 md:text-xl">
          Chcete-li se přidat, tak bližší informace získáte u Adély Pellarové, v
          současné chvíli nepřibíráme, máme rozpracované představení, ale při
          tvorbě další hry to možné bude.
        </p>
        <p className="mt-6 whitespace-pre-line text-lg text-gray-700 md:text-xl">
          Termíny schůzek: Pátek 19.00 – 21.00
        </p>
      </Section>

      <section className="px-6 pb-20 pt-20 md:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
            Galerie Divan
          </h2>
          <Gallery images={images} />
        </div>
      </section>
    </div>
  );
};

export default DivanPage;

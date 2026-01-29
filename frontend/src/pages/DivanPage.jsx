import React from "react";
import Hero from "../components/layout/Hero";
import Gallery from "../components/layout/Gallery";
import ImageRotator from "../components/layout/ImageRotator";
import Section from "../components/layout/Section";
import { FileSignature, ScrollTextIcon, Signature } from "lucide-react";

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

Tak se stalo, že jsme se začali pravidelně scházet, nadšeně dělat Adélčiny cvičení a úkoly, jejichž smysl jsme zpočátku sice všichni nechápali, ale o to víc jsme se vyblbnuli . Líbila se nám všem ta úžasná možnost vychutnávat si naplno všelijaké to pitvoření se a přehánění, znovu v sobě objevovat možná někdy pozapomenutou dětskou hravost a poškádlit si svá ega coby úctyhodných dospěláků, rodičů a občanů.

Jak jsme si tak navzájem blbnuli a hecovali se, že jako přeci nebudeme zkoušet jen tak bez cíle, přišla opravdová výzva ve chvíli, kdy nám Adélka přinesla vytištěný a pečlivě upravený scénář první hry co zkusíme zahrát s tím, že :

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
            className="w-3/4 md:w-full h-80 md:h-96"
          />
        }
        onButtonClick={() => {
          const el = document.getElementById("joinSection");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        buttonText={"Chci se přidat"}
      />

      <Section border={true}>
        <div className="flex items-center mb-8">
          <ScrollTextIcon className="w-8 h-8 text-[#f5a623] mr-3" />
          <h2 className="text-3xl font-bold">Jak to celé vzniklo</h2>
        </div>
        <p className="text-gray-700 text-lg md:text-xl whitespace-pre-line">
          {INTRO_TEXT}
        </p>
        <a
          href="https://www.divan.tode.cz/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition"
        >
          Historické stránky
        </a>
      </Section>

      <Section id="joinSection" border={true}>
        <div className="flex items-center mb-8">
          <Signature className="w-8 h-8 text-[#f5a623] mr-3" />
          <h2 className="text-3xl font-bold">Chci se přidat</h2>
        </div>
        <p className="text-gray-700 text-lg md:text-xl whitespace-pre-line">
          Chcete-li se přidat, tak bližší informace získáte u Adély Pellarové, v
          současné chvíli nepřibíráme, máme rozpracované představení, ale při
          tvorbě další hry to možné bude.
        </p>
        <p className="text-gray-700 text-lg md:text-xl whitespace-pre-line mt-6">
          Termíny schůzek: Pátek 19.00 – 21.00
        </p>
      </Section>

      <section className="pt-20 px-6 md:px-12 pb-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">
            Galerie Divan
          </h2>
          <Gallery images={images} />
        </div>
      </section>
    </div>
  );
};

export default DivanPage;

import React from "react";
import { ScrollTextIcon, Signature } from "lucide-react";
import Hero from "../components/layout/Hero";
import Gallery from "../components/layout/Gallery";
import ImageRotator from "../components/layout/ImageRotator";
import Section from "../components/layout/Section";
import ScrollHint from "../components/layout/ScrollHint";
import Button from "../components/layout/Button";

const images = Object.values(
  import.meta.glob("../assets/images/divan/*.{jpg,png,jpeg,webp}", {
    eager: true,
    query: "?url",
    import: "default",
  }),
);

const heroImages = Object.values(
  import.meta.glob("../assets/images/hero-divanPage/*.{jpg,png,jpeg,webp}", {
    eager: true,
    query: "?url",
    import: "default",
  }),
);

const INTRO_TEXT = `
Divan vznikl v roce 2015 jako skupina dospělých divadelních nadšenců, ve které se lidé prolínají dle časových možností a životních okolností. Od doby svého vzniku zrealizovala představení Blázinec v prvním poschodí, Hajzlbáby, Monologový večer, 17. listopad - 30 let, Firemní večírek, Tatíček zůstavitel. Taky během Covidu natočili pidifilm a účastní se Letu andělů.

V současné době pracují na kolektivní autorské hře. Skupina funguje pod vedením Adély Pellarové.

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

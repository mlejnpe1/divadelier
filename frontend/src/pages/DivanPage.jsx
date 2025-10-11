import React from "react";
import Hero from "../components/Hero";
import Gallery from "../components/Gallery";
import ImageRotator from "../components/ImageRotator";

const images = Object.values(
  import.meta.glob("../assets/images/divan/*.{jpg,png,jpeg}", {
    eager: true,
    query: "?url",
    import: "default",
  })
);

const heroImages = Object.values(
  import.meta.glob("../assets/images/hero-divanPage/*.{jpg,png,jpeg}", {
    eager: true,
    query: "?url",
    import: "default",
  })
);

const DivanPage = () => {
  const introText = `
Jednoho dne v létě roku 2015 se domluvilo pár kamarádek, kamarádů a známých, slovo dalo slovo. Navíc se ke všemu přičetla ochota Adélky podělit se s námi ostatními o svoje zkušenosti a pedagogické schopnosti okolo divadla a jeho režie, a vést nás.

Tak se stalo, že jsme se začali pravidelně scházet, nadšeně dělat Adélčiny cvičení a úkoly, jejichž smysl jsme zpočátku sice všichni nechápali, ale o to víc jsme se vyblbnuli . Líbila se nám všem ta úžasná možnost vychutnávat si naplno všelijaké to pitvoření se a přehánění, znovu v sobě objevovat možná někdy pozapomenutou dětskou hravost a poškádlit si svá ega coby úctyhodných dospěláků, rodičů a občanů.

Jak jsme si tak navzájem blbnuli a hecovali se, že jako přeci nebudeme zkoušet jen tak bez cíle, přišla opravdová výzva ve chvíli, kdy nám Adélka přinesla vytištěný a pečlivě upravený scénář první hry co zkusíme zahrát s tím, že :

„…protože nás je víc než postav ve scénáři, a abyste se nehádali kdo toho textu má víc a kdo míň, zahrají si všechny holky všechny ženský role a všichni kluci zase všechny mužský role, a basta…“.

No a tak jsme začali…
`;

  return (
    <div>
      <Hero
        title='Divan'
        subtitle='Amatérský soubor složený z nadšených dospělých lidí do divadelní práce.'
        children={
          <ImageRotator
            images={heroImages}
            interval={4000}
            className='w-3/4 md:w-full h-80 md:h-96'
          />
        }
      />

      <section className='py-16 px-6 md:px-20 max-w-4xl mx-auto'>
        <p className='text-gray-700 text-lg md:text-xl whitespace-pre-line'>
          {introText}
        </p>
      </section>

      <section className='py-16 px-6 md:px-20'>
        <h2 className='text-3xl font-bold mb-8 text-gray-900 text-center'>
          Galerie Divan
        </h2>
        <Gallery images={images} />
      </section>
    </div>
  );
};

export default DivanPage;

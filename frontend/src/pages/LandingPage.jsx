import React from "react";
import Hero from "../components/layout/Hero";
import About from "../components/About";
import ProgramOffer from "../components/ProgramOffer";
import ImageRotator from "../components/layout/ImageRotator";
import ScrollHint from "../components/layout/ScrollHint";

const heroImages = Object.values(
  import.meta.glob("../assets/images/hero-landingPage/*.{jpg,png,jpeg,webp}", {
    eager: true,
    query: "?url",
    import: "default",
  }),
);

const LandingPage = () => {
  return (
    <>
      <Hero
        title={<>Vítejte v Divadeliéru</>}
        subtitle="Prkna, která znamenají svět."
        description="Divadlo Di, Dr.Zdiv, Divan, TV VV, Výstavy ve výloze, přednášky, koncerty a další kulturní akce..."
        children={
          <ImageRotator
            images={heroImages}
            interval={4000}
            className="w-3/4 md:w-full h-80 md:h-96"
          />
        }
      />
      <div className="relative">
        <ScrollHint variant="overlay" />
      </div>
      <About />
      <ProgramOffer />
    </>
  );
};

export default LandingPage;

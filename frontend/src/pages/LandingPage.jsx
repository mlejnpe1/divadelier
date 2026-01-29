import React from "react";
import Hero from "../components/layout/Hero";
import About from "../components/About";
import ProgramOffer from "../components/ProgramOffer";
import ImageRotator from "../components/layout/ImageRotator";
import HeroImage1 from "../assets/images/hero-landingPage/hero1.webp";
import HeroImage2 from "../assets/images/hero-landingPage/hero2.webp";
import HeroImage3 from "../assets/images/hero-landingPage/hero3.webp";

const heroImages = [HeroImage1, HeroImage2, HeroImage3];

const LandingPage = () => {
  return (
    <>
      <Hero
        title={<>Vítejte v Divadeliéru</>}
        subtitle="Prkna, která znamenají svět."
        description="Divadlo Di, Dr.Zdiv, Divan, TV VV, Výstavy ve výloze, přednášky, koncerty a další kulturní akce..."
      >
        <ImageRotator
          images={heroImages}
          interval={4000}
          className="w-3/4 md:w-full h-80 md:h-96"
        />
      </Hero>
      <About />
      <ProgramOffer />
    </>
  );
};

export default LandingPage;

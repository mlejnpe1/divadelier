import React from "react";
import Hero from "../components/Hero";
import About from "../components/About";
import ProgramOffer from "../components/ProgramOffer";
import HeroImageRotator from "../components/HeroImageRotator";

const LandingPage = () => {
  return (
    <>
      <Hero
        title={
          <>
            Vítejte v <span className='text-[#f5a623]'>Divadeliéru</span>
          </>
        }
        subtitle='Prkna, která znamenají svět.'
        description='Divadlo Di, Dr.Zdiv, Divan, TV VV, Výstavy ve výloze, přednášky, koncerty a další kulturní akce...'
        buttonText='Prohlédnout domovskou scénu'
      >
        <HeroImageRotator />
      </Hero>
      <About />
      <ProgramOffer />
    </>
  );
};

export default LandingPage;

import React from "react";
import Hero from "../components/layout/Hero";
import About from "../components/About";
import ProgramOffer from "../components/ProgramOffer";
import ImageRotator from "../components/layout/ImageRotator";
import ScrollHint from "../components/layout/ScrollHint";
<<<<<<< HEAD
=======
import { Link } from "react-router";
>>>>>>> 0464d06 (landingpage + navabr popup change)

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
<<<<<<< HEAD
        description="Divadlo Di, Dr.Zdiv, Divan, TV VV, Výstavy ve výloze, přednášky, koncerty a další kulturní akce..."
=======
        description={
          <>
            <Link
              to="https://divadlodi.cz"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#000]"
            >
              Divadlo Di
            </Link>
            {", "}
            <Link to="/drZdiv" className="hover:text-[#000]">
              Dr.Zdiv
            </Link>
            {", "}
            <Link to="/divan" className="hover:text-[#000]">
              Divan
            </Link>
            {", "}
            <Link to="/tvvv" className="hover:text-[#000]">
              TV VV
            </Link>
            {", "}
            <Link to="/vvv" className="hover:text-[#000]">
              Výstavy ve výloze
            </Link>
            {", "}
            <Link to="/akce" className="hover:text-[#000]">
              {" přednášky, koncerty a další kulturní akce..."}
            </Link>
          </>
        }
>>>>>>> 0464d06 (landingpage + navabr popup change)
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

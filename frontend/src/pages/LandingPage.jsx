import React from "react";
import Hero from "../components/layout/Hero";
import About from "../components/About";
import ProgramOffer from "../components/ProgramOffer";
import ImageRotator from "../components/layout/ImageRotator";
import ScrollHint from "../components/layout/ScrollHint";
import { Link } from "react-router";

const heroImages = Object.values(
  import.meta.glob("../assets/images/hero-landingPage/*.{jpg,png,jpeg,webp}", {
    eager: true,
    query: "?url",
    import: "default",
  }),
);

const LandingPage = () => {
  const heroLinkClass =
    "underline underline-offset-4 transition duration-200 hover:text-orange-200";

  return (
    <>
      <Hero
        title={
          <>
            Vítejte v
            <br />
            Divadeliéru
          </>
        }
        subtitle="Prkna, která znamenají svět."
        description={
          <>
            <a
              href="https://divadlodi.cz"
              target="_blank"
              rel="noopener noreferrer"
              className={heroLinkClass}
            >
              Divadlo Di
            </a>
            {", "}
            <Link to="/drZdiv" className={heroLinkClass}>
              Dr.Zdiv
            </Link>
            {", "}
            <Link to="/divan" className={heroLinkClass}>
              Divan
            </Link>
            {", "}
            <Link to="/tvvv" className={heroLinkClass}>
              TV VV
            </Link>
            {", "}
            <Link to="/vvv" className={heroLinkClass}>
              Výstavy ve výloze
            </Link>
            {", "}
            <Link to="/akce" className={heroLinkClass}>
              přednášky, koncerty a další kulturní akce...
            </Link>
          </>
        }
      >
        <ImageRotator
          images={heroImages}
          interval={4000}
          className="w-full h-[320px] md:h-[480px] lg:h-[560px]"
        />
      </Hero>
      <div className="relative">
        <ScrollHint variant="overlay" color="light" />
      </div>
      <About />
      <ProgramOffer />
    </>
  );
};

export default LandingPage;

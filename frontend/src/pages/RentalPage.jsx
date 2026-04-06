import React from "react";
import Hero from "../components/layout/Hero.jsx";
import Section from "../components/layout/Section.jsx";
import RentCTA from "../components/rental/RentalCTA.jsx";
import ScrollHint from "../components/layout/ScrollHint.jsx";
import RentalUseCasesSection from "../components/rental/RentalUseCasesSection.jsx";
import RentalPracticalInfoSection from "../components/rental/RentalPracticalInfoSection.jsx";
import RentalGallerySection from "../components/rental/RentalGallerySection.jsx";

export default function RentalPage() {
  const images = Object.values(
    import.meta.glob("../assets/images/rental/*.{jpg,png,jpeg}", {
      eager: true,
      query: "?url",
      import: "default",
    }),
  );

  return (
    <>
      <Hero
        title="Pronájem Divadeliéru"
        subtitle="Prostor pro divadlo, workshopy, setkávání i klidnou tvorbu"
        description={
          "Nabízíme jedinečný multifunkční prostor ve Vysokém Mýtě.\n" +
          "Hodí se pro zkoušky, kurzy, besedy, focení i komorní akce."
        }
        buttonText="Přejít na informace o prostoru"
        onButtonClick={() => {
          const el = document.getElementById("informationSection");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />
      <div className="relative">
        <ScrollHint variant="overlay" color="light" />
      </div>
      <Section id="informationSection" border={true}>
        <RentalUseCasesSection />
      </Section>

      <Section border={true}>
        <RentCTA />
      </Section>

      <Section id="practicalInfo" border={true}>
        <RentalPracticalInfoSection />
      </Section>

      <Section border={true}>
        <RentalGallerySection images={images} />
      </Section>
    </>
  );
}

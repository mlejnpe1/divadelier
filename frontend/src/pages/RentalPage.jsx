import React from "react";
import Hero from "../components/layout/Hero.jsx";
import Section from "../components/layout/Section.jsx";
import Gallery from "../components/layout/Gallery.jsx";
import RentCTA from "../components/rental/RentalCTA.jsx";
import ScrollHint from "../components/layout/ScrollHint.jsx";

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
        <ScrollHint variant="overlay" />
      </div>
      <Section id="informationSection" border={true}>
        <h2 className="text-3xl font-bold mb-6">Na co se prostor hodí</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: "Divadelní zkoušky",
              text: "Prostor pro práci s pohybem i hlasem.",
            },
            {
              title: "Kurzy a workshopy",
              text: "Komorní vzdělávání i pravidelné lekce.",
            },
            {
              title: "Besedy a setkání",
              text: "Příjemná atmosféra pro komunitní akce.",
            },
            {
              title: "Focení / natáčení",
              text: "Zajímavé světlo a charakter místa.",
            },
            {
              title: "Kreativní dílny",
              text: "Pro tvoření, příběhy i práci s dětmi.",
            },
            { title: "Komorní akce", text: "Malý formát, velká atmosféra." },
          ].map((x) => (
            <div
              key={x.title}
              className="rounded-2xl border bg-white p-5 shadow-sm"
            >
              <h3 className="font-semibold text-lg">{x.title}</h3>
              <p className="text-gray-700 mt-2">{x.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section border={true}>
        <RentCTA />
      </Section>

      <Section id="practicalInfo" border={true}>
        <div className="relative">
          <ScrollHint variant="overlay" target="practicalInfo" />
        </div>
        <h2 className="text-3xl font-bold mb-6">Praktické informace</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border bg-white p-6">
            <h3 className="font-semibold text-lg">Prostor</h3>
            <ul className="mt-3 space-y-2 text-gray-700">
              <li>• Kapacita: 30 diváků + 15 kurzistů v akci</li>
              <li>
                • Vhodné pro: představení komorních divadel bytového typu,
                představení pro děti, přednášky, workshopy, autorská čtení,
                jednodenní výstavy…
              </li>
              <li>
                • Denní světlo / zatemnění: zářivky, žárovky, k dispozici dva
                divadelní reflektory, možnost zatemnit závěsy
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <h3 className="font-semibold text-lg">Vybavení</h3>
            <ul className="mt-3 space-y-2 text-gray-700">
              <li>
                • Židle / stoly: 30 ks, měkké pucánky 10ks, polštáře 10ks, tři
                skládací stoly
              </li>
              <li>• Zvuk: reprobedna, mikrofon bez stojanu</li>
              <li>• Wi-Fi / zázemí: ano, projektor, dva malířské stojany</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section border={true}>
        <h2 className="text-3xl font-bold mb-6">Jak prostor vypadá</h2>
        <Gallery images={images} />
      </Section>
    </>
  );
}

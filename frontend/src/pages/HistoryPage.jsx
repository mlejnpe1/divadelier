import React from "react";
import HistoryAside from "../components/history/HistorsyAside";
import HistoryCard from "../components/history/HistoryCard";
import HistoryImage2018 from "../assets/images/history/2018.webp";
import HistoryImage2019 from "../assets/images/history/2019.webp";
import HistoryImage2020 from "../assets/images/history/2020.webp";
import HistoryImage2021 from "../assets/images/history/2021.webp";
import HistoryImage2022 from "../assets/images/history/2022.webp";
import HistoryImage2024 from "../assets/images/history/2024.webp";
import HistoryImage2023 from "../assets/images/history/2023.webp";
import HistoryImage2025 from "../assets/images/history/2025.webp";
import HistoryImage2026 from "../assets/images/history/2026.webp";

const HistoryPage = () => {
  const historyEvents = [
    {
      year: "2018",
      image: HistoryImage2018,
      text: "vzniká Divadeliér a slouží převážně jako zkušebna pro profesionální divadlo Di, zázemí pro kurzy Dr. ZDIV a divadelní skupinu Divan",
    },
    {
      year: "2019",
      image: HistoryImage2019,
      text: "rozšiřuje své aktivity o stínové divadlo ve výlohách Divadeliéru",
    },
    {
      year: "2020",
      image: HistoryImage2020,
      text: "začínají Výstavy ve výloze, koná se první Let andělů a Divadeliér se otevírá i veřejnosti a začíná produkce divadelních představení i v interiéru Divadeliéru, během Covidu se hrají představení ve výloze a pořádá se pořad Poezie za sklem",
    },
    {
      year: "2021",
      image: HistoryImage2021,
      text: "v Divadeliéru začínají vystupovat i pozvaní hosté a pořizují se reflektory",
    },
    {
      year: "2022",
      image: HistoryImage2022,
      text: "začíná TV VV a veřejnosti je představena socha Anděl Vysokého Mýta, kterou vytvořil Pavel Hošek, v Divadeliéru začínají vystupovat i zahraniční hosté",
    },
    {
      year: "2023",
      image: HistoryImage2023,
      text: "nová cedule na Divadeliéru a vznikly vizitky a o Divadeliéru se mluví i v televizi v souvislosti s vítězstvím Vysokého Mýta jako Historickým městem roku 2023",
    },
    {
      year: "2024",
      image: HistoryImage2024,
      text: "Adéla Pellarová hostem v rozhvovoru pro Český rozhlas Pardubice.",
    },
    {
      year: "2025",
      image: HistoryImage2025,
      text: "Adéla Pellarová dostává Kujebu za kulturní přínos pro Vysoký Mýto v roce 2024",
    },
    {
      year: "2026",
      image: HistoryImage2026,
      text: "Divadeliér má krásné nové webové stránky",
    },
  ];

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen flex">
      <HistoryAside />

      <section className="flex-1 py-20 px-6 md:px-12">
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gray-300 h-full"></div>

          <div className="space-y-20">
            {historyEvents.map((event, index) => (
              <HistoryCard key={event.year} event={event} index={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HistoryPage;

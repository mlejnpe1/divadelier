import React from "react";
import Section from "./layout/Section";
import { Calendar, Clapperboard, ShoppingCart } from "lucide-react";

const cards = [
  {
    href: "/akce",
    title: "Akce",
    description: "Přehled budoucích i aktuálních akcí Divadeliéru.",
    Icon: Calendar,
  },
  {
    href: "/kurzy",
    title: "Kurzy",
    description: "Přehled individuálních i skupinových hereckých kurzů.",
    Icon: Clapperboard,
  },
  {
    href: "/eshop",
    title: "E-shop",
    description: "Podpoř Divadeliér a vystavující umělce v našem e-shopu.",
    Icon: ShoppingCart,
  },
];

const ProgramOffer = () => {
  return (
    <Section>
      <h2 className="text-center text-3xl md:text-4xl font-bold text-gray-900 mb-6">
        Program & Nabídka
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {cards.map(({ href, title, description, Icon }) => (
          <a key={href} href={href}>
            <div className="bg-white rounded-2xl shadow-md p-16 hover:shadow-xl transition-shadow">
              <Icon className="w-10 h-10 text-[#f5a623] mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-gray-600">{description}</p>
            </div>
          </a>
        ))}
      </div>
    </Section>
  );
};

export default ProgramOffer;

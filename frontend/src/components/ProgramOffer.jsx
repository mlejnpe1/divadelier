import React from "react";
import { Link } from "react-router";
import Section from "./layout/Section";
import {
  ArrowUpRight,
  Bird,
  Calendar,
  Clapperboard,
  ShoppingCart,
} from "lucide-react";

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
    href: "/let-andelu",
    title: "Let Andělů",
    description:
      "Samostatná stránka pro ojedinělou autorskou akci, která patří k příběhu Divadeliéru.",
    Icon: Bird,
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
      <div className="relative overflow-hidden rounded-[2.25rem] border border-white/45 bg-[linear-gradient(145deg,rgba(255,255,255,0.82),rgba(247,241,233,0.74))] px-6 py-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:px-8 md:py-10">
        <div className="pointer-events-none absolute -left-10 top-8 h-28 w-28 rounded-full bg-[#f5a623]/12 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 rounded-full bg-white/45 blur-3xl" />

        <div className="relative mb-8 text-center">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#9a590b]">
            Co v Divadeliéru najdete
          </p>
          <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
            Program & Nabídka
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#5f4a35] md:text-base">
            Akce, kurzy, autorské projekty i možnost podpořit Divadeliér.
            Vyberte si cestu, která vás zajímá nejvíc.
          </p>
        </div>

        <div className="relative grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(({ href, title, description, Icon }) => (
            <Link key={href} to={href} className="group block h-full">
              <article className="relative flex h-full min-h-[280px] flex-col overflow-hidden rounded-[1.9rem] border border-white/40 bg-[linear-gradient(160deg,rgba(255,255,255,0.62),rgba(255,248,236,0.44))] p-6 shadow-[0_18px_44px_rgba(15,23,42,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1.5 hover:border-[#f5a623]/30 hover:bg-[linear-gradient(160deg,rgba(255,255,255,0.76),rgba(255,242,214,0.56))] hover:shadow-[0_24px_54px_rgba(95,47,0,0.12)] md:min-h-[310px]">
                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/28 blur-3xl transition duration-300 group-hover:bg-white/42" />

                <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-[rgba(245,166,35,0.14)] text-[#c46f04] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
                  <Icon className="h-6 w-6" />
                </div>

                <div className="relative mt-6 flex-1">
                  <h3 className="text-2xl font-semibold tracking-tight text-gray-900">
                    {title}
                  </h3>
                  <p className="mt-4 text-base leading-8 text-[#5f4a35]">
                    {description}
                  </p>
                </div>

                <div className="relative mt-6 flex items-center justify-between border-t border-white/30 pt-4 text-sm font-medium text-[#8a5310]">
                  <span>Zobrazit detail</span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/45 transition duration-300 group-hover:bg-white/70">
                    <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default ProgramOffer;

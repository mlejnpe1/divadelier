import React from "react";
import { Link } from "react-router";
import Section from "../layout/Section";

const renderParagraph = (paragraph, idx) => {
  if (typeof paragraph === "string") {
    return <p key={idx}>{paragraph}</p>;
  }

  if (paragraph?.type === "linkLine") {
    return (
      <p key={idx}>
        {paragraph.before}
        <a
          href={paragraph.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#c98512] underline underline-offset-2 hover:text-[#a96a08]"
        >
          {paragraph.label}
        </a>
        {paragraph.after}
      </p>
    );
  }

  return null;
};

const LegalPage = ({ title, intro, sections }) => {
  return (
    <Section border>
      <div className="relative overflow-hidden rounded-[2rem] border border-[#ead7bb] bg-[linear-gradient(145deg,#fffaf4_0%,#f8efe2_52%,#fffdf9_100%)] px-6 py-8 shadow-[0_28px_80px_rgba(94,55,8,0.08)] sm:px-8 sm:py-10 lg:px-10">
        <div className="pointer-events-none absolute -left-12 top-8 h-40 w-40 rounded-full bg-[#f5a623]/12 blur-3xl" />
        <div className="pointer-events-none absolute -right-12 bottom-0 h-48 w-48 rounded-full bg-[#f1d0a7]/30 blur-3xl" />

        <div className="relative space-y-8">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#d8891c]">
              Informace
            </p>
            <h1 className="text-3xl font-bold leading-tight text-[#2f2417] sm:text-4xl">
              {title}
            </h1>
            <p className="text-sm leading-7 text-[#5e4b34] sm:text-base">
              {intro}
            </p>
          </div>

          <div className="grid gap-4">
            {sections.map((section) => (
              <article
                key={section.title}
                className="rounded-[1.5rem] border border-white/70 bg-white/70 p-5 shadow-[0_16px_38px_rgba(94,55,8,0.08)] backdrop-blur-xl sm:p-6"
              >
                <h2 className="text-lg font-semibold text-[#2f2417]">
                  {section.title}
                </h2>
                <div className="mt-3 space-y-3 text-sm leading-7 text-[#5e4b34] sm:text-base">
                  {section.paragraphs.map(renderParagraph)}
                </div>
              </article>
            ))}
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full border border-[#d8922c] bg-[#f5a623] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(245,166,35,0.28)] transition hover:-translate-y-0.5 hover:bg-[#e99b18]"
            >
              Zpět na úvod
            </Link>
            <Link
              to="/kontakt"
              className="inline-flex items-center justify-center rounded-full border border-[#ead3af] bg-[#fff8ef] px-5 py-2.5 text-sm font-semibold text-[#6a4a20] shadow-[0_8px_20px_rgba(94,55,8,0.06)] transition hover:bg-white"
            >
              Kontakt
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default LegalPage;

import React, { useState } from "react";
import Logo from "../../assets/images/logos/logo.webp";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router";
import LegalModal from "../legals/LegalModal";
import { legalDocuments } from "../legals/legalContent";

const Footer = () => {
  const [openLegalKey, setOpenLegalKey] = useState(null);

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", color: "text-blue-500" },
    { icon: Youtube, href: "https://youtube.com", color: "text-red-500" },
    { icon: Instagram, href: "https://instagram.com", color: "text-pink-500" },
  ];

  const linkColumns = [
    {
      title: "Naše scéna",
      links: [
        {
          label: "Divadlo Di",
          href: "https://divadlodi.cz",
          target: "_blank",
          rel: "noopener noreferrer",
        },
        { label: "Dr. ZDIV", href: "/drZdiv" },
        { label: "Divan", href: "/divan" },
        { label: "VVV", href: "/vvv" },
        { label: "TV VV", href: "/tvvv" },
      ],
    },
    {
      title: "Program & Nabídka",
      links: [
        { label: "Akce", href: "/akce" },
        { label: "Let Andělů", href: "/let-andelu" },
        { label: "Kurzy", href: "/kurzy" },
        //{ label: "E-shop", href: "/eshop" },
      ],
    },
    {
      title: "O Divadeliéru",
      links: [
        { label: "Historie", href: "/historie" },
        { label: "Pronájem", href: "/pronajem" },
        { label: "Kontakt", href: "/kontakt" },
      ],
    },
    {
      title: "Informace",
      links: [
        { label: "Obchodní podmínky", modalKey: "obchodniPodminky" },
        {
          label: "Zásady zpracování osobních údajů",
          modalKey: "zasadyZpracovaniOsobnichUdaju",
        },
        { label: "Zásady Cookies", modalKey: "zasadyCookies" },
        {
          label: "Mimosoudní řešení spotřebitelských sporů",
          modalKey: "mimosoudniReseniSpotrebitelskychSporu",
        },
      ],
    },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 shadow-sm">
      <div className="mx-auto w-full max-w-[1720px] px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="grid grid-cols-1 gap-12 py-10 lg:grid-cols-[minmax(360px,1.25fr)_repeat(4,minmax(0,1fr))] lg:items-start">
          <div className="flex flex-col items-center space-y-4 lg:items-start">
            <img src={Logo} alt="Divadeliér" className="h-28 w-auto" />
            <div className="flex flex-row space-x-4">
              {socialLinks.map((social, idx) => {
                const Icon = social.icon;
                return (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon
                      className={`${social.color} h-8 w-auto hover:opacity-80`}
                      aria-label={social.href}
                    />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-2 sm:text-left lg:col-span-4 lg:grid-cols-4 lg:gap-10">
            {linkColumns.map((column, idx) => (
              <div
                key={idx}
                className={`flex flex-col space-y-4 sm:space-y-2 ${
                  idx === 3 ? "lg:pl-4 xl:pl-6" : ""
                }`}
              >
                <span className="font-medium text-gray-800">
                  {column.title}
                </span>
                {column.links.map((link, linkIdx) =>
                  link.href?.startsWith("http") ? (
                    <a
                      key={linkIdx}
                      href={link.href}
                      target={link.target}
                      rel={link.rel}
                      className="font-medium leading-snug text-gray-800 hover:text-[#f5a623]"
                    >
                      {link.label}
                    </a>
                  ) : link.modalKey ? (
                    <button
                      key={linkIdx}
                      type="button"
                      onClick={() => setOpenLegalKey(link.modalKey)}
                      className="text-left font-medium leading-snug text-gray-800 hover:text-[#f5a623]"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link
                      key={linkIdx}
                      to={link.href}
                      className="font-medium leading-snug text-gray-800 hover:text-[#f5a623]"
                    >
                      {link.label}
                    </Link>
                  ),
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 px-4 py-2 text-center text-sm text-gray-500">
        <p className="font-medium text-gray-600">
          Provozovatel: Adéla Pellarová, IČO: 02684071, Pražská 8, 566 01 Vysoké
          Mýto
        </p>
        <p className="font-medium text-gray-600">
          Webdesign, realizace a správa webu: Petr Mlejnek, Kontakt:{" "}
          <a
            href="mailto:mlejnek.petr.ml@gmail.com"
            className="text-[#c6801c] transition hover:text-[#f5a623]"
          >
            mlejnek.petr.ml@gmail.com
          </a>
        </p>
        <p className="mt-2 border-t py-2 border-gray-200">
          &copy; 2026 Divadeliér. Všechna práva vyhrazena.
        </p>
      </div>

      <LegalModal
        open={Boolean(openLegalKey)}
        onClose={() => setOpenLegalKey(null)}
        legalDocument={openLegalKey ? legalDocuments[openLegalKey] : null}
      />
    </footer>
  );
};

export default Footer;

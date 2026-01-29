import React from "react";
import Logo from "../../assets/images/logos/logo.webp";
import { Facebook, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", color: "text-blue-500" },
    { icon: Youtube, href: "https://youtube.com", color: "text-red-500" },
    { icon: Instagram, href: "https://instagram.com", color: "text-pink-500" },
  ];

  const linkColumns = [
    {
      title: "Naše scéna",
      links: [
        { label: "Divadlo Di", href: "https://divadlodi.cz" },
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
        { label: "Kurzy", href: "/kurzy" },
        { label: "E-shop", href: "/eshop" },
      ],
    },
    {
      title: "O Divadeliéru",
      links: [
        { label: "Historie", href: "/historie" },
        { label: "Pronájem", href: "#" },
        { label: "Kontakt", href: "/kontakt" },
      ],
    },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-10">
          <div className="md:col-span-2 flex flex-col items-center space-y-4">
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

          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
            {linkColumns.map((column, idx) => (
              <div key={idx} className="flex flex-col space-y-4 sm:space-y-2">
                <a className="cursor-default text-gray-800 font-medium">
                  {column.title}
                </a>
                {column.links.map((link, linkIdx) => (
                  <a
                    key={linkIdx}
                    href={link.href}
                    className="text-gray-800 hover:text-[#f5a623] font-medium"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 pt-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Petr Mlejnek. Všechna práva vyhrazena.
      </div>
    </footer>
  );
};

export default Footer;

import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { motion } from "framer-motion";
import Section from "../components/layout/Section";
import ScrollHint from "../components/layout/ScrollHint";

const ContactPage = () => {
  return (
    <>
      <Section border={true}>
        <div className="relative overflow-hidden rounded-[2rem] border border-[#ead7bb] bg-[linear-gradient(145deg,#fffaf4_0%,#f8efe2_52%,#fffdf9_100%)] px-6 py-8 pb-20 shadow-[0_28px_80px_rgba(94,55,8,0.08)] sm:px-8 sm:py-10 sm:pb-24 lg:px-10">
          <div className="pointer-events-none absolute -left-12 top-10 h-40 w-40 rounded-full bg-[#f5a623]/12 blur-3xl" />
          <div className="pointer-events-none absolute -right-12 bottom-0 h-48 w-48 rounded-full bg-[#f1d0a7]/30 blur-3xl" />

          <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:gap-12">
            <div className="space-y-8 min-w-0">
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#d8891c]">
                  Kontakt
                </p>

                <h2 className="text-3xl font-bold leading-tight text-[#2f2417] sm:text-4xl">
                  Ozvěte se nám
                </h2>

                <p className="max-w-2xl text-sm leading-7 text-[#5e4b34] sm:text-base">
                  Máte dotaz, zájem o kurz, akci nebo spolupráci? Napište nám,
                  zavolejte nebo se zastavte v Divadeliéru.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-[1.5rem] border border-white/70 bg-white/65 p-5 shadow-[0_16px_38px_rgba(94,55,8,0.08)] backdrop-blur-xl">
                  <MapPin className="mb-4 h-5 w-5 text-[#f5a623]" />
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#c6801c]">
                    Adresa
                  </p>
                  <p className="text-sm leading-6 text-[#3f301d]">
                    Pražská 8
                    <br />
                    566 01 Vysoké Mýto
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-white/70 bg-white/65 p-5 shadow-[0_16px_38px_rgba(94,55,8,0.08)] backdrop-blur-xl">
                  <Phone className="mb-4 h-5 w-5 text-[#f5a623]" />
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#c6801c]">
                    Telefon
                  </p>
                  <a
                    href="tel:+420777076901"
                    className="text-sm leading-6 text-[#3f301d] transition hover:text-[#a55f08]"
                  >
                    +420 777 076 901
                  </a>
                </div>

                <div className="rounded-[1.5rem] border border-white/70 bg-white/65 p-5 shadow-[0_16px_38px_rgba(94,55,8,0.08)] backdrop-blur-xl">
                  <Mail className="mb-4 h-5 w-5 text-[#f5a623]" />
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#c6801c]">
                    E-mail
                  </p>
                  <a
                    href="mailto:adapop@seznam.cz"
                    className="break-all text-sm leading-6 text-[#3f301d] transition hover:text-[#a55f08]"
                  >
                    adapop@seznam.cz
                  </a>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[1.75rem] border border-white/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.7),rgba(255,245,228,0.72))] p-6 shadow-[0_18px_46px_rgba(94,55,8,0.08)] backdrop-blur-2xl">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#c6801c]">
                  Napište nebo zavolejte
                </p>
                <p className="text-lg font-semibold text-[#2f2417]">
                  Jsme k dispozici pro kurzy, akce i spolupráce.
                </p>
                <p className="mt-3 text-sm leading-7 text-[#5e4b34]">
                  Nejrychleji se s námi spojíte e-mailem nebo telefonicky.
                  Ozveme se co nejdříve.
                </p>
              </div>

              <div className="rounded-[1.75rem] border border-white/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.7),rgba(255,245,228,0.72))] p-6 shadow-[0_18px_46px_rgba(94,55,8,0.08)] backdrop-blur-2xl">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#c6801c]">
                  Sledujte nás
                </p>
                <p className="text-base leading-7 text-[#5e4b34]">
                  Zůstaňte v kontaktu i mimo Divadeliér.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href="https://www.facebook.com/profile.php?id=61580111814101"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#e8d1af] bg-white/80 text-[#335ca8] shadow-[0_10px_24px_rgba(94,55,8,0.08)] transition hover:-translate-y-0.5 hover:bg-white"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>

                  <a
                    href="https://www.instagram.com/divadelier"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#e8d1af] bg-white/80 text-[#d04a7f] shadow-[0_10px_24px_rgba(94,55,8,0.08)] transition hover:-translate-y-0.5 hover:bg-white"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>

                  <a
                    href="https://youtube.com/@divadelier"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#e8d1af] bg-white/80 text-[#db4237] shadow-[0_10px_24px_rgba(94,55,8,0.08)] transition hover:-translate-y-0.5 hover:bg-white"
                  >
                    <Youtube className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <ScrollHint
            target="#contactMapSection"
            variant="inline"
            color="dark"
            label="Zobrazit mapu"
            className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 text-[#8a6a42] hover:text-[#5f3f16]"
            iconClassName="h-6 w-6"
          />
        </div>
      </Section>

      {/* Mapa */}
      <Section id="contactMapSection" border={true}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2rem] border border-[#ead7bb] bg-[linear-gradient(145deg,#fffaf4_0%,#f8efe2_52%,#fffdf9_100%)] p-4 shadow-[0_28px_80px_rgba(94,55,8,0.08)] sm:p-5"
        >
          <div className="pointer-events-none absolute -left-10 top-0 h-36 w-36 rounded-full bg-[#f5a623]/12 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 bottom-0 h-44 w-44 rounded-full bg-[#f1d0a7]/28 blur-3xl" />

          <div className="relative space-y-5">
            <div className="rounded-[1.5rem] border border-white/70 bg-white/60 px-5 py-5 shadow-[0_16px_38px_rgba(94,55,8,0.08)] backdrop-blur-xl sm:px-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#c6801c]">
                Kde nás najdete
              </p>
              <h3 className="text-2xl font-bold text-[#2f2417]">
                Divadeliér ve Vysokém Mýtě
              </h3>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5e4b34] sm:text-base">
                Najdete nás na adrese Pražská 8. Pokud se chystáte na kurz, akci
                nebo osobní setkání, tady je nejrychlejší orientace.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <span className="inline-flex items-center rounded-full border border-[#ead3af] bg-[#fff8ef] px-4 py-2 text-sm text-[#6a4a20] shadow-[0_8px_20px_rgba(94,55,8,0.06)]">
                  Pražská 8, Vysoké Mýto
                </span>
                <a
                  href="tel:+420777076901"
                  className="inline-flex items-center rounded-full border border-[#ead3af] bg-[#fff8ef] px-4 py-2 text-sm text-[#6a4a20] shadow-[0_8px_20px_rgba(94,55,8,0.06)] transition hover:bg-white"
                >
                  +420 777 076 901
                </a>
              </div>

              <div className="mt-5">
                <a
                  href="https://maps.google.com/?q=Pra%C5%BEsk%C3%A1%208,%20566%2001%20Vysok%C3%A9%20M%C3%BDto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full border border-[#d8922c] bg-[#f5a623] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(245,166,35,0.28)] transition hover:-translate-y-0.5 hover:bg-[#e99b18]"
                >
                  Otevřít v Google Maps
                </a>
              </div>
            </div>

            <div className="overflow-hidden rounded-[1.5rem] border border-white/75 bg-white/70 shadow-[0_22px_54px_rgba(94,55,8,0.1)]">
              <div className="h-[260px] sm:h-[350px] md:h-[450px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2567.0285798634573!2d16.156940277140183!3d49.95456637150172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470dc172cbafc7a1%3A0xe181fc42e8afb1b6!2sDivadeli%C3%A9r!5e0!3m2!1scs!2scz!4v1758050034074!5m2!1scs!2scz"
                  className="h-full w-full"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </Section>
    </>
  );
};

export default ContactPage;

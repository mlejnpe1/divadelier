import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { motion } from "framer-motion";
import Section from "../components/layout/Section";

const ContactPage = () => {
  return (
    <>
      <Section border={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
          {/* Levý sloupec – kontakt */}
          <div className="space-y-6 min-w-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Kontaktujte nás
            </h2>

            <p className="text-gray-700 text-sm sm:text-base max-w-prose">
              Máte dotaz nebo zájem o spolupráci? Napište nám, zavolejte nebo se
              zastavte.
            </p>

            <ul className="space-y-4 text-gray-700 text-sm sm:text-base">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#f5a623] mt-0.5" />
                <span>
                  <strong>Adresa:</strong>
                  <br />
                  Pražská 8, 566 01 Vysoké Mýto
                </span>
              </li>

              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#f5a623] mt-0.5" />
                <span>
                  <strong>Telefon:</strong>
                  <br />
                  <a href="tel:+420777076901" className="hover:underline">
                    +420 777 076 901
                  </a>
                </span>
              </li>

              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#f5a623] mt-0.5" />
                <span>
                  <strong>E-mail:</strong>
                  <br />
                  <a href="mailto:adapop@seznam.cz" className="hover:underline">
                    adapop@seznam.cz
                  </a>
                </span>
              </li>
            </ul>
          </div>

          {/* Pravý sloupec – sociální sítě */}
          <div className="space-y-6 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
              Sledujte nás
            </h3>

            <p className="text-gray-600 text-sm sm:text-base">
              Zůstaňte v kontaktu i mimo Divadeliér
            </p>

            <div className="flex justify-center md:justify-start gap-6">
              <a
                href="https://www.facebook.com/profile.php?id=61580111814101"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <Facebook className="h-7 w-7 text-blue-500 hover:text-blue-700 transition" />
              </a>

              <a
                href="https://www.instagram.com/divadelier"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram className="h-7 w-7 text-pink-500 hover:text-pink-700 transition" />
              </a>

              <a
                href="https://youtube.com/@divadelier"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <Youtube className="h-7 w-7 text-red-500 hover:text-red-700 transition" />
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* Mapa */}
      <Section border={true}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="w-full h-[260px] sm:h-[350px] md:h-[450px] rounded-2xl overflow-hidden shadow-lg"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2567.0285798634573!2d16.156940277140183!3d49.95456637150172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470dc172cbafc7a1%3A0xe181fc42e8afb1b6!2sDivadeli%C3%A9r!5e0!3m2!1scs!2scz!4v1758050034074!5m2!1scs!2scz"
            className="w-full h-full"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </Section>
    </>
  );
};

export default ContactPage;

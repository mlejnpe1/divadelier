import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { motion } from "framer-motion";

const ContactPage = () => {
  return (
    <section className='bg-gray-50 max-w-6xl mx-auto py-20 px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 w-full gap-16'>
      {/* Information */}
      <div className='flex flex-col w-full space-y-6 min-w-0'>
        <h2 className='text-3xl font-bold text-gray-900 mb-6'>
          Kontaktujte nás
        </h2>
        <p className='text-lg text-gray-700 mb-4'>
          Máte dotaz nebo zájem o spolupráci? Napište nám, zavolejte nebo se
          zastavte.
        </p>
        <ul className='space-y-3 text-gray-'>
          <li className='flex flex-row'>
            <MapPin className='w-5 h-5 text-[#f5a623] mr-2' />
            <strong className='mr-4'>Adresa:</strong> Pražská 8, 566 01 Vysoké
            Mýto
          </li>
          <li className='flex flex-row'>
            <Phone className='w-5 h-5 text-[#f5a623] mr-2' />
            <strong className='mr-4'>Telefon:</strong> +420 777 076 901
          </li>
          <li className='flex flex-row'>
            <Phone className='w-5 h-5 text-[#f5a623] mr-2' />
            <strong className='mr-4'>E-mail:</strong> adapop@seznam.cz
          </li>
        </ul>
      </div>

      {/* Socials */}
      <div className='w-full text-center space-y-6'>
        <h3 className='text-2xl font-bold text-gray-900'>Sledujte nás</h3>
        <p className='text-gray-600'>Zůstaňte v kontaktu i mimo Divadeliér</p>
        <div className='flex justify-center space-x-6'>
          <a
            href='https://facebook.com'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Facebook className='h-8 w-auto text-blue-500 hover:text-blue-700' />
          </a>
          <a
            href='https://youtube.com'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Youtube className='h-8 w-auto text-red-500 hover:text-red-700' />
          </a>
          <a
            href='https://instagram.com'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Instagram className='h-8 w-auto text-pink-500 hover:text-pink-700' />
          </a>
        </div>
      </div>

      {/* Iframe */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className='w-full h-[400px] md:h-[500px] my-12 rounded-2xl overflow-hidden shadow-xl col-span-2'
      >
        <iframe
          src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2567.0285798634573!2d16.156940277140183!3d49.95456637150172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470dc172cbafc7a1%3A0xe181fc42e8afb1b6!2sDivadeli%C3%A9r!5e0!3m2!1scs!2scz!4v1758050034074!5m2!1scs!2scz'
          className='w-full h-full'
          style={{ border: 0 }}
          allowFullScreen=''
          loading='lazy'
          referrerpolicy='no-referrer-when-downgrade'
        ></iframe>
      </motion.div>
    </section>
  );
};

export default ContactPage;

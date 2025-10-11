import React from "react";
import Logo from "../assets/images/logos/logo.webp";
import { Facebook, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className='bg-white border-t border-gray-200 shadow-sm bottom-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-10 py-10'>
          <div className='md:col-span-2 flex flex-col items-center space-y-4'>
            <img src={Logo} alt='Divadeliér' className='h-28 w-auto' />
            <div className='flex flex-row space-x-4'>
              <a
                href='https://facebook.com'
                target='_blank'
                rel='noopener noreferrer'
              >
                <Facebook
                  className='h-8 w-auto text-blue-500 hover:text-blue-700'
                  aria-label='Facebook'
                />
              </a>
              <a
                href='https://youtube.com'
                target='_blank'
                rel='noopener noreferrer'
              >
                <Youtube
                  className='h-8 w-auto text-red-500 hover:text-red-700'
                  aria-label='Youtube'
                />
              </a>
              <a
                href='https://instagram.com'
                target='_blank'
                rel='noopener noreferrer'
              >
                <Instagram
                  className='h-8 w-auto text-pink-500 hover:text-pink-700'
                  aria-label='Instagram'
                />
              </a>
            </div>
          </div>
          <div className='md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left'>
            <div className='flex flex-col space-y-4 sm:space-y-2'>
              <a
                href='#'
                className='text-gray-800 hover:text-[#f5a623] font-medium'
              >
                Naše scéna
              </a>
              <a
                href='https://divadlodi.cz'
                className='text-gray-800 hover:text-[#f5a623] font-medium'
              >
                Divadlo Di
              </a>
              <a
                href='/drZdiv'
                className='text-gray-800 hover:text-[#f5a623] font-medium'
              >
                Dr. Zdiv
              </a>
              <a
                href='/divan'
                className='text-gray-800 hover:text-[#f5a623] font-medium'
              >
                Divan
              </a>
              <a
                href='/vvv'
                className='text-gray-800 hover:text-[#f5a623] font-medium'
              >
                VVV
              </a>
              <a
                href='#'
                className='text-gray-800 hover:text-[#f5a623] font-medium'
              >
                TVV
              </a>
            </div>
            <div className='flex flex-col space-y-4 sm:space-y-2'>
              <a
                href='#'
                className='text-gray-800 hover:text-[#f5a623] font-medium'
              >
                Program & Nabídka
              </a>
              <a
                href='#'
                className='text-gray-800 hover:text-[#f5a623] font-medium'
              >
                Akce
              </a>
              <a
                href='#'
                className='text-gray-800 hover:text-[#f5a623] font-medium'
              >
                Kurzy
              </a>
              <a
                href='#'
                className='text-gray-800 hover:text-[#f5a623] font-medium'
              >
                E-shop
              </a>
            </div>
            <div className='flex flex-col space-y-4 sm:space-y-2'>
              <a
                href='#'
                className='text-gray-800 hover:text-[#f5a623] font-medium'
              >
                O Divadeliéru
              </a>
              <a
                href='#'
                className='text-gray-800 hover:text-[#f5a623] font-medium'
              >
                Historie
              </a>
              <a
                href='#'
                className='text-gray-800 hover:text-[#f5a623] font-medium'
              >
                Pronájem
              </a>
              <a
                href='/kontakt'
                className='text-gray-800 hover:text-[#f5a623] font-medium'
              >
                Kontakt
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className='border-t border-gray-200 pt-4 text-center text-sm text-gray-500'>
        &copy; {new Date().getFullYear()} Petr Mlejnek. Všechna práva vyhrazena.
      </div>
    </footer>
  );
};

export default Footer;

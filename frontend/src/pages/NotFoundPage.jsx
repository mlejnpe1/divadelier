import React from "react";
import { XCircle } from "lucide-react";
import { Link } from "react-router";

const NotFoundPage = () => {
  return (
    <div className='bg-gray-50 min-h-screen flex flex-col justify-center items-center text-gray-800 px-6'>
      <XCircle className='w-24 h-24 text-[#f5a623] mb-6 animate-bounce' />
      <h1 className='text-5xl font-bold mb-4'>404</h1>
      <p className='text-xl text-gray-600 mb-6 text-center'>
        Omlouváme se, stránka, kterou hledáte, neexistuje.
      </p>
      <Link
        to='/'
        className='bg-[#f5a623] text-white px-6 py-3 rounded-full font-semibold shadow hover:shadow-md hover:scale-105 transform transition duration-300'
      >
        Zpět na hlavní stránku
      </Link>
    </div>
  );
};

export default NotFoundPage;

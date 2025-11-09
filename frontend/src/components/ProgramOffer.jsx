import React from "react";
import { Calendar, Clapperboard, ShoppingCart } from "lucide-react";

const ProgramOffer = () => {
  return (
    <section className='bg-gray-50 py-20 px-6 md:px-12 border-t border-gray-200'>
      <div className='max-w-6xl mx-auto text-center'>
        <h2 className='text-3xl md:text-4xl font bold mb-12'>
          Program & Nabídka
        </h2>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10'>
          <a href='/akce'>
            <div className='bg-white rounded-2xl shadow-md p-16 hover:shadow-xl transition-shadow'>
              <Calendar className='w-10 h-10 text-[#f5a623] mb-4 mx-auto' />
              <h3 className='text-xl font-semibold mb-2'>Akce</h3>
              <p className='text-gray-600'>
                Přehled budoucích i aktuálních akcí Divadeliéru.
              </p>
            </div>
          </a>
          <a href='/kurzy'>
            <div className='bg-white rounded-2xl shadow-md p-16 hover:shadow-xl transition-shadow'>
              <Clapperboard className='w-10 h-10 text-[#f5a623] mb-4 mx-auto' />
              <h3 className='text-xl font-semibold mb-2'>Kurzy</h3>
              <p className='text-gray-600'>
                Přehled individuálních i skupinových hereckých kurzů.
              </p>
            </div>
          </a>
          <a href='/eshop'>
            <div className='bg-white rounded-2xl shadow-md p-16 hover:shadow-xl transition-shadow'>
              <ShoppingCart className='w-10 h-10 text-[#f5a623] mb-4 mx-auto' />
              <h3 className='text-xl font-semibold mb-2'>E-shop</h3>
              <p className='text-gray-600'>
                Podpoř Divadeliér a vystavující umělce v našem e-shopu.
              </p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProgramOffer;

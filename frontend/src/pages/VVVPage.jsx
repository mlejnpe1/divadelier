import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Hero from "../components/Hero.jsx";

const VVVPage = () => {
  const [exhibitions, setExhibitions] = useState([]);
  const [loadingExhibitions, setLoadingExhibitions] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    fetch(`${API_URL}/api/exhibitions`)
      .then((res) => res.json())
      .then((data) => setExhibitions(data))
      .catch((err) => console.log(err))
      .finally(() => setLoadingExhibitions(false));
  }, []);

  return (
    <div className='bg-gray-50 text-gray-800 min-h-screen'>
      <Hero
        title='VVV – Výstavy ve výloze'
        subtitle='Aktuální výstava na dosah'
        description='Prohlédněte si umělecká díla přímo z výlohy. Objevte novinky, plán výstav a možnost zakoupení obrazů.'
        children={
          <div className='w-full max-w-3xl mx-auto mt-6'>
            <img
              src={exhibitions[0]?.imageUrl || "/placeholder.png"}
              alt={exhibitions[0]?.title || "Aktuální výstava"}
              className='rounded-xl shadow-lg w-full object-cover h-64 md:h-96'
            />
          </div>
        }
      />
    </div>
  );
};

export default VVVPage;

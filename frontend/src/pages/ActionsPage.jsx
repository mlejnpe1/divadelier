import React from "react";
import { ArrowRight, Calendar } from "lucide-react";
import Hero from "../components/Hero";
import { motion } from "framer-motion";
import PlaceholderImg from "../assets/images/placeholder.png";
import { useFetch } from "../hooks/useFetch";

const ActionsPage = () => {
  const { data: actions, loading, error } = useFetch("/api/exhibitions");

  const featuredAction = React.useMemo(() => {
    if (!actions || actions.length === 0) return null;

    const today = new Date();
    const upcoming = actions.filter((a) => new Date(a.date) >= today);

    const chooseClosest = (list) =>
      list.reduce((prev, curr) => {
        const prevDiff = Math.abs(new Date(prev.date) - today);
        const currDiff = Math.abs(new Date(curr.date) - today);
        return currDiff < prevDiff ? curr : prev;
      });

    if (upcoming.length > 0) return chooseClosest(upcoming);
    return chooseClosest(actions);
  }, [actions]);

  const others = actions && actions.length > 1 ? actions.slice(1) : [];

  return (
    <div className='bg-gray-50 text-gray-800 min-h-screen'>
      {featuredAction ? (
        <Hero
          title={featuredAction.title}
          subtitle='Nejbližší akce Divadeliéru'
          description={featuredAction.description}
          buttonText='Zobrazit ostatní akce'
          onButtonClick={() => {
            const el = document.getElementById("actionSection");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          children={
            <img
              src={PlaceholderImg}
              alt='Plakát akce'
              className='rounded-2xl shadow-2xl object-contain h-full'
            />
          }
        />
      ) : (
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-[#f5a623] border-solid'></div>
        </div>
      )}
      <section id='actionSection' className='max-w-6xl mx-auto px-6 md:px-12'>
        <h2 className='text-3xl font-bold mt-16 mb-8'>Ostatní akce</h2>
        {loading ? (
          <div className='flex justify-center items-center h-64'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-[#f5a623] border-solid'></div>
          </div>
        ) : (
          others &&
          others.map((other, index) => (
            <motion.div
              key={other._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className='flex flex-col my-10 md:flex-row items-center bg-white rounded-xl shadow-lg overflow-hidden'
            >
              {/*<img
                src={featured.posterUrl}
                alt={featured.title}
                className='w-full md:w-1/2 object-cover h-96'
              />*/}
              <div className='p-6 md:w-1/2'>
                <h2 className='text-3xl font-bold mb-2'>{other.title}</h2>
                <p className='text-gray-600 mb-4'>{other.description}</p>
                <p className='text-sm text-gray-500 mb-6'>
                  <Calendar className='inline-block w-4 h-4 mr-1' />
                  {new Date(other.date).toLocaleDateString("cs-CZ")}
                </p>
                <a
                  href={`/akce/${other._id}`}
                  className='text-yellow-500 font-semibold hover:underline'
                >
                  Více informací{" "}
                  <ArrowRight className='inline-block ml-2 w-4 h-4' />
                </a>
              </div>
            </motion.div>
          ))
        )}
      </section>
    </div>
  );
};

export default ActionsPage;

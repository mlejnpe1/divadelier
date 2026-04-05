import { motion } from "framer-motion";

export default function HistoryCard({ event, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className="relative flex flex-col items-center md:flex-row"
    >
      <div className="hidden md:block md:absolute left-1/2 top-1/2 z-10 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-[#f5a623] shadow-[0_14px_30px_rgba(245,166,35,0.34)]"></div>

      <div
        className={`relative w-full overflow-hidden rounded-[1.75rem] border border-[#e7b36c]/75 bg-[linear-gradient(145deg,rgba(255,247,234,0.95),rgba(255,224,174,0.9))] p-6 shadow-[0_24px_60px_rgba(120,61,0,0.16)] backdrop-blur-xl md:w-5/12 ${
          index % 2 === 0 ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"
        }`}
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#fff0cf]/70 blur-3xl" />
        <div className="pointer-events-none absolute -left-8 bottom-0 h-24 w-24 rounded-full bg-[#f5a623]/30 blur-3xl" />

        <div className="relative">
          <div className="mb-5 border-b border-[#f4dec0]/75 pb-4">
            <div className="inline-flex rounded-full border border-[#e8b56d] bg-[linear-gradient(145deg,rgba(255,249,237,0.98),rgba(255,214,143,0.95))] px-5 py-2.5 text-[0.82rem] font-bold uppercase tracking-[0.28em] text-[#7b4303] shadow-[0_18px_38px_rgba(138,79,8,0.16)]">
              {event.year}
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.25rem] border border-[#f3cf9b]/80 bg-[linear-gradient(145deg,rgba(255,252,245,0.82),rgba(255,234,194,0.72))] shadow-[0_18px_42px_rgba(120,61,0,0.1)]">
            <img
              src={event.image}
              alt={event.year}
              className="h-48 w-full object-cover"
            />
          </div>

          <p className="mt-5 leading-8 text-[#6a4315]">{event.text}</p>
        </div>
      </div>
    </motion.div>
  );
}

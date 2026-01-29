import React from "react";
import { motion } from "framer-motion";
import NewsCard from "./NewsCard.jsx";

export default function NewsList({ news, user, onDelete }) {
  if (!Array.isArray(news) || news.length === 0) {
    return <p className="text-gray-400">Žádné aktuality k zobrazení</p>;
  }

  return (
    <div className="space-y-6" id="newsSection">
      {news.map((n, index) => (
        <motion.div
          key={n._id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: index * 0.05 }}
        >
          <NewsCard item={n} user={user} onDelete={() => onDelete(n._id)} />
        </motion.div>
      ))}
    </div>
  );
}

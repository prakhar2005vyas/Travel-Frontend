console.log("Explore component loaded");
import { motion } from "framer-motion";
import { useState } from "react";

const places = [
  {
    id: 1,
    title: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  },
  {
    id: 2,
    title: "Paris, France",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a",
  },
  {
    id: 3,
    title: "Dubai, UAE",
    image: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad",
  },
];

export default function Explore() {
  const [liked, setLiked] = useState({});

  const toggleLike = (id) => {
  console.log("clicked", id);   // 👈 ADD THIS LINE
  setLiked((prev) => ({
    ...prev,
    [id]: !prev[id],
  }));
};

 return (
  <motion.div
    className="p-10 bg-[#fafafa] mt-24"
    initial={{ opacity: 0, y: 80 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
    viewport={{ once: true , amount: 0.4}}
  >
    <h2 className="text-2xl font-semibold mb-6">
      Explore Destinations
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {places.map((place) => (
        <motion.div
          key={place.id}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: place.id * 0.2 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05, y: -5 }}
          className="relative rounded-2xl overflow-hidden group cursor-pointer"
        >
          <img
            src={place.image}
            className="h-72 w-full object-cover"
          />

          {/* ❤️ LIKE BUTTON */}
         <motion.button
            whileTap={{ scale: 1.3 }}
            onClick={(e) => {
                e.stopPropagation();
                toggleLike(place.id);
            }}
            className={`absolute top-4 right-4 text-2xl transition ${
                liked[place.id] ? "scale-110" : ""
            }`}
            >
            {liked[place.id] ? "❤️" : "🤍"}
            </motion.button>

          {/* overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4 pointer-events-none">
            <h3 className="text-white text-lg font-semibold">
              {place.title}
            </h3>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);
}
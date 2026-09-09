import { motion } from 'framer-motion';

export default function FormationCard({ title, image, category, duration, price }) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow flex flex-col"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          loading="lazy"
        />
        <div className="absolute top-4 left-4">
          <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
            category === 'coaching' 
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
          }`}>
            {category === 'coaching' ? 'Coaching' : 'Formation'}
          </span>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-2xl font-bold mb-2 text-accent dark:text-white">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Durée : {duration}</p>
        {price && <p className="text-lg font-semibold text-primary dark:text-red-400 mb-4">{price}</p>}
        <a
          href={`https://wa.me/2290152431717?text=${encodeURIComponent('Bonjour, je suis intéressé par : ' + title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center gap-2 text-primary dark:text-red-400 font-semibold hover:underline"
        >
          Demander des infos
        </a>
      </div>
    </motion.div>
  );
}
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ServiceCard({ icon: Icon, title, description, image, link, linkText }) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-4 left-4 bg-primary text-white p-2 rounded-full">
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-2xl font-bold mb-2 text-accent dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 flex-1">{description}</p>
        <Link
          to={link}
          className="mt-4 inline-flex items-center gap-2 text-primary dark:text-red-400 font-semibold hover:underline"
        >
          {linkText || 'En savoir plus'} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}
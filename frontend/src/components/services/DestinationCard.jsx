import { Link } from 'react-router-dom';

export default function DestinationCard({ name, image, desc }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition">
      <img
        src={image}
        alt={name}
        className="w-full h-64 md:h-72 object-cover"
        loading="lazy"
      />
      <div className="p-5">
        <h3 className="font-semibold text-xl mb-2 text-accent dark:text-white">{name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{desc}</p>
        <Link to="/rdv" className="text-primary dark:text-red-400 text-sm font-medium hover:underline">
          Demander un visa
        </Link>
      </div>
    </div>
  );
}
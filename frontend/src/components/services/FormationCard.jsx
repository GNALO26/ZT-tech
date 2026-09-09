export default function FormationCard({ title, image, category, duration }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition">
      <img src={image} alt={title} className="w-full h-40 object-cover" loading="lazy" />
      <div className="p-4">
        <span className={`inline-block text-xs font-semibold px-2 py-1 rounded-full mb-2 ${category === 'coaching' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'}`}>
          {category === 'coaching' ? 'Coaching' : 'Formation'}
        </span>
        <h3 className="font-semibold text-lg mb-1 text-accent dark:text-white">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Durée : {duration}</p>
        <a href="https://wa.me/2290152431717?text=Bonjour, je suis intéressé par : {title}" target="_blank" rel="noopener noreferrer" className="text-primary dark:text-red-400 text-sm font-medium hover:underline">
          Demander des infos
        </a>
      </div>
    </div>
  );
}
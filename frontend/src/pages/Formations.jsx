import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { getFormations } from '../services/formationService';
import FormationCard from '../components/services/FormationCard';

export default function Formations() {
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    setLoading(true);
    getFormations(category)
      .then(res => setFormations(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-4 py-10">
      <Helmet>
        <title>Formations & Coaching | ZT-Voyage</title>
        <meta name="description" content="Formations et coaching personnalisés pour vos démarches de visa et vos compétences." />
      </Helmet>

      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Formations & Coaching</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">Développez vos compétences et préparez vos projets.</p>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <button onClick={() => setCategory('all')} className={`px-4 py-2 rounded-full ${category === 'all' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>Tous</button>
        <button onClick={() => setCategory('formation')} className={`px-4 py-2 rounded-full ${category === 'formation' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>Formations</button>
        <button onClick={() => setCategory('coaching')} className={`px-4 py-2 rounded-full ${category === 'coaching' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>Coaching</button>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : formations.length === 0 ? (
        <p className="text-center text-gray-500">Aucune formation disponible pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {formations.map(f => (
            <FormationCard key={f._id} title={f.title} image={f.image_url} category={f.category} duration={f.duration} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
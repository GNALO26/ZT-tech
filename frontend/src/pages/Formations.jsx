import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { getFormations } from '../services/formationService';
import FormationCard from '../components/services/FormationCard';
import { Link } from 'react-router-dom';

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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen">
      <Helmet>
        <title>Formations & Coaching | ZT-Voyage</title>
        <meta name="description" content="Formations et coaching personnalisés pour vos démarches de visa et vos compétences." />
      </Helmet>

      {/* Hero */}
      <section className="py-20 bg-gradient-to-r from-primary to-red-800 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Formations & Coaching</h1>
          <p className="text-xl md:text-2xl">Développez vos compétences et préparez vos projets.</p>
        </div>
      </section>

      {/* Filtres */}
      <section className="py-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 flex justify-center gap-4 flex-wrap">
          <button onClick={() => setCategory('all')} className={`px-4 py-2 rounded-full ${category === 'all' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>Tous</button>
          <button onClick={() => setCategory('formation')} className={`px-4 py-2 rounded-full ${category === 'formation' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>Formations</button>
          <button onClick={() => setCategory('coaching')} className={`px-4 py-2 rounded-full ${category === 'coaching' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>Coaching</button>
        </div>
      </section>

      {/* Liste formations */}
      <section className="py-12 bg-light dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <p className="text-center">Chargement...</p>
          ) : formations.length === 0 ? (
            <p className="text-center text-gray-500">Aucune formation disponible pour le moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {formations.map(f => (
                <FormationCard key={f._id} title={f.title} image={f.image_url} category={f.category} duration={f.duration} price={f.price} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Coaching */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-accent dark:text-white">Besoin d'un coaching personnalisé ?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">Nos experts vous accompagnent individuellement pour maximiser vos chances de réussite.</p>
          <Link to="/coaching" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-red-700 transition">
            Découvrir le coaching
          </Link>
        </div>
      </section>
    </motion.div>
  );
}
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ArrowRight } from 'lucide-react';

export default function Coaching() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto px-4 py-10">
      <Helmet>
        <title>Coaching personnalisé | ZT-Voyage</title>
        <meta name="description" content="Bénéficiez d'un coaching sur mesure pour vos démarches de visa, études ou voyages." />
      </Helmet>
      <h1 className="text-4xl font-bold mb-6">Coaching personnalisé</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
        Notre programme de coaching vous accompagne étape par étape dans vos démarches, avec un suivi individuel et des conseils d'experts.
      </p>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Ce que vous obtenez</h2>
        <ul className="space-y-3 text-gray-700 dark:text-gray-300">
          <li>✅ Analyse personnalisée de votre situation</li>
          <li>✅ Préparation complète de votre dossier</li>
          <li>✅ Simulations d'entretien consulaire</li>
          <li>✅ Conseils pour maximiser vos chances</li>
          <li>✅ Accès prioritaire à notre équipe</li>
        </ul>
      </div>
      <div className="text-center">
        <a
          href="https://wa.me/2290152431717?text=Bonjour, je souhaite un coaching personnalisé."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-red-700 transition"
        >
          Demander un coaching <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
}
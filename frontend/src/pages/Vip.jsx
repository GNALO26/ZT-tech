import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Crown, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Vip() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto px-4 py-10">
      <Helmet>
        <title>Espace VIP | ZT-Voyage</title>
        <meta name="description" content="Rejoignez notre espace VIP pour un accompagnement exclusif et prioritaire." />
      </Helmet>
      <div className="text-center mb-10">
        <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-4">Espace VIP</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">Un service exclusif pour ceux qui veulent un accompagnement total.</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Avantages VIP</h2>
        <ul className="space-y-3 text-gray-700 dark:text-gray-300">
          {[
            'Suivi individuel par un expert dédié',
            'Réponses prioritaires sur WhatsApp',
            'Coaching intensif avant entretien',
            'Assistance complète de A à Z',
            'Accès à des ressources exclusives',
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-yellow-500 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="text-center">
        <a
          href="https://wa.me/2290152431717?text=Bonjour, je veux rejoindre l'espace VIP et avoir plus de renseignements."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-yellow-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-yellow-600 transition"
        >
          Rejoindre le VIP <ArrowRight className="w-4 h-4" />
        </a>
        <p className="mt-4 text-sm text-gray-500">Cliquez pour ouvrir WhatsApp et discuter avec nous.</p>
      </div>
    </motion.div>
  );
}
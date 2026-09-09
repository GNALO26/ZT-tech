import { motion } from 'framer-motion';
import { Globe, Award, Target, Users, MapPin, Phone, Mail, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function About() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-4 py-12">
      <Helmet>
        <title>À propos | ZT-Voyage</title>
        <meta name="description" content="Découvrez ZT-Voyage, votre partenaire pour les visas, études et voyages." />
      </Helmet>

      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">À propos de ZT‑Voyage</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Nous simplifions vos démarches de visa, d'études et de voyage depuis Cotonou, avec un accompagnement sur mesure.
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {[
          { icon: Globe, label: '15+ destinations', desc: 'Pays accessibles' },
          { icon: Users, label: '2000+ clients', desc: 'Accompagnés avec succès' },
          { icon: Award, label: 'Agrément officiel', desc: 'Reconnu par les autorités' },
          { icon: Target, label: '98% de réussite', desc: 'Dossiers acceptés' },
        ].map((item, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center">
            <item.icon className="w-10 h-10 text-primary mx-auto mb-3" />
            <p className="text-2xl font-bold text-accent dark:text-white">{item.label}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Mission et coordonnées */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-bold mb-4">Notre mission</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            ZT‑Voyage est née de la volonté de rendre les démarches administratives accessibles à tous. Nous accompagnons les Béninois dans leurs projets de mobilité internationale, que ce soit pour le tourisme, les études ou le travail.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Notre équipe de professionnels maîtrise les procédures consulaires et vous garantit un suivi personnalisé, de la préparation du dossier jusqu'à l'obtention du visa.
          </p>
          <Link to="/services" className="mt-6 inline-flex items-center gap-2 text-primary dark:text-red-400 font-semibold hover:underline">
            Découvrir nos services <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Nos coordonnées</h3>
          <p className="flex items-center gap-2 mb-2"><MapPin className="w-5 h-5 text-primary" /> Cotonou, Quartier Zongo</p>
          <p className="flex items-center gap-2 mb-2"><Phone className="w-5 h-5 text-primary" /> +229 01 52 43 17 17</p>
          <p className="flex items-center gap-2"><Mail className="w-5 h-5 text-primary" /> contact@zt-voyage.com</p>
        </div>
      </div>
    </motion.div>
  );
}
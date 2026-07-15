import { motion } from 'framer-motion';
import { Users, Globe, Award, Target } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const team = [
  { name: 'Jean Z.', role: 'Fondateur', image: '/images/team1.jpg' },
  { name: 'Marie T.', role: 'Responsable Visa', image: '/images/team2.jpg' },
  { name: 'Paul A.', role: 'Conseiller études', image: '/images/team3.jpg' },
];

export default function About() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-4 py-10">
      <Helmet>
        <title>À propos | ZT Technologies</title>
        <meta name="description" content="Découvrez ZT Technologies, votre partenaire pour les visas, études et voyages." />
      </Helmet>
      <h1 className="text-3xl font-bold mb-8 text-center">À propos de ZT Technologies</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Notre mission</h2>
          <p className="text-gray-600">Nous accompagnons les Béninois dans leurs démarches de visa, d'études et de voyage à l'international, en simplifiant les processus administratifs et en offrant un suivi personnalisé.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[{ icon: Globe, label: '10+ destinations' }, { icon: Users, label: '500+ clients satisfaits' }, { icon: Award, label: 'Agrément officiel' }, { icon: Target, label: '100% de réussite' }].map((item, i) => (
            <div key={i} className="bg-white p-4 rounded-xl shadow text-center">
              <item.icon className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
      <h2 className="text-2xl font-semibold mb-6 text-center">Notre équipe</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member, i) => (
          <motion.div key={i} whileHover={{ scale: 1.02 }} className="bg-white rounded-xl shadow overflow-hidden">
            <img src={member.image} alt={member.name} className="w-full h-56 object-cover" />
            <div className="p-4 text-center">
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-gray-500">{member.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
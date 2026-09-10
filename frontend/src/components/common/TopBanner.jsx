import { motion } from 'framer-motion';
import { Megaphone, X } from 'lucide-react';
import { useState } from 'react';

const messages = [
  '✈️ Visa Canada – 20 places disponibles',
  '🚗 Location de voiture disponible à partir de 25 000 FCFA/jour',
  '🎓 Formation informatique – Inscriptions ouvertes',
  '🌟 Espace VIP : accompagnement prioritaire',
];

export default function TopBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [index, setIndex] = useState(0);

  if (!isVisible) return null;

  // Rotation des messages
  setInterval(() => setIndex(i => (i + 1) % messages.length), 5000);

  return (
    <motion.div
      initial={{ y: -40 }}
      animate={{ y: 0 }}
      className="bg-gradient-to-r from-primary via-red-600 to-primary text-white text-sm py-2 px-4 flex items-center justify-between relative z-30"
    >
      <div className="flex items-center gap-2 flex-1">
        <Megaphone className="w-4 h-4 flex-shrink-0" />
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="truncate"
        >
          {messages[index]}
        </motion.span>
      </div>
      <button onClick={() => setIsVisible(false)} className="text-white/80 hover:text-white" aria-label="Fermer">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
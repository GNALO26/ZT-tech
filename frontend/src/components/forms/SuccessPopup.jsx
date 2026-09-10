import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Car, GraduationCap, Users, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SuccessPopup({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 40 }}
            transition={{ type: 'spring', stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-lg w-full p-6 relative overflow-hidden"
          >
            {/* Bande décorative */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-red-400 to-yellow-500" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mt-3 mb-6">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1, delay: 0.3 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-red-500 rounded-full mb-4 shadow-lg"
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-accent dark:text-white mb-2">
                Félicitations !
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Votre rendez-vous est confirmé et un email contenant votre document PDF vient de vous être envoyé.
              </p>
              <div className="mt-3 inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm">
                <Mail className="w-4 h-4" /> Vérifiez votre boîte de réception
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-5 mb-4">
              <h3 className="font-semibold text-accent dark:text-white mb-3 text-sm uppercase tracking-wide">
                Découvrez aussi sur ZT-Voyage
              </h3>
              <div className="space-y-3">
                <Link
                  to="/services"
                  onClick={onClose}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition group"
                >
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Car className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-accent dark:text-white">Location de voiture</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Déplacez-vous en toute liberté</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition" />
                </Link>

                <Link
                  to="/formations"
                  onClick={onClose}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition group"
                >
                  <div className="w-11 h-11 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-accent dark:text-white">Formations & Coaching</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Développez vos compétences</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition" />
                </Link>

                <Link
                  to="/vip"
                  onClick={onClose}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition group"
                >
                  <div className="w-11 h-11 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-accent dark:text-white">Espace VIP</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Accompagnement prioritaire</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition" />
                </Link>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-primary text-white py-3 rounded-2xl font-semibold hover:bg-red-700 transition shadow-md"
            >
              Merci, j'ai compris
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
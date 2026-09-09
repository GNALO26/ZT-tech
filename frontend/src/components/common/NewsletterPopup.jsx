import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2 } from 'lucide-react';
import { subscribeNewsletter } from '../../services/newsletterService';

export default function NewsletterPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // 'loading', 'success', 'error'

  useEffect(() => {
    const timer = setTimeout(() => {
      // Ne pas afficher si déjà fermé ou si déjà abonné (localStorage)
      const hasSubscribed = localStorage.getItem('newsletter_subscribed');
      if (!hasSubscribed) {
        setIsVisible(true);
      }
    }, 60000); // 60 secondes

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await subscribeNewsletter(email);
      localStorage.setItem('newsletter_subscribed', 'true');
      setStatus('success');
      setTimeout(() => setIsVisible(false), 2000);
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
          >
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-accent dark:text-white mb-2">
                Restez informé !
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Abonnez-vous à notre newsletter pour recevoir nos actualités, offres et conseils exclusifs.
              </p>
            </div>

            {status === 'success' ? (
              <div className="text-center py-4">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <p className="text-green-600 font-medium">Merci ! Vous êtes abonné.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre email"
                    className="flex-1 border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-primary text-white p-2 rounded-full hover:bg-red-700 transition"
                    aria-label="S'abonner"
                    disabled={status === 'loading'}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                {status === 'error' && (
                  <p className="text-red-500 text-sm mt-2 text-center">Une erreur est survenue, réessayez.</p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                  Vous pouvez vous désabonner à tout moment.
                </p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
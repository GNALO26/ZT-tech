import { useState } from 'react';
import { Send } from 'lucide-react';
import { subscribeNewsletter } from '../../services/newsletterService';

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await subscribeNewsletter(email);

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'form_submit', {
          form_name: 'newsletter_form',
          event_category: 'conversion',
          event_label: 'Abonnement newsletter',
          value: 1,
        });
      }

      setStatus('success');
      setEmail('');
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold mb-2 dark:text-white">Restez informé</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">Recevez nos derniers articles et offres par email.</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Votre email"
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        <button type="submit" className="bg-primary text-white p-2 rounded-lg hover:bg-red-700 transition" aria-label="S'abonner">
          <Send className="w-4 h-4" />
        </button>
      </form>
      {status === 'success' && <p className="text-green-500 text-sm mt-2">Abonnement réussi !</p>}
      {status === 'error' && <p className="text-red-500 text-sm mt-2">Erreur, veuillez réessayer.</p>}
    </div>
  );
}
import { Facebook, Instagram, MapPin, Phone, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { subscribeNewsletter } from '../../services/newsletterService';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await subscribeNewsletter(email);
      setStatus('success');
      setEmail('');
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <footer className="bg-accent dark:bg-gray-950 text-light py-10" aria-label="Pied de page">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4 text-white">ZT-Voyage</h3>
          <p className="text-gray-400 dark:text-gray-300">Votre partenaire pour les visas, études, voyages et formations.</p>
          <div className="flex gap-4 mt-4">
            <Link to="/mentions-legales" className="text-gray-400 hover:text-primary dark:hover:text-white text-sm transition">Mentions légales</Link>
            <Link to="/politique-de-confidentialite" className="text-gray-400 hover:text-primary dark:hover:text-white text-sm transition">Politique de confidentialité</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-white">Liens utiles</h4>
          <nav aria-label="Navigation secondaire" className="space-y-2">
            <Link to="/rdv" className="block text-gray-400 hover:text-primary dark:hover:text-white transition">Prendre rendez-vous</Link>
            <Link to="/blog" className="block text-gray-400 hover:text-primary dark:hover:text-white transition">Blog</Link>
            <Link to="/formations" className="block text-gray-400 hover:text-primary dark:hover:text-white transition">Formations & Coaching</Link>
            <Link to="/vip" className="block text-gray-400 hover:text-primary dark:hover:text-white transition">Espace VIP</Link>
            <Link to="/contact" className="block text-gray-400 hover:text-primary dark:hover:text-white transition">Contact</Link>
          </nav>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-white">Contact</h4>
          <address className="not-italic space-y-2 text-gray-400 dark:text-gray-300">
            <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Cotonou, Quartier Zongo</p>
            <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> +229 01 52 43 17 17</p>
            <div className="flex gap-4 mt-3">
              <a href="#" aria-label="Facebook"><Facebook className="w-5 h-5 hover:text-primary dark:hover:text-white transition" /></a>
              <a href="#" aria-label="Instagram"><Instagram className="w-5 h-5 hover:text-primary dark:hover:text-white transition" /></a>
            </div>
          </address>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-white">Newsletter</h4>
          <p className="text-sm text-gray-400 mb-3">Recevez nos actualités et offres.</p>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre email"
              className="flex-1 border border-gray-600 dark:border-gray-500 rounded-lg px-3 py-2 bg-transparent text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <button type="submit" className="bg-primary text-white p-2 rounded-lg hover:bg-red-700 transition" aria-label="S'abonner">
              <Send className="w-4 h-4" />
            </button>
          </form>
          {status === 'success' && <p className="text-green-400 text-sm mt-2">Merci ! Vous êtes abonné.</p>}
          {status === 'error' && <p className="text-red-400 text-sm mt-2">Erreur, réessayez.</p>}
        </div>
      </div>
    </footer>
  );
}
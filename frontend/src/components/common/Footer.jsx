import { Facebook, Instagram, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-accent dark:bg-gray-950 text-light py-10" aria-label="Pied de page">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">ZT-Voyage</h3>
          <p className="text-gray-400 dark:text-gray-300">Votre partenaire pour les visas, études et voyages.</p>
          <div className="flex gap-4 mt-4">
            <Link to="/mentions-legales" className="text-gray-400 hover:text-primary dark:hover:text-white text-sm transition">Mentions légales</Link>
            <Link to="/politique-de-confidentialite" className="text-gray-400 hover:text-primary dark:hover:text-white text-sm transition">Politique de confidentialité</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-white dark:text-gray-100">Liens utiles</h4>
          <nav aria-label="Navigation secondaire">
            <ul className="space-y-2">
              <li><Link to="/rdv" className="text-gray-400 hover:text-primary dark:hover:text-white transition">Prendre rendez-vous</Link></li>
              <li><Link to="/blog" className="text-gray-400 hover:text-primary dark:hover:text-white transition">Blog</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-primary dark:hover:text-white transition">Services</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-primary dark:hover:text-white transition">Contact</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-primary dark:hover:text-white transition">À propos</Link></li>
            </ul>
          </nav>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-white dark:text-gray-100">Contact</h4>
          <address className="not-italic space-y-2 text-gray-400 dark:text-gray-300">
            <p className="flex items-center gap-2"><MapPin className="w-4 h-4" aria-hidden="true" /> Cotonou, Quartier Zongo</p>
            <p className="flex items-center gap-2"><Phone className="w-4 h-4" aria-hidden="true" /> +229 52 43 17 17</p>
            <div className="flex gap-4 mt-3">
              <a href="#" aria-label="Facebook"><Facebook className="w-5 h-5 hover:text-primary dark:hover:text-white transition" /></a>
              <a href="#" aria-label="Instagram"><Instagram className="w-5 h-5 hover:text-primary dark:hover:text-white transition" /></a>
            </div>
          </address>
        </div>
      </div>
    </footer>
  );
}
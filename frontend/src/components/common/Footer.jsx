import { Facebook, Instagram, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-accent text-light py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">ZT-Voyage</h3>
          <p className="text-gray-400">Votre partenaire pour les visas, études et voyages.</p>
          <div className="flex gap-4 mt-4">
            <Link to="/mentions-legales" className="text-gray-400 hover:text-primary text-sm transition">Mentions légales</Link>
            <Link to="/politique-de-confidentialite" className="text-gray-400 hover:text-primary text-sm transition">Politique de confidentialité</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-white">Liens utiles</h4>
          <nav className="space-y-2">
            <Link to="/rdv" className="block text-gray-400 hover:text-primary transition">Prendre rendez-vous</Link>
            <Link to="/blog" className="block text-gray-400 hover:text-primary transition">Blog</Link>
            <Link to="/services" className="block text-gray-400 hover:text-primary transition">Services</Link>
            <Link to="/contact" className="block text-gray-400 hover:text-primary transition">Contact</Link>
            <Link to="/about" className="block text-gray-400 hover:text-primary transition">À propos</Link>
          </nav>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-white">Contact</h4>
          <div className="space-y-2 text-gray-400">
            <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Cotonou, Quartier Zongo</p>
            <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> +229 52 43 17 17</p>
            <div className="flex gap-4 mt-3">
              <a href="#" aria-label="Facebook"><Facebook className="w-5 h-5 hover:text-primary transition" /></a>
              <a href="#" aria-label="Instagram"><Instagram className="w-5 h-5 hover:text-primary transition" /></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
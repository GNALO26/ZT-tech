import { Link } from 'react-router-dom';
import { Plane, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-md fixed w-full z-20">
      <div className="max-w-7xl mx-auto px-4 py-2 md:py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-primary font-bold text-lg md:text-xl">
          <img src="/logo.png" alt="ZT Technologies" className="h-8 w-auto md:h-10" />
          ZT Technologies et Voyages
        </Link>

        <nav className="hidden md:flex gap-6 text-gray-700 font-medium" role="navigation" aria-label="Menu principal">
          <Link to="/" className="hover:text-primary transition">Accueil</Link>
          <Link to="/rdv" className="hover:text-primary transition">Rendez-vous</Link>
          <Link to="/blog" className="hover:text-primary transition">Blog</Link>
          <Link to="/about" className="hover:text-primary transition">À propos</Link>
          <Link to="/contact" className="hover:text-primary transition">Contact</Link>
        </nav>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label="Menu mobile">
          {isOpen ? <X className="w-6 h-6 text-primary" /> : <Menu className="w-6 h-6 text-primary" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t px-4 py-2 space-y-2">
          <Link to="/" className="block py-1 hover:text-primary transition" onClick={() => setIsOpen(false)}>Accueil</Link>
          <Link to="/rdv" className="block py-1 hover:text-primary transition" onClick={() => setIsOpen(false)}>Rendez-vous</Link>
          <Link to="/blog" className="block py-1 hover:text-primary transition" onClick={() => setIsOpen(false)}>Blog</Link>
          <Link to="/about" className="block py-1 hover:text-primary transition" onClick={() => setIsOpen(false)}>À propos</Link>
          <Link to="/contact" className="block py-1 hover:text-primary transition" onClick={() => setIsOpen(false)}>Contact</Link>
        </div>
      )}
    </header>
  );
}
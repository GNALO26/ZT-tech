import { Link } from 'react-router-dom';
import { Plane, Menu, X, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setDark(!dark);
    if (!dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md fixed w-full z-20">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-primary dark:text-white font-bold text-xl" aria-label="Page d'accueil ZT-Voyage">
          <Plane className="w-6 h-6" />
          ZT-Voyage
        </Link>

        <nav className="hidden md:flex gap-6 text-gray-700 dark:text-gray-300 font-medium" role="navigation" aria-label="Menu principal">
          <Link to="/" className="hover:text-primary dark:hover:text-white transition">Accueil</Link>
          <Link to="/rdv" className="hover:text-primary dark:hover:text-white transition">Rendez-vous</Link>
          <Link to="/blog" className="hover:text-primary dark:hover:text-white transition">Blog</Link>
          <Link to="/services" className="hover:text-primary dark:hover:text-white transition">Services</Link>
          <Link to="/about" className="hover:text-primary dark:hover:text-white transition">À propos</Link>
          <Link to="/contact" className="hover:text-primary dark:hover:text-white transition">Contact</Link>
        </nav>

        <div className="flex items-center gap-4">
          {/* Basculement mode sombre */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:ring-2 ring-primary transition"
            aria-label={dark ? 'Passer en mode clair' : 'Passer en mode sombre'}
          >
            {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Menu mobile */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <nav className="md:hidden bg-white dark:bg-gray-900 border-t px-4 py-2 space-y-2" aria-label="Menu mobile">
          <Link to="/" className="block py-1 dark:text-gray-200" onClick={() => setIsOpen(false)}>Accueil</Link>
          <Link to="/rdv" className="block py-1 dark:text-gray-200" onClick={() => setIsOpen(false)}>Rendez-vous</Link>
          <Link to="/blog" className="block py-1 dark:text-gray-200" onClick={() => setIsOpen(false)}>Blog</Link>
          <Link to="/services" className="block py-1 dark:text-gray-200" onClick={() => setIsOpen(false)}>Services</Link>
          <Link to="/about" className="block py-1 dark:text-gray-200" onClick={() => setIsOpen(false)}>À propos</Link>
          <Link to="/contact" className="block py-1 dark:text-gray-200" onClick={() => setIsOpen(false)}>Contact</Link>
        </nav>
      )}
    </header>
  );
}
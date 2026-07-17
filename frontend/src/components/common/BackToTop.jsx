import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggle = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', toggle);
    return () => window.removeEventListener('scroll', toggle);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    visible && (
      <button
        onClick={scrollToTop}
        className="fixed bottom-24 right-6 z-40 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition"
        aria-label="Retour en haut"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    )
  );
}
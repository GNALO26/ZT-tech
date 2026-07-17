import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <Helmet>
        <title>Page introuvable | ZT-Voyage</title>
      </Helmet>
      <div className="text-8xl font-bold text-primary mb-4">404</div>
      <h1 className="text-3xl font-bold mb-2">Page introuvable</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        La page que vous cherchez a peut-être été déplacée, supprimée ou n'a jamais existé.
      </p>
      <div className="flex gap-4">
        <Link 
          to="/" 
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
        >
          <Home className="w-4 h-4" /> Accueil
        </Link>
        <Link 
          to="/blog" 
          className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
        >
          <Search className="w-4 h-4" /> Blog
        </Link>
      </div>
    </div>
  );
}
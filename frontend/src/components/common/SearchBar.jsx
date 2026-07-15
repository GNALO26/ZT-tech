import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await api.get(`/articles?search=${encodeURIComponent(query)}`);
        setResults(res.data.articles || []);
        setShowDropdown(true);
      } catch (err) {
        console.error(err);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  return (
    <div className="relative w-full max-w-md">
      <div className="flex items-center border border-gray-300 rounded-full bg-white overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-primary">
        <Search className="w-5 h-5 ml-3 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un article..."
          className="w-full p-3 outline-none text-sm"
          onFocus={() => results.length > 0 && setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          aria-label="Rechercher un article"
        />
        {query && (
          <button onClick={() => setQuery('')} className="mr-3" aria-label="Effacer la recherche">
            <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
          </button>
        )}
      </div>
      {showDropdown && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border z-50 max-h-60 overflow-y-auto">
          {results.length === 0 && query.length >= 2 && (
            <p className="p-3 text-sm text-gray-500">Aucun résultat trouvé.</p>
          )}
          {results.map((article) => (
            <Link
              key={article._id || article.id}
              to={`/blog/${article.slug}`}
              className="block p-3 hover:bg-blue-50 text-sm text-gray-700 transition"
            >
              {article.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
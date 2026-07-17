import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Calendar, Search } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Reactions from '../components/blog/Reactions';

export default function Blog() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('recent'); // 'recent' ou 'oldest'

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await api.get(`/articles?search=${encodeURIComponent(searchTerm)}`);
        let sorted = res.data.articles || [];
        if (sortOrder === 'recent') {
          sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else {
          sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }
        setArticles(sorted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [searchTerm, sortOrder]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-4 py-10">
      <Helmet>
        <title>Blog | ZT-Voyage</title>
        <meta name="description" content="Actualités et conseils sur les visas, études et voyages." />
      </Helmet>

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold dark:text-white">Blog</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded-full pl-10 pr-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white w-64 focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="recent">Plus récents</option>
            <option value="oldest">Plus anciens</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="dark:text-gray-300">Chargement...</p>
      ) : articles.length === 0 ? (
        <p className="dark:text-gray-300">Aucun article trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => (
            <motion.div whileHover={{ scale: 1.02 }} key={article._id || article.slug} className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden flex flex-col">
              <Link to={`/blog/${article.slug}`}>
                <img src={article.featured_image_url || '/images/placeholder.jpg'} alt={article.title} className="w-full h-48 object-cover" />
              </Link>
              <div className="p-4 flex flex-col flex-1">
                <Link to={`/blog/${article.slug}`} className="font-semibold text-lg mb-2 dark:text-white hover:text-primary">{article.title}</Link>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <Calendar className="w-3 h-3 mr-1" /> {new Date(article.createdAt).toLocaleDateString()}
                </div>
                {article.content && (
                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3">
                    {article.content.replace(/<[^>]+>/g, '').substring(0, 100)}...
                  </p>
                )}
                <div className="mt-auto">
                  <Reactions articleId={article._id} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
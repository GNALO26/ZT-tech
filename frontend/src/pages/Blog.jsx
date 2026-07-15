import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Calendar } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function Blog() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/articles')
      .then(res => setArticles(res.data.articles || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-4 py-10">
      <Helmet>
        <title>Blog | ZT Technologies</title>
        <meta name="description" content="Actualités et conseils sur les visas, études et voyages." />
      </Helmet>
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => (
            <Link to={`/blog/${article.slug}`} key={article._id || article.id}>
              <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-xl shadow-md overflow-hidden">
                <img src={article.featured_image_url || '/images/placeholder.jpg'} alt={article.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h2 className="font-semibold text-lg mb-2">{article.title}</h2>
                  <div className="flex items-center text-sm text-gray-500 gap-4">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(article.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
}
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2 } from 'lucide-react';
import api from '../../services/api';
import { Helmet } from 'react-helmet-async';

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/articles')
      .then(res => setArticles(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cet article ?')) return;
    await api.delete(`/admin/articles/${id}`);
    setArticles(prev => prev.filter(a => a._id !== id));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Helmet><title>Articles | Admin</title></Helmet>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Articles</h1>
        <Link to="/admin/articles/new" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nouvel article
        </Link>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : articles.length === 0 ? (
        <p className="text-gray-500">Aucun article.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => (
            <div key={article._id} className="bg-white rounded-xl shadow overflow-hidden">
              <img src={article.featured_image_url || '/images/placeholder.jpg'} alt={article.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h2 className="font-semibold mb-2">{article.title}</h2>
                <p className="text-sm text-gray-500 mb-4">{new Date(article.createdAt).toLocaleDateString()}</p>
                <div className="flex gap-2">
                  <Link to={`/admin/articles/edit/${article._id}`} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg">
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button onClick={() => handleDelete(article._id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
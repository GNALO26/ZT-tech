import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import PrivateRoute from '../../components/common/PrivateRoute';
import RichTextEditor from '../../components/common/RichTextEditor';
import { Helmet } from 'react-helmet-async';

export default function ArticleEditor() {
  return (
    <PrivateRoute>
      <EditorContent />
    </PrivateRoute>
  );
}

function EditorContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    featuredImageUrl: '',
    metaTitle: '',
    metaDescription: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      api.get(`/admin/articles/${id}`)
        .then(res => {
          const article = res.data;
          setForm({
            title: article.title || '',
            slug: article.slug || '',
            content: article.content || '',
            featuredImageUrl: article.featured_image_url || '',
            metaTitle: article.meta_title || '',
            metaDescription: article.meta_description || '',
          });
        })
        .catch(() => alert('Article introuvable'))
        .finally(() => setFetching(false));
    }
  }, [id, isEditing]);

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isEditing) {
        await api.put(`/admin/articles/${id}`, form);
      } else {
        await api.post('/admin/articles', form);
      }
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'enregistrement.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="max-w-4xl mx-auto px-4 py-10">Chargement...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto px-4 py-8">
      <Helmet><title>{isEditing ? 'Modifier' : 'Nouvel'} article | Admin</title></Helmet>
      <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6">
        <ArrowLeft className="w-4 h-4" /> Retour au tableau de bord
      </button>
      <h1 className="text-2xl font-bold mb-6">{isEditing ? 'Modifier l\'article' : 'Nouvel article'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-xl shadow p-6">
        <div>
          <label className="block text-sm font-medium mb-1">Titre</label>
          <input type="text" className="w-full border rounded-lg p-3" value={form.title} onChange={e => updateField('title', e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input type="text" className="w-full border rounded-lg p-3" value={form.slug} onChange={e => updateField('slug', e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Contenu (HTML)</label>
          <RichTextEditor value={form.content} onChange={(val) => updateField('content', val)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">URL de l'image à la une</label>
          <input type="url" className="w-full border rounded-lg p-3" value={form.featuredImageUrl} onChange={e => updateField('featuredImageUrl', e.target.value)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Meta titre (SEO)</label>
            <input type="text" className="w-full border rounded-lg p-3" value={form.metaTitle} onChange={e => updateField('metaTitle', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Meta description</label>
            <input type="text" className="w-full border rounded-lg p-3" value={form.metaDescription} onChange={e => updateField('metaDescription', e.target.value)} />
          </div>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" disabled={loading} className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50">
          <Save className="w-4 h-4" />
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </form>
    </motion.div>
  );
}
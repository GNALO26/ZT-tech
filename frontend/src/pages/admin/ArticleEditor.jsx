import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Upload, X } from 'lucide-react';
import api from '../../services/api';
import RichTextEditor from '../../components/common/RichTextEditor';
import { Helmet } from 'react-helmet-async';

export default function ArticleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
  });
  const [image, setImage] = useState(null);  // Fichier à uploader
  const [imagePreview, setImagePreview] = useState('');
  const [existingImage, setExistingImage] = useState('');
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
            metaTitle: article.meta_title || '',
            metaDescription: article.meta_description || '',
          });
          setExistingImage(article.featured_image_url || '');
          setImagePreview(article.featured_image_url || '');
        })
        .catch(() => alert('Article introuvable'))
        .finally(() => setFetching(false));
    }
  }, [id, isEditing]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(existingImage || '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('slug', form.slug);
      formData.append('content', form.content);
      formData.append('metaTitle', form.metaTitle);
      formData.append('metaDescription', form.metaDescription);
      if (image) {
        formData.append('featured_image', image);
      }

      if (isEditing) {
        await api.put(`/admin/articles/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/admin/articles', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      navigate('/admin/articles');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'enregistrement.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="max-w-4xl mx-auto p-6">Chargement...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
      <Helmet><title>{isEditing ? 'Modifier' : 'Nouvel'} article | Admin</title></Helmet>
      <button onClick={() => navigate('/admin/articles')} className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6">
        <ArrowLeft className="w-4 h-4" /> Retour aux articles
      </button>
      <h1 className="text-2xl font-bold mb-6">{isEditing ? 'Modifier l\'article' : 'Nouvel article'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-xl shadow p-6">
        <div>
          <label className="block text-sm font-medium mb-1">Titre</label>
          <input type="text" className="w-full border rounded-lg p-3" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input type="text" className="w-full border rounded-lg p-3" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Contenu</label>
          <RichTextEditor value={form.content} onChange={(val) => setForm({...form, content: val})} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Image à la une</label>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="featured_image" />
              <label htmlFor="featured_image" className="cursor-pointer inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200">
                <Upload className="w-4 h-4" /> Choisir une image
              </label>
              {image && (
                <button type="button" onClick={removeImage} className="ml-3 text-red-500 hover:text-red-700">
                  <X className="w-4 h-4 inline" /> Supprimer
                </button>
              )}
            </div>
            {imagePreview && (
              <img src={imagePreview} alt="Aperçu" className="h-24 w-24 object-cover rounded-lg border" />
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Meta titre (SEO)</label>
            <input type="text" className="w-full border rounded-lg p-3" value={form.metaTitle} onChange={e => setForm({...form, metaTitle: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Meta description</label>
            <input type="text" className="w-full border rounded-lg p-3" value={form.metaDescription} onChange={e => setForm({...form, metaDescription: e.target.value})} />
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
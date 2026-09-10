import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Upload, X, Bold, Italic, Underline, List, ListOrdered, Heading1, Heading2, Quote, Link2, Palette } from 'lucide-react';
import api from '../../services/api';
import { Helmet } from 'react-helmet-async';

const COLORS = [
  { name: 'Noir', value: '#111827' },
  { name: 'Rouge', value: '#DC2626' },
  { name: 'Bleu', value: '#2563EB' },
  { name: 'Vert', value: '#16A34A' },
  { name: 'Orange', value: '#EA580C' },
  { name: 'Violet', value: '#7C3AED' },
  { name: 'Rose', value: '#DB2777' },
  { name: 'Gris', value: '#6B7280' },
];

export default function ArticleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const textareaRef = useRef(null);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [existingImage, setExistingImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    if (isEditing) {
      api.get(`/admin/articles/${id}`)
        .then(res => {
          const a = res.data;
          setForm({
            title: a.title || '',
            slug: a.slug || '',
            content: a.content || '',
            metaTitle: a.meta_title || '',
            metaDescription: a.meta_description || '',
          });
          setExistingImage(a.featured_image_url || '');
          setImagePreview(a.featured_image_url || '');
        })
        .catch(() => alert('Article introuvable'))
        .finally(() => setFetching(false));
    }
  }, [id, isEditing]);

  // Insère du HTML autour de la sélection dans le textarea
  const insertHtml = (openTag, closeTag = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = form.content.substring(start, end);
    const newContent =
      form.content.substring(0, start) +
      openTag +
      (selected || 'texte') +
      (closeTag || openTag.replace('<', '</').replace(/>$/, '>')) +
      form.content.substring(end);
    setForm({ ...form, content: newContent });
    setTimeout(() => textarea.focus(), 0);
  };

  const insertColor = (color) => {
    insertHtml(`<span style="color:${color}">`, '</span>');
  };

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

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('slug', form.slug);
    formData.append('content', form.content);
    formData.append('metaTitle', form.metaTitle);
    formData.append('metaDescription', form.metaDescription);
    if (image) formData.append('featured_image', image);

    try {
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto">
      <Helmet><title>{isEditing ? 'Modifier' : 'Nouvel'} article | Admin</title></Helmet>

      <button onClick={() => navigate('/admin/articles')} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary mb-6">
        <ArrowLeft className="w-4 h-4" /> Retour aux articles
      </button>

      <h1 className="text-2xl font-bold mb-6 dark:text-white">
        {isEditing ? 'Modifier l\'article' : 'Nouvel article'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">Titre</label>
            <input
              type="text"
              className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">Slug</label>
            <input
              type="text"
              className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={form.slug}
              onChange={e => setForm({ ...form, slug: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Éditeur avec barre d'outils */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium dark:text-gray-200">Contenu</label>
            <button
              type="button"
              onClick={() => setPreview(!preview)}
              className="text-xs text-primary hover:underline"
            >
              {preview ? 'Voir le code' : 'Voir l\'aperçu'}
            </button>
          </div>

          {/* Barre d'outils */}
          {!preview && (
            <div className="border border-b-0 rounded-t-lg bg-gray-50 dark:bg-gray-700 p-2 flex flex-wrap gap-1 items-center">
              <button type="button" onClick={() => insertHtml('<strong>', '</strong>')} title="Gras" className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"><Bold className="w-4 h-4" /></button>
              <button type="button" onClick={() => insertHtml('<em>', '</em>')} title="Italique" className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"><Italic className="w-4 h-4" /></button>
              <button type="button" onClick={() => insertHtml('<u>', '</u>')} title="Souligné" className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"><Underline className="w-4 h-4" /></button>
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
              <button type="button" onClick={() => insertHtml('<h1>', '</h1>')} title="Titre 1" className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"><Heading1 className="w-4 h-4" /></button>
              <button type="button" onClick={() => insertHtml('<h2>', '</h2>')} title="Titre 2" className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"><Heading2 className="w-4 h-4" /></button>
              <button type="button" onClick={() => insertHtml('<blockquote>', '</blockquote>')} title="Citation" className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"><Quote className="w-4 h-4" /></button>
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
              <button type="button" onClick={() => insertHtml('<ul>\n  <li>', '</li>\n</ul>')} title="Liste à puces" className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"><List className="w-4 h-4" /></button>
              <button type="button" onClick={() => insertHtml('<ol>\n  <li>', '</li>\n</ol>')} title="Liste numérotée" className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"><ListOrdered className="w-4 h-4" /></button>
              <button type="button" onClick={() => { const url = prompt('URL du lien :'); if (url) insertHtml(`<a href="${url}" target="_blank">`, '</a>'); }} title="Lien" className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"><Link2 className="w-4 h-4" /></button>
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
              <Palette className="w-4 h-4 text-gray-500" />
              {COLORS.map(c => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => insertColor(c.value)}
                  title={c.name}
                  className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition"
                  style={{ backgroundColor: c.value }}
                />
              ))}
            </div>
          )}

          {preview ? (
            <div
              className="prose max-w-none border rounded-lg p-4 bg-white dark:bg-gray-900 dark:text-white min-h-[300px]"
              dangerouslySetInnerHTML={{ __html: form.content }}
            />
          ) : (
            <textarea
              ref={textareaRef}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows="15"
              className="w-full border rounded-b-lg p-3 font-mono text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Cliquez sur les boutons pour insérer du style, ou collez votre HTML ici..."
            />
          )}
        </div>

        {/* Image à la une */}
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-200">Image à la une</label>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="featured_image" />
              <label htmlFor="featured_image" className="cursor-pointer inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
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

        {/* SEO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">Meta titre (SEO)</label>
            <input
              type="text"
              className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={form.metaTitle}
              onChange={e => setForm({ ...form, metaTitle: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">Meta description</label>
            <input
              type="text"
              className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={form.metaDescription}
              onChange={e => setForm({ ...form, metaDescription: e.target.value })}
            />
          </div>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button type="submit" disabled={loading} className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-50">
          <Save className="w-4 h-4" />
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </form>
    </motion.div>
  );
}
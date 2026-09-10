import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, X, Save, Upload, Bold, Italic, Underline, List, ListOrdered, Heading1, Heading2, Quote, Link2, Palette } from 'lucide-react';
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

export default function FormationsAdmin() {
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(false);
  const textareaRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    category: 'formation',
    price: '',
    duration: '',
    image: null,
    image_url: '',
    imagePreview: '',
  });

  const fetchFormations = () => {
    setLoading(true);
    api.get('/admin/formations')
      .then(res => setFormations(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchFormations(); }, []);

  const resetForm = () => {
    setFormData({
      title: '', slug: '', description: '', category: 'formation',
      price: '', duration: '', image: null, image_url: '', imagePreview: '',
    });
    setEditing(null);
    setShowForm(false);
    setError('');
    setPreview(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file, imagePreview: URL.createObjectURL(file) }));
    }
  };

  const openEdit = (f) => {
    setEditing(f);
    setFormData({
      title: f.title || '',
      slug: f.slug || '',
      description: f.description || '',
      category: f.category || 'formation',
      price: f.price || '',
      duration: f.duration || '',
      image: null,
      image_url: f.image_url || '',
      imagePreview: f.image_url || '',
    });
    setShowForm(true);
    setError('');
  };

  // Insère du HTML autour de la sélection
  const insertHtml = (openTag, closeTag = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = formData.description.substring(start, end);
    const closing = closeTag || openTag.replace('<', '</').replace(/>$/, '>');
    const newContent =
      formData.description.substring(0, start) +
      openTag + (selected || 'texte') + closing +
      formData.description.substring(end);
    setFormData(prev => ({ ...prev, description: newContent }));
    setTimeout(() => textarea.focus(), 0);
  };

  const insertColor = (color) => insertHtml(`<span style="color:${color}">`, '</span>');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const data = new FormData();
    data.append('title', formData.title);
    data.append('slug', formData.slug);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('price', formData.price);
    data.append('duration', formData.duration);
    if (formData.image) data.append('image', formData.image);
    else if (formData.image_url) data.append('image_url', formData.image_url);

    try {
      if (editing) {
        await api.put(`/admin/formations/${editing._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/admin/formations', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      resetForm();
      fetchFormations();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'enregistrement.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette formation ?')) return;
    try {
      await api.delete(`/admin/formations/${id}`);
      fetchFormations();
    } catch (err) {
      alert('Erreur lors de la suppression.');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Helmet><title>Gestion Formations | Admin</title></Helmet>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Formations & Coaching</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition"
        >
          <Plus className="w-4 h-4" /> Nouvelle formation
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full p-6 my-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{editing ? 'Modifier' : 'Ajouter'} une formation</h2>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Titre</label>
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange}
                    className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Slug</label>
                  <input type="text" name="slug" value={formData.slug} onChange={handleInputChange}
                    className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                </div>
              </div>

              {/* Éditeur riche */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium dark:text-gray-200">Description</label>
                  <button type="button" onClick={() => setPreview(!preview)} className="text-xs text-primary hover:underline">
                    {preview ? 'Voir le code' : 'Voir l\'aperçu'}
                  </button>
                </div>

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
                      <button key={c.value} type="button" onClick={() => insertColor(c.value)} title={c.name}
                        className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition"
                        style={{ backgroundColor: c.value }} />
                    ))}
                  </div>
                )}

                {preview ? (
                  <div className="prose max-w-none border rounded-lg p-4 bg-white dark:bg-gray-900 dark:text-white min-h-[200px]"
                    dangerouslySetInnerHTML={{ __html: formData.description }} />
                ) : (
                  <textarea
                    ref={textareaRef}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="8"
                    className="w-full border rounded-b-lg p-3 font-mono text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Rédigez la description, ou cliquez sur les boutons pour insérer du style..."
                    required
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Catégorie</label>
                  <select name="category" value={formData.category} onChange={handleInputChange}
                    className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option value="formation">Formation</option>
                    <option value="coaching">Coaching</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Durée</label>
                  <input type="text" name="duration" value={formData.duration} onChange={handleInputChange}
                    className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Prix</label>
                  <input type="text" name="price" value={formData.price} onChange={handleInputChange}
                    className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm" />
                {formData.imagePreview && (
                  <img src={formData.imagePreview} alt="Aperçu" className="mt-2 h-32 w-32 object-cover rounded-lg border" />
                )}
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Annuler</button>
                <button type="submit" disabled={saving} className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2 disabled:opacity-50">
                  <Save className="w-4 h-4" /> {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {loading ? (
        <p>Chargement...</p>
      ) : formations.length === 0 ? (
        <p>Aucune formation.</p>
      ) : (
        <div className="space-y-4">
          {formations.map(f => (
            <div key={f._id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <img src={f.image_url || '/images/placeholder.jpg'} alt={f.title} className="w-16 h-16 object-cover rounded-lg" />
                <div>
                  <h2 className="font-semibold">{f.title}</h2>
                  <p className="text-sm text-gray-500">{f.category} - {f.duration}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(f)} className="text-blue-600"><Edit className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(f._id)} className="text-red-600"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
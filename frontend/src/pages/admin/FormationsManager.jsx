import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, RefreshCw, X, Save } from 'lucide-react';
import api from '../../services/api';
import { Helmet } from 'react-helmet-async';

export default function FormationsAdmin() {
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    category: 'formation',
    price: '',
    duration: '',
    image: null, // fichier
    image_url: '',
    imagePreview: ''
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

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
      title: '',
      slug: '',
      description: '',
      category: 'formation',
      price: '',
      duration: '',
      image: null,
      image_url: '',
      imagePreview: ''
    });
    setEditing(null);
    setShowForm(false);
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const openEdit = (formation) => {
    setEditing(formation);
    setFormData({
      title: formation.title || '',
      slug: formation.slug || '',
      description: formation.description || '',
      category: formation.category || 'formation',
      price: formation.price || '',
      duration: formation.duration || '',
      image: null,
      image_url: formation.image_url || '',
      imagePreview: formation.image_url || ''
    });
    setShowForm(true);
    setError('');
  };

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
    if (formData.image) {
      data.append('image', formData.image);
    } else if (formData.image_url) {
      data.append('image_url', formData.image_url);
    }

    try {
      if (editing) {
        await api.put(`/admin/formations/${editing._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/admin/formations', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
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

      {/* Formulaire modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{editing ? 'Modifier' : 'Ajouter'} une formation</h2>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Titre</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Catégorie</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="formation">Formation</option>
                    <option value="coaching">Coaching</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Durée</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Prix</label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-sm"
                />
                {formData.imagePreview && (
                  <img
                    src={formData.imagePreview}
                    alt="Aperçu"
                    className="mt-2 h-32 w-32 object-cover rounded-lg border"
                  />
                )}
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Liste */}
      {loading ? (
        <p>Chargement...</p>
      ) : formations.length === 0 ? (
        <p>Aucune formation.</p>
      ) : (
        <div className="space-y-4">
          {formations.map(f => (
            <div key={f._id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <img
                  src={f.image_url || '/images/placeholder.jpg'}
                  alt={f.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
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
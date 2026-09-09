import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import { Helmet } from 'react-helmet-async';

export default function FormationsAdmin() {
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFormations = () => {
    api.get('/admin/formations')
      .then(res => setFormations(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchFormations(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette formation ?')) return;
    await api.delete(`/admin/formations/${id}`);
    fetchFormations();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Helmet><title>Gestion Formations | Admin</title></Helmet>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Formations & Coaching</h1>
        <button onClick={() => alert('Fonctionnalité à venir')} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2"><Plus className="w-4 h-4" /> Nouvelle formation</button>
      </div>
      {loading ? <p>Chargement...</p> : formations.length === 0 ? <p>Aucune formation.</p> : (
        <div className="space-y-4">
          {formations.map(f => (
            <div key={f._id} className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
              <div>
                <h2 className="font-semibold">{f.title}</h2>
                <p className="text-sm text-gray-500">{f.category} - {f.duration}</p>
              </div>
              <div className="flex gap-2">
                <button className="text-blue-600"><Edit className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(f._id)} className="text-red-600"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
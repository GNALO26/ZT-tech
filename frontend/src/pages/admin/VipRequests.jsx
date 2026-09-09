import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import { Helmet } from 'react-helmet-async';

export default function VipAdmin() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = () => {
    api.get('/admin/vip-requests')
      .then(res => setRequests(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette demande ?')) return;
    await api.delete(`/admin/vip-requests/${id}`);
    fetchRequests();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Helmet><title>Demandes VIP | Admin</title></Helmet>
      <h1 className="text-3xl font-bold mb-6">Demandes VIP</h1>
      {loading ? <p>Chargement...</p> : requests.length === 0 ? <p>Aucune demande.</p> : (
        <div className="space-y-4">
          {requests.map(req => (
            <div key={req._id} className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">{req.name}</p>
                <p className="text-sm text-gray-500">{req.phone}</p>
                {req.message && <p className="text-sm text-gray-600">{req.message}</p>}
              </div>
              <button onClick={() => handleDelete(req._id)} className="text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
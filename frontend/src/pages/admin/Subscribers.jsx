import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import { Helmet } from 'react-helmet-async';

export default function SubscribersAdmin() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscribers = () => {
    api.get('/admin/subscribers')
      .then(res => setSubscribers(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchSubscribers(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cet abonné ?')) return;
    await api.delete(`/admin/subscribers/${id}`);
    fetchSubscribers();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Helmet><title>Abonnés | Admin</title></Helmet>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Abonnés newsletter</h1>
        <button onClick={fetchSubscribers} className="text-gray-500 hover:text-primary"><RefreshCw className="w-5 h-5" /></button>
      </div>
      {loading ? <p>Chargement...</p> : subscribers.length === 0 ? <p>Aucun abonné.</p> : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr><th className="p-3">Email</th><th className="p-3">Date</th><th className="p-3">Action</th></tr>
            </thead>
            <tbody>
              {subscribers.map(sub => (
                <tr key={sub._id} className="border-t">
                  <td className="p-3">{sub.email}</td>
                  <td className="p-3">{new Date(sub.createdAt).toLocaleDateString()}</td>
                  <td className="p-3"><button onClick={() => handleDelete(sub._id)} className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
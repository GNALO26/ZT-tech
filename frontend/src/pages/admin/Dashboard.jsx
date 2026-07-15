import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, LogOut, Download } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import PrivateRoute from '../../components/common/PrivateRoute';
import { Helmet } from 'react-helmet-async';

export default function AdminDashboard() {
  return (
    <PrivateRoute>
      <DashboardContent />
    </PrivateRoute>
  );
}

function DashboardContent() {
  const [tab, setTab] = useState('articles');
  const [articles, setArticles] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articlesRes, appointmentsRes] = await Promise.all([
          api.get('/admin/articles'),
          api.get('/admin/appointments')
        ]);
        setArticles(articlesRes.data);
        setAppointments(appointmentsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteArticle = async (id) => {
    if (!confirm('Supprimer cet article ?')) return;
    await api.delete(`/admin/articles/${id}`);
    setArticles(prev => prev.filter(a => a._id !== id));
  };

  const exportCSV = () => {
    const headers = ['Nom','Prénom','Email','WhatsApp','Visa','Pays','Date','Heure'];
    const rows = appointments.map(a => [
      a.last_name, a.first_name, a.email, a.whatsapp_number, a.visa_type,
      a.destination_country, new Date(a.appointment_date).toLocaleDateString(), a.appointment_time
    ]);
    let csv = headers.join(',') + '\n';
    rows.forEach(row => csv += row.join(',') + '\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'rendez-vous.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-8">Chargement...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto px-4 py-8">
      <Helmet><title>Administration | ZT Technologies</title></Helmet>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
          <p className="text-gray-600">Connecté en tant que {user?.email}</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/new" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nouvel article
          </Link>
          <button onClick={logout} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-6 border-b">
        <button onClick={() => setTab('articles')} className={`pb-2 font-medium ${tab === 'articles' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}>Articles</button>
        <button onClick={() => setTab('appointments')} className={`pb-2 font-medium ${tab === 'appointments' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}>Rendez-vous</button>
      </div>

      {tab === 'articles' && (
        <div className="space-y-4">
          {articles.length === 0 ? <p>Aucun article.</p> :
            articles.map(article => (
              <motion.div key={article._id} layout className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
                <div>
                  <h2 className="font-semibold text-lg">{article.title}</h2>
                  <p className="text-sm text-gray-500">{new Date(article.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <Link to={`/admin/edit/${article._id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></Link>
                  <button onClick={() => handleDeleteArticle(article._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              </motion.div>
            ))
          }
        </div>
      )}

      {tab === 'appointments' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Liste des rendez-vous</h2>
            <button onClick={exportCSV} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2">
              <Download className="w-4 h-4" /> Exporter CSV
            </button>
          </div>
          {appointments.length === 0 ? <p>Aucun rendez-vous.</p> :
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-xl shadow">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-3">Nom</th><th className="p-3">Prénom</th><th className="p-3">Email</th><th className="p-3">WhatsApp</th><th className="p-3">Visa</th><th className="p-3">Pays</th><th className="p-3">Date</th><th className="p-3">Heure</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(a => (
                    <tr key={a._id} className="border-t">
                      <td className="p-3">{a.last_name}</td>
                      <td className="p-3">{a.first_name}</td>
                      <td className="p-3">{a.email}</td>
                      <td className="p-3">{a.whatsapp_number}</td>
                      <td className="p-3">{a.visa_type}</td>
                      <td className="p-3">{a.destination_country}</td>
                      <td className="p-3">{new Date(a.appointment_date).toLocaleDateString()}</td>
                      <td className="p-3">{a.appointment_time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }
        </div>
      )}
    </motion.div>
  );
}
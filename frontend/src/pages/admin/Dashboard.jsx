import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Users, Clock, Edit, Trash2, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import { Helmet } from 'react-helmet-async';

const COLORS = ['#DC2626', '#F59E0B', '#1F2937', '#6B7280', '#3B82F6'];

export default function Dashboard() {
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [stats, setStats] = useState({ monthly: [], byVisaType: [], byDestination: [] });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(() => {
    Promise.all([
      api.get('/admin/appointments/today'),
      api.get('/admin/stats')
    ])
      .then(([todayRes, statsRes]) => {
        setTodayAppointments(todayRes.data || []);
        setStats(statsRes.data || { monthly: [], byVisaType: [], byDestination: [] });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce rendez-vous ?')) return;
    try {
      await api.delete(`/admin/appointments/${id}`);
      fetchData();
    } catch (err) {
      alert('Erreur lors de la suppression.');
    }
  };

  const handleEdit = (id) => {
    // Redirection vers un éditeur de rendez-vous (à créer si besoin)
    alert(`Modification du rendez-vous ${id} (fonctionnalité à venir)`);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Helmet><title>Tableau de bord | Admin</title></Helmet>
      <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>

      {/* Cartes du jour */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
          <CalendarDays className="w-10 h-10 text-primary" />
          <div>
            <p className="text-gray-500">Aujourd'hui</p>
            <p className="text-2xl font-bold">{todayAppointments.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
          <Users className="w-10 h-10 text-primary" />
          <div>
            <p className="text-gray-500">Clients attendus</p>
            <p className="text-2xl font-bold">{todayAppointments.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
          <Clock className="w-10 h-10 text-primary" />
          <div>
            <p className="text-gray-500">Prochain</p>
            <p className="text-2xl font-bold">
              {todayAppointments.length > 0 ? todayAppointments[0].appointment_time : '--'}
            </p>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Rendez-vous par mois</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#DC2626" name="Rendez-vous" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Types de visa</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats.byVisaType}
                dataKey="count"
                nameKey="_id"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ _id, count }) => `${_id} (${count})`}
              >
                {stats.byVisaType.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Destinations populaires */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Destinations les plus demandées</h2>
        <div className="flex flex-wrap gap-2">
          {stats.byDestination.map((d, i) => (
            <span key={d._id} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              {d._id} ({d.count})
            </span>
          ))}
        </div>
      </div>

      {/* Rendez-vous du jour avec actions */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Rendez-vous aujourd'hui</h2>
          <button onClick={fetchData} className="text-gray-500 hover:text-primary">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
        {loading ? (
          <p>Chargement...</p>
        ) : todayAppointments.length === 0 ? (
          <p className="text-gray-500">Aucun rendez-vous aujourd'hui.</p>
        ) : (
          <div className="space-y-3">
            {todayAppointments.map(apt => (
              <div key={apt._id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{apt.first_name} {apt.last_name}</p>
                  <p className="text-sm text-gray-500">{apt.visa_type} → {apt.destination_country}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold">{apt.appointment_time}</span>
                  <button onClick={() => handleEdit(apt._id)} className="text-blue-600 hover:text-blue-800">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(apt._id)} className="text-red-600 hover:text-red-800">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
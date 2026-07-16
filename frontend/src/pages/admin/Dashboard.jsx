import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Users, Clock } from 'lucide-react';
import api from '../../services/api';
import { Helmet } from 'react-helmet-async';

export default function Dashboard() {
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/appointments/today')
      .then(res => setTodayAppointments(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Helmet><title>Tableau de bord | Admin</title></Helmet>
      <h1 className="text-3xl font-bold mb-6">Bonjour, Admin</h1>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
          <CalendarDays className="w-10 h-10 text-primary" />
          <div>
            <p className="text-gray-500">Rendez-vous aujourd'hui</p>
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

      {/* Programme du jour */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Programme du jour</h2>
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
                <div className="text-right">
                  <p className="font-bold">{apt.appointment_time}</p>
                  <p className="text-xs text-gray-500">{apt.notification_method}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Filter, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import { Helmet } from 'react-helmet-async';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchAppointments = () => {
    setLoading(true);
    const params = {};
    if (startDate) params.start = startDate;
    if (endDate) params.end = endDate;
    api.get('/admin/appointments', { params })
      .then(res => setAppointments(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  // Actualisation automatique toutes les 30 secondes
  useEffect(() => {
    fetchAppointments();
    const interval = setInterval(fetchAppointments, 30000);
    return () => clearInterval(interval);
  }, [startDate, endDate]); // relance si les filtres changent

  const exportPDF = () => {
    const params = {};
    if (startDate) params.start = startDate;
    if (endDate) params.end = endDate;
    api.get('/admin/appointments/export/pdf', { params, responseType: 'blob' })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'rendez-vous.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(console.error);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Helmet><title>Rendez-vous | Admin</title></Helmet>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Rendez-vous</h1>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <button onClick={exportPDF} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
            <Download className="w-4 h-4" /> Exporter PDF
          </button>
          <button onClick={fetchAppointments} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Actualiser
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-wrap gap-4 items-center">
        <Filter className="w-5 h-5 text-gray-500" />
        <div>
          <label className="block text-sm text-gray-500">Date début</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border rounded-lg p-2" />
        </div>
        <div>
          <label className="block text-sm text-gray-500">Date fin</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border rounded-lg p-2" />
        </div>
        <button onClick={() => { setStartDate(''); setEndDate(''); }} className="text-sm text-primary hover:underline">Réinitialiser</button>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        {loading ? (
          <p className="p-4">Chargement...</p>
        ) : appointments.length === 0 ? (
          <p className="p-4 text-gray-500">Aucun rendez-vous trouvé.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Nom</th>
                <th className="p-3">Prénom</th>
                <th className="p-3">Email</th>
                <th className="p-3">WhatsApp</th>
                <th className="p-3">Visa</th>
                <th className="p-3">Pays</th>
                <th className="p-3">Date</th>
                <th className="p-3">Heure</th>
                <th className="p-3">Notification</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(apt => (
                <tr key={apt._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{apt.last_name}</td>
                  <td className="p-3">{apt.first_name}</td>
                  <td className="p-3">{apt.email}</td>
                  <td className="p-3">{apt.whatsapp_number}</td>
                  <td className="p-3">{apt.visa_type}</td>
                  <td className="p-3">{apt.destination_country}</td>
                  <td className="p-3">{new Date(apt.appointment_date).toLocaleDateString()}</td>
                  <td className="p-3">{apt.appointment_time}</td>
                  <td className="p-3">{apt.notification_method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
}
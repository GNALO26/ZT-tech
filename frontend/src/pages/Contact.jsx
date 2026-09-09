import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, User, MessageSquare, MapPin, Phone, Clock, CheckCircle2 } from 'lucide-react';
import MapComponent from '../components/common/MapComponent';
import api from '../services/api';
import { Helmet } from 'react-helmet-async';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Nom requis';
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Email valide requis';
    if (!form.message.trim()) errs.message = 'Message requis';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSending(true);
    try {
      await api.post('/contact', form);
      setSubmitted(true);
    } catch (err) {
      setErrors({ global: 'Erreur lors de l\'envoi.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-4 py-10">
      <Helmet>
        <title>Contact | ZT-Voyage</title>
        <meta name="description" content="Contactez ZT-Voyage pour vos besoins de visa, études et documents." />
      </Helmet>

      {/* En-tête */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contactez-nous</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">Nous sommes là pour répondre à toutes vos questions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Formulaire */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <h2 className="text-2xl font-semibold mb-6">Envoyez-nous un message</h2>
            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="text-xl font-semibold">Message envoyé avec succès !</p>
                <p className="text-gray-500 dark:text-gray-400">Nous vous répondrons dans les plus brefs délais.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                  <input
                    type="text" placeholder="Votre nom"
                    className={`w-full border rounded-lg pl-10 pr-4 py-3 ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white`}
                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                  <input
                    type="email" placeholder="Votre email"
                    className={`w-full border rounded-lg pl-10 pr-4 py-3 ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white`}
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                  <input
                    type="text" placeholder="Sujet (optionnel)"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                    value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                  />
                </div>
                <textarea
                  placeholder="Votre message"
                  rows={5}
                  className={`w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white ${errors.message ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                  value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                />
                {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
                {errors.global && <p className="text-red-500">{errors.global}</p>}
                <button type="submit" disabled={sending}
                  className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" /> {sending ? 'Envoi...' : 'Envoyer'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Coordonnées */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Nos coordonnées</h2>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <p className="flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" /> Cotonou, Quartier Zongo</p>
              <p className="flex items-center gap-2"><Phone className="w-5 h-5 text-primary" /> +229 01 52 43 17 17</p>
              <p className="flex items-center gap-2"><Mail className="w-5 h-5 text-primary" /> contact@zt-voyage.com</p>
              <p className="flex items-center gap-2"><Clock className="w-5 h-5 text-primary" /> Lun-Ven : 9h-18h, Sam : 9h-13h</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Localisation</h2>
            <MapComponent />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
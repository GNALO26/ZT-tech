import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, User, MessageSquare, MapPin, Phone } from 'lucide-react';
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
        <title>Contact | ZT Technologies</title>
        <meta name="description" content="Contactez ZT Technologies pour vos besoins de visa, études et documents." />
      </Helmet>
      <h1 className="text-3xl font-bold mb-8 text-center">Contactez-nous</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Envoyez-nous un message</h2>
          {submitted ? (
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-green-50 p-6 rounded-xl text-center">
              <p className="text-green-700 font-semibold">Message envoyé avec succès !</p>
              <p className="text-sm text-green-600">Nous vous répondrons dans les plus brefs délais.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                <input
                  type="text" placeholder="Votre nom"
                  className={`w-full border rounded-lg pl-10 pr-4 py-3 ${errors.name ? 'border-red-500' : 'border-gray-300'} outline-none focus:ring-2 focus:ring-primary`}
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  aria-label="Votre nom"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                <input
                  type="email" placeholder="Votre email"
                  className={`w-full border rounded-lg pl-10 pr-4 py-3 ${errors.email ? 'border-red-500' : 'border-gray-300'} outline-none focus:ring-2 focus:ring-primary`}
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  aria-label="Votre email"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                <input
                  type="text" placeholder="Sujet (optionnel)"
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                  value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                />
              </div>
              <div>
                <textarea
                  placeholder="Votre message"
                  rows={5}
                  className={`w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
                  value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  aria-label="Votre message"
                />
                {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
              </div>
              {errors.global && <p className="text-red-500">{errors.global}</p>}
              <button type="submit" disabled={sending}
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" /> {sending ? 'Envoi...' : 'Envoyer'}
              </button>
            </form>
          )}
        </div>
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Nos coordonnées</h2>
          <div className="space-y-3 text-gray-700">
            <p className="flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" /> Cotonou, Bénin</p>
            <p className="flex items-center gap-2"><Phone className="w-5 h-5 text-primary" /> +229 00 00 00 00</p>
            <p className="flex items-center gap-2"><Mail className="w-5 h-5 text-primary" /> contact@zttechnologies.bj</p>
          </div>
          <MapComponent />
        </div>
      </div>
    </motion.div>
  );
}
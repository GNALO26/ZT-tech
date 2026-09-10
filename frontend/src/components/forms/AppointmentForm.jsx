import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import {
  ChevronLeft, ChevronRight, Check, Loader2, AlertTriangle,
  User, Mail, Phone, MapPin, Globe, FileText, Calendar, Clock, Plane,
  GraduationCap, Briefcase
} from 'lucide-react';
import api from '../../services/api';
import SuccessPopup from './SuccessPopup';

const appointmentSchema = z.object({
  hasPassport: z.boolean().refine(v => v === true, 'Le passeport est obligatoire.'),
  firstName: z.string().min(2, 'Prénom requis'),
  lastName: z.string().min(2, 'Nom requis'),
  email: z.string().email('Email invalide'),
  whatsappNumber: z.string().transform(val => val.replace(/\s+/g, '')).refine(val => /^(\+229)?0[1-9]\d{8}$/.test(val), 'Numéro béninois invalide'),
  cityOfResidence: z.string().min(2, 'Ville requise'),
  visaType: z.enum(['VISITEUR', 'TRAVAIL', 'ETUDE'], { errorMap: () => ({ message: 'Type de visa requis' }) }),
  destinationCountry: z.string().min(2, 'Pays requis'),
  appointmentDate: z.string().refine(v => !isNaN(Date.parse(v)), 'Date invalide'),
  appointmentTime: z.string().regex(/^(09|1[0-7]):(00|30)$|^18:00$/, 'Créneau invalide'),
});

const countriesMatrix = {
  VISITEUR: ['France', 'Belgique', 'Canada', 'Londres', 'Chine', 'Turquie', 'Luxembourg', 'Suisse', 'Pays-Bas', 'Allemagne', 'Autre pays Schengen'],
  TRAVAIL: ['Portugal', 'Belgique', 'Turquie', 'Dubaï', 'Canada', 'Chine'],
  ETUDE: ['France', 'Espagne', 'Portugal', 'Belgique', 'Canada'],
};

const getAllTimeSlots = () => {
  const slots = [];
  for (let h = 9; h <= 18; h++) {
    for (let m = 0; m < 60; m += 30) {
      if (h === 18 && m > 0) break;
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }
  return slots;
};

const getAvailableSlots = (selectedDate) => {
  if (!selectedDate) return [];
  const day = new Date(selectedDate + 'T00:00:00').getDay();
  const allSlots = getAllTimeSlots();
  if (day === 0) return [];
  if (day === 6) {
    return allSlots.filter(slot => {
      const [h, m] = slot.split(':').map(Number);
      const total = h * 60 + m;
      return total >= 9 * 60 && total <= 12 * 60 + 30;
    });
  }
  return allSlots.filter(slot => {
    const [h, m] = slot.split(':').map(Number);
    const total = h * 60 + m;
    return total >= 9 * 60 && total <= 17 * 60 + 30;
  });
};

const isSlotTooSoon = (selectedDate, time) => {
  if (!selectedDate || !time) return false;
  const now = new Date();
  const [h, m] = time.split(':').map(Number);
  const appt = new Date(selectedDate + 'T00:00:00');
  appt.setHours(h, m, 0, 0);
  return appt.getTime() - now.getTime() < 4 * 60 * 60 * 1000;
};

const steps = [
  { id: 1, label: 'Passeport', icon: FileText },
  { id: 2, label: 'Vos infos', icon: User },
  { id: 3, label: 'Rendez-vous', icon: Calendar },
];

export default function AppointmentForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    hasPassport: false,
    firstName: '',
    lastName: '',
    email: '',
    whatsappNumber: '',
    cityOfResidence: '',
    visaType: '',
    destinationCountry: '',
    appointmentDate: '',
    appointmentTime: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  useEffect(() => {
    if (formData.appointmentDate) {
      setAvailableSlots(getAvailableSlots(formData.appointmentDate));
      api.get('/appointments/slots', { params: { date: formData.appointmentDate } })
        .then(res => setBookedSlots(res.data.booked || []))
        .catch(() => setBookedSlots([]));
    } else {
      setAvailableSlots([]);
      setBookedSlots([]);
    }
  }, [formData.appointmentDate]);

  const validateStep = () => {
    try {
      if (step === 1) appointmentSchema.pick({ hasPassport: true }).parse(formData);
      else if (step === 2) appointmentSchema.pick({ firstName: true, lastName: true, email: true, whatsappNumber: true, cityOfResidence: true }).parse(formData);
      else if (step === 3) appointmentSchema.pick({ visaType: true, destinationCountry: true, appointmentDate: true, appointmentTime: true }).parse(formData);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const f = {};
        err.errors.forEach(e => { if (e.path.length) f[e.path[0]] = e.message; });
        setErrors(f);
      }
      return false;
    }
  };

  const nextStep = () => { if (validateStep()) setStep(prev => prev + 1); };
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setIsSubmitting(true);
    try {
      await api.post('/appointments', { ...formData, notificationMethod: 'email' });
      setSuccess(true);
      setTimeout(() => setShowSuccessPopup(true), 600);
    } catch (err) {
      if (err.response?.status === 409) setErrors({ appointmentTime: 'Créneau déjà réservé' });
      else if (err.response?.status === 400) setErrors({ global: err.response.data.message });
      else setErrors({ global: 'Erreur serveur. Veuillez réessayer.' });
    } finally { setIsSubmitting(false); }
  };

  const handleNoPassport = () => {
    const num = import.meta.env.VITE_WHATSAPP_NUMBER || '22952431717';
    window.open(`https://wa.me/${num}?text=${encodeURIComponent("Bonjour, je souhaite prendre rendez-vous mais je n'ai pas de passeport.")}`, '_blank');
  };

  const inputClass = (field) =>
    `w-full border ${errors[field] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition`;

  const progress = ((step - 1) / (steps.length - 1)) * 100;

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 md:p-10 border border-gray-100 dark:border-gray-700">
        {success ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full mb-6"
            >
              <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
            </motion.div>
            <h2 className="text-3xl font-bold mb-3 dark:text-white">Rendez-vous confirmé !</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
              Un email de confirmation contenant votre document PDF a été envoyé à <strong>{formData.email}</strong>.
            </p>
          </motion.div>
        ) : (
          <>
            {/* Barre de progression */}
            <div className="mb-10">
              <div className="flex justify-between mb-3">
                {steps.map((s) => {
                  const Icon = s.icon;
                  const isActive = step >= s.id;
                  return (
                    <div key={s.id} className="flex flex-col items-center flex-1">
                      <motion.div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                          isActive ? 'bg-primary text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                        }`}
                        animate={{ scale: step === s.id ? 1.1 : 1 }}
                      >
                        {step > s.id ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                      </motion.div>
                      <span className={`text-xs mt-2 font-medium ${isActive ? 'text-primary' : 'text-gray-500'}`}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-red-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {/* Étape 1 */}
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}>
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2 dark:text-white">Avez-vous un passeport ?</h3>
                    <p className="text-gray-600 dark:text-gray-400">Le passeport est requis pour toute demande de visa.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { updateField('hasPassport', true); nextStep(); }}
                      className="bg-primary text-white px-10 py-4 rounded-2xl hover:bg-red-700 transition font-semibold shadow-lg flex items-center justify-center gap-2"
                    >
                      <Check className="w-5 h-5" /> Oui, j'ai un passeport
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNoPassport}
                      className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-10 py-4 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition font-semibold flex items-center justify-center gap-2"
                    >
                      <AlertTriangle className="w-5 h-5" /> Non, pas encore
                    </motion.button>
                  </div>
                  {errors.hasPassport && <p className="text-red-500 text-sm text-center mt-4">{errors.hasPassport}</p>}
                </motion.div>
              )}

              {/* Étape 2 */}
              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2 dark:text-white">Vos informations</h3>
                    <p className="text-gray-600 dark:text-gray-400">Toutes vos données sont confidentielles.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <User className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                      <input placeholder="Prénom" className={inputClass('firstName')} value={formData.firstName} onChange={e => updateField('firstName', e.target.value)} />
                      {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                    </div>
                    <div className="relative">
                      <User className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                      <input placeholder="Nom" className={inputClass('lastName')} value={formData.lastName} onChange={e => updateField('lastName', e.target.value)} />
                      {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                      <input placeholder="Adresse email" type="email" className={inputClass('email')} value={formData.email} onChange={e => updateField('email', e.target.value)} />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                      <input placeholder="WhatsApp (ex: 0156035888)" className={inputClass('whatsappNumber')} value={formData.whatsappNumber} onChange={e => updateField('whatsappNumber', e.target.value)} />
                      {errors.whatsappNumber && <p className="text-red-500 text-sm mt-1">{errors.whatsappNumber}</p>}
                    </div>
                    <div className="relative md:col-span-2">
                      <MapPin className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                      <input placeholder="Ville de résidence" className={inputClass('cityOfResidence')} value={formData.cityOfResidence} onChange={e => updateField('cityOfResidence', e.target.value)} />
                      {errors.cityOfResidence && <p className="text-red-500 text-sm mt-1">{errors.cityOfResidence}</p>}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                    📧 Vous recevrez votre confirmation par email (avec document PDF).
                  </p>
                </motion.div>
              )}

              {/* Étape 3 */}
              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2 dark:text-white">Détails du rendez-vous</h3>
                    <p className="text-gray-600 dark:text-gray-400">Choisissez votre visa et votre créneau.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                      <select className={inputClass('visaType') + ' appearance-none'} value={formData.visaType} onChange={e => updateField('visaType', e.target.value)}>
                        <option value="">Type de visa</option>
                        <option value="VISITEUR">✈️ Visiteur</option>
                        <option value="TRAVAIL">💼 Travail</option>
                        <option value="ETUDE">🎓 Étude</option>
                      </select>
                      {errors.visaType && <p className="text-red-500 text-sm mt-1">{errors.visaType}</p>}
                    </div>
                    <div className="relative">
                      <Globe className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                      <select className={inputClass('destinationCountry') + ' appearance-none'} value={formData.destinationCountry} onChange={e => updateField('destinationCountry', e.target.value)} disabled={!formData.visaType}>
                        <option value="">Pays de destination</option>
                        {formData.visaType && countriesMatrix[formData.visaType].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      {errors.destinationCountry && <p className="text-red-500 text-sm mt-1">{errors.destinationCountry}</p>}
                    </div>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                      <input type="date" className={inputClass('appointmentDate')} value={formData.appointmentDate} onChange={e => updateField('appointmentDate', e.target.value)} min={new Date().toISOString().split('T')[0]} />
                      {errors.appointmentDate && <p className="text-red-500 text-sm mt-1">{errors.appointmentDate}</p>}
                    </div>
                    <div className="relative">
                      <Clock className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                      <select className={inputClass('appointmentTime') + ' appearance-none'} value={formData.appointmentTime} onChange={e => updateField('appointmentTime', e.target.value)}>
                        <option value="">Heure</option>
                        {availableSlots.map(t => {
                          const booked = bookedSlots.includes(t);
                          const tooSoon = isSlotTooSoon(formData.appointmentDate, t);
                          return (
                            <option key={t} value={t} disabled={booked || tooSoon}>
                              {t}{booked ? ' (réservé)' : ''}{!booked && tooSoon ? ' (trop proche)' : ''}
                            </option>
                          );
                        })}
                      </select>
                      {errors.appointmentTime && <p className="text-red-500 text-sm mt-1">{errors.appointmentTime}</p>}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {errors.global && <p className="text-red-500 text-center mt-4">{errors.global}</p>}

            <div className="flex justify-between mt-10">
              {step > 1 && (
                <button onClick={prevStep} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary transition">
                  <ChevronLeft className="w-4 h-4" /> Précédent
                </button>
              )}
              {step < 3 ? (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={nextStep}
                  className="ml-auto bg-primary text-white px-8 py-3 rounded-2xl hover:bg-red-700 flex items-center gap-2 shadow-md"
                >
                  Suivant <ChevronRight className="w-4 h-4" />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="ml-auto bg-gradient-to-r from-primary to-red-500 text-white px-8 py-3 rounded-2xl hover:shadow-xl flex items-center gap-2 disabled:opacity-50 shadow-md"
                >
                  {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : <Check className="w-4 h-4" />}
                  Confirmer le rendez-vous
                </motion.button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Popup de succès avec suggestions */}
      <SuccessPopup isOpen={showSuccessPopup} onClose={() => setShowSuccessPopup(false)} />
    </>
  );
}
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import { ChevronLeft, ChevronRight, Check, Loader2, AlertTriangle } from 'lucide-react';
import api from '../../services/api';

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
  appointmentTime: z.string().regex(/^(09|1[0-7]):(00|30)$|^18:00$/, 'Créneau entre 9h et 17h30'),
  notificationMethod: z.enum(['email', 'whatsapp']),
});

const countriesMatrix = {
  VISITEUR: ['France', 'Belgique', 'Canada', 'Londres', 'Chine', 'Turquie', 'Luxembourg', 'Suisse', 'Pays-Bas', 'Allemagne', 'Autre pays Schengen'],
  TRAVAIL: ['Portugal', 'Belgique', 'Turquie', 'Dubaï', 'Canada', 'Chine'],
  ETUDE: ['France', 'Espagne', 'Portugal', 'Belgique', 'Canada'],
};

// Génère tous les créneaux possibles (9h-18h)
const getAllTimeSlots = () => {
  const slots = [];
  for (let h = 9; h <= 18; h++) {
    for (let m = 0; m < 60; m += 30) {
      if (h === 18 && m > 0) break;
      const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      slots.push(time);
    }
  }
  return slots;
};

// Retourne les créneaux disponibles selon le jour sélectionné
const getAvailableSlots = (selectedDate) => {
  if (!selectedDate) return [];
  const day = new Date(selectedDate + 'T00:00:00').getDay(); // 0 = dimanche
  const allSlots = getAllTimeSlots();

  if (day === 0) return []; // dimanche fermé
  if (day === 6) {
    // Samedi : 9h - 12h30
    return allSlots.filter(slot => {
      const [h, m] = slot.split(':').map(Number);
      const startMinutes = h * 60 + m;
      return startMinutes >= 9 * 60 && startMinutes <= 12 * 60 + 30;
    });
  }
  // Lundi à vendredi : 9h - 17h30
  return allSlots.filter(slot => {
    const [h, m] = slot.split(':').map(Number);
    const startMinutes = h * 60 + m;
    return startMinutes >= 9 * 60 && startMinutes <= 17 * 60 + 30;
  });
};

// Vérifie si le créneau est trop proche (moins de 4 heures)
const isSlotTooSoon = (selectedDate, time) => {
  if (!selectedDate || !time) return false;
  const now = new Date();
  const [h, m] = time.split(':').map(Number);
  const appointmentDateTime = new Date(selectedDate + 'T00:00:00');
  appointmentDateTime.setHours(h, m, 0, 0);
  const diffMs = appointmentDateTime.getTime() - now.getTime();
  return diffMs < 4 * 60 * 60 * 1000;
};

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
    notificationMethod: 'email',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  // Charge les créneaux disponibles et réservés quand la date change
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
      if (step === 1) {
        appointmentSchema.pick({ hasPassport: true }).parse(formData);
      } else if (step === 2) {
        appointmentSchema.pick({
          firstName: true, lastName: true, email: true,
          whatsappNumber: true, cityOfResidence: true, notificationMethod: true,
        }).parse(formData);
      } else if (step === 3) {
        appointmentSchema.pick({
          visaType: true, destinationCountry: true,
          appointmentDate: true, appointmentTime: true,
        }).parse(formData);
      }
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors = {};
        err.errors.forEach(e => { if (e.path.length) fieldErrors[e.path[0]] = e.message; });
        setErrors(fieldErrors);
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
      await api.post('/appointments', formData);
      setSuccess(true);
    } catch (err) {
      if (err.response?.status === 409) {
        setErrors({ appointmentTime: 'Créneau déjà réservé' });
      } else if (err.response?.status === 400) {
        setErrors({ global: err.response.data.message });
      } else {
        setErrors({ global: 'Erreur serveur. Veuillez réessayer.' });
      }
    } finally { setIsSubmitting(false); }
  };

  const handleNoPassport = () => {
    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '22952431717';
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Bonjour, je souhaite prendre rendez-vous mais je n'ai pas de passeport.")}`, '_blank');
  };

  const inputClass = (field) =>
    `w-full border ${errors[field] ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary`;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      {success ? (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-12">
          <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Rendez-vous confirmé !</h2>
          <p className="text-gray-600">Vous recevrez votre confirmation par {formData.notificationMethod === 'email' ? 'email' : 'WhatsApp'}.</p>
        </motion.div>
      ) : (
        <>
          <div className="flex justify-center mb-8">
            {[1,2,3].map(s => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${s <= step ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>{s}</div>
                {s < 3 && <div className={`w-10 h-1 ${s < step ? 'bg-primary' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <h3 className="text-xl font-semibold mb-4">Étape 1 : Passeport</h3>
                <p className="mb-6 text-gray-700">Possédez-vous un passeport valide ?</p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => { updateField('hasPassport', true); nextStep(); }}
                    className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-red-700 transition font-semibold"
                  >
                    Oui, j'ai un passeport
                  </button>
                  <button
                    onClick={handleNoPassport}
                    className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-300 transition font-semibold flex items-center gap-2"
                  >
                    Non <AlertTriangle className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-4 text-center">
                  Si vous n'avez pas de passeport, vous serez redirigé vers WhatsApp pour obtenir de l'aide.
                </p>
                {errors.hasPassport && <p className="text-red-500 text-sm text-center mt-2">{errors.hasPassport}</p>}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-xl font-semibold mb-4">Étape 2 : Informations personnelles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input placeholder="Prénom" className={inputClass('firstName')} value={formData.firstName} onChange={e => updateField('firstName', e.target.value)} />
                    {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                  </div>
                  <div>
                    <input placeholder="Nom" className={inputClass('lastName')} value={formData.lastName} onChange={e => updateField('lastName', e.target.value)} />
                    {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                  </div>
                  <div>
                    <input placeholder="Email" type="email" className={inputClass('email')} value={formData.email} onChange={e => updateField('email', e.target.value)} />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                  </div>
                  <div>
                    <input
                      placeholder="WhatsApp (ex: 0156035888)"
                      className={inputClass('whatsappNumber')}
                      value={formData.whatsappNumber}
                      onChange={e => updateField('whatsappNumber', e.target.value)}
                    />
                    {errors.whatsappNumber && <p className="text-red-500 text-sm">{errors.whatsappNumber}</p>}
                  </div>
                  <div>
                    <input placeholder="Ville de résidence" className={inputClass('cityOfResidence')} value={formData.cityOfResidence} onChange={e => updateField('cityOfResidence', e.target.value)} />
                    {errors.cityOfResidence && <p className="text-red-500 text-sm">{errors.cityOfResidence}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Recevoir la confirmation par</label>
                    <select className={inputClass('notificationMethod')} value={formData.notificationMethod} onChange={e => updateField('notificationMethod', e.target.value)}>
                      <option value="email">Email</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                    {errors.notificationMethod && <p className="text-red-500 text-sm">{errors.notificationMethod}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-xl font-semibold mb-4">Étape 3 : Détails du rendez-vous</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <select className={inputClass('visaType')} value={formData.visaType} onChange={e => updateField('visaType', e.target.value)}>
                      <option value="">Type de visa</option>
                      <option value="VISITEUR">Visiteur</option>
                      <option value="TRAVAIL">Travail</option>
                      <option value="ETUDE">Étude</option>
                    </select>
                    {errors.visaType && <p className="text-red-500 text-sm">{errors.visaType}</p>}
                  </div>
                  <div>
                    <select className={inputClass('destinationCountry')} value={formData.destinationCountry} onChange={e => updateField('destinationCountry', e.target.value)} disabled={!formData.visaType}>
                      <option value="">Pays de destination</option>
                      {formData.visaType && countriesMatrix[formData.visaType].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.destinationCountry && <p className="text-red-500 text-sm">{errors.destinationCountry}</p>}
                  </div>
                  <div>
                    <input
                      type="date"
                      className={inputClass('appointmentDate')}
                      value={formData.appointmentDate}
                      onChange={e => updateField('appointmentDate', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    {errors.appointmentDate && <p className="text-red-500 text-sm">{errors.appointmentDate}</p>}
                  </div>
                  <div>
                    <select
                      className={inputClass('appointmentTime')}
                      value={formData.appointmentTime}
                      onChange={e => updateField('appointmentTime', e.target.value)}
                    >
                      <option value="">Heure</option>
                      {availableSlots.map(t => {
                        const booked = bookedSlots.includes(t);
                        const tooSoon = isSlotTooSoon(formData.appointmentDate, t);
                        return (
                          <option key={t} value={t} disabled={booked || tooSoon}>
                            {t}
                            {booked ? ' (réservé)' : ''}
                            {!booked && tooSoon ? ' (trop proche)' : ''}
                          </option>
                        );
                      })}
                    </select>
                    {errors.appointmentTime && <p className="text-red-500 text-sm">{errors.appointmentTime}</p>}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {errors.global && <p className="text-red-500 text-center mt-4">{errors.global}</p>}

          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button onClick={prevStep} className="flex items-center gap-2 text-gray-600 hover:text-primary">
                <ChevronLeft className="w-4 h-4" /> Précédent
              </button>
            )}
            {step < 3 ? (
              <button onClick={nextStep} className="ml-auto bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                Suivant <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={isSubmitting} className="ml-auto bg-secondary text-white px-6 py-2 rounded-lg hover:bg-yellow-600 flex items-center gap-2 disabled:opacity-50">
                {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : <Check className="w-4 h-4" />}
                Confirmer le rendez-vous
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
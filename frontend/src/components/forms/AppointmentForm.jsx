import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import { ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react';
import api from '../../services/api.js';

// Schéma Zod côté client (corrigé)
const appointmentSchema = z.object({
  hasPassport: z.boolean().refine(v => v === true, 'Le passeport est obligatoire.'),
  firstName: z.string().min(2, 'Prénom requis'),
  lastName: z.string().min(2, 'Nom requis'),
  email: z.string().email('Email invalide'),
  whatsappNumber: z
    .string()
    .transform((val) => val.replace(/\s+/g, ''))
    .refine((val) => /^(\+229)?0[1-9]\d{8}$/.test(val), 'Numéro béninois invalide (ex: 0156035888)'),
  cityOfResidence: z.string().min(2, 'Ville requise'),
  visaType: z.enum(['VISITEUR', 'TRAVAIL', 'ETUDE'], { errorMap: () => ({ message: 'Type de visa requis' }) }),
  destinationCountry: z.string().min(2, 'Pays requis'),
  appointmentDate: z.string().refine(v => !isNaN(Date.parse(v)), 'Date invalide'),
  appointmentTime: z.string().regex(/^(1[0-7]):(00|30)$|^18:00$/, 'Créneau entre 10h et 18h (pas de 30 min)'),
});

const countriesMatrix = {
  VISITEUR: ['France', 'Belgique', 'Canada', 'Londres', 'Chine', 'Turquie', 'Luxembourg', 'Suisse', 'Pays-Bas', 'Allemagne', 'Autre pays Schengen'],
  TRAVAIL: ['Portugal', 'Belgique', 'Turquie', 'Dubaï', 'Canada', 'Chine'],
  ETUDE: ['France', 'Espagne', 'Portugal', 'Belgique', 'Canada'],
};

export default function AppointmentForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    hasPassport: true,
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

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = () => {
    try {
      if (step === 1) {
        appointmentSchema.pick({ hasPassport: true }).parse(formData);
      } else if (step === 2) {
        appointmentSchema.pick({
          firstName: true,
          lastName: true,
          email: true,
          whatsappNumber: true,
          cityOfResidence: true,
        }).parse(formData);
      } else if (step === 3) {
        appointmentSchema.pick({
          visaType: true,
          destinationCountry: true,
          appointmentDate: true,
          appointmentTime: true,
        }).parse(formData);
      }
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors = {};
        err.errors.forEach(e => {
          if (e.path.length) fieldErrors[e.path[0]] = e.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const nextStep = () => {
    if (validateStep()) setStep(prev => prev + 1);
  };

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
      } else {
        setErrors({ global: 'Erreur serveur, veuillez réessayer.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `w-full border ${errors[field] ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary`;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      {success ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Rendez-vous confirmé !</h2>
          <p className="text-gray-600">Vous recevrez une confirmation par email et WhatsApp.</p>
        </motion.div>
      ) : (
        <>
          <div className="flex justify-center mb-8">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${s <= step ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {s}
                </div>
                {s < 3 && <div className={`w-10 h-1 ${s < step ? 'bg-primary' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <h3 className="text-xl font-semibold mb-4">Étape 1 : Prérequis</h3>
                <label className="flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    checked={formData.hasPassport}
                    onChange={(e) => updateField('hasPassport', e.target.checked)}
                    className="w-5 h-5"
                  />
                  <span>Je possède un passeport valide</span>
                </label>
                {errors.hasPassport && <p className="text-red-500 text-sm mb-4">{errors.hasPassport}</p>}
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
                      placeholder="Ex: 0156035888"
                      className={inputClass('whatsappNumber')}
                      value={formData.whatsappNumber}
                      onChange={e => updateField('whatsappNumber', e.target.value)}
                    />
                    {errors.whatsappNumber && <p className="text-red-500 text-sm">{errors.whatsappNumber}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <input placeholder="Ville de résidence" className={inputClass('cityOfResidence')} value={formData.cityOfResidence} onChange={e => updateField('cityOfResidence', e.target.value)} />
                    {errors.cityOfResidence && <p className="text-red-500 text-sm">{errors.cityOfResidence}</p>}
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
                      {formData.visaType && countriesMatrix[formData.visaType].map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                    {errors.destinationCountry && <p className="text-red-500 text-sm">{errors.destinationCountry}</p>}
                  </div>
                  <div>
                    <input type="date" className={inputClass('appointmentDate')} value={formData.appointmentDate} onChange={e => updateField('appointmentDate', e.target.value)} />
                    {errors.appointmentDate && <p className="text-red-500 text-sm">{errors.appointmentDate}</p>}
                  </div>
                  <div>
                    <select className={inputClass('appointmentTime')} value={formData.appointmentTime} onChange={e => updateField('appointmentTime', e.target.value)}>
                      <option value="">Heure</option>
                      {['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
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
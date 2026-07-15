import { motion } from 'framer-motion';
import AppointmentForm from '../components/forms/AppointmentForm';
import { Helmet } from 'react-helmet-async';

export default function Appointment() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto px-4 py-10"
    >
      <Helmet>
        <title>Prendre un rendez-vous | ZT Technologies</title>
        <meta name="description" content="Réservez un créneau pour votre demande de visa ou documents." />
      </Helmet>
      <h1 className="text-3xl font-bold text-center mb-8">Prendre un rendez-vous</h1>
      <AppointmentForm />
    </motion.div>
  );
}
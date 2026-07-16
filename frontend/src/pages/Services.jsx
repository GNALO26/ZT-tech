import { motion } from 'framer-motion';
import { FileText, Globe, GraduationCap, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const services = [
  {
    icon: Globe,
    title: 'Visas & Voyages',
    description: 'Obtenez votre visa tourisme, travail ou études pour plus de 15 destinations. Nous préparons votre dossier, vérifions les pièces et assurons le suivi consulaire.',
    link: '/rdv',
    linkText: 'Prendre rendez-vous',
  },
  {
    icon: FileText,
    title: 'Documents administratifs',
    description: 'CIP, casier judiciaire, acte de naissance… Nous accélérons vos démarches administratives et vous évitons les longues files d’attente.',
    link: '/rdv',
    linkText: 'Prendre rendez-vous',
  },
  {
    icon: GraduationCap,
    title: 'Études à l’étranger',
    description: 'Vous souhaitez étudier en France, au Canada ou ailleurs ? Nous vous aidons pour les inscriptions universitaires et les demandes de visa étudiant.',
    link: '/rdv',
    linkText: 'Prendre rendez-vous',
  },
];

export default function Services() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-4 py-12">
      <Helmet>
        <title>Nos services | ZT-Voyage</title>
        <meta name="description" content="Découvrez nos services : visas, documents administratifs, études à l'étranger." />
      </Helmet>
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Nos services</h1>
        <p className="text-xl text-gray-600">Des solutions complètes pour vos projets de mobilité</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service, i) => (
          <motion.div
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.2 }}
            className="bg-white rounded-xl shadow p-6 flex flex-col"
          >
            <service.icon className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">{service.title}</h3>
            <p className="text-gray-600 flex-1 mb-4">{service.description}</p>
            <Link to={service.link} className="text-primary font-semibold flex items-center gap-1 hover:underline">
              {service.linkText} <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
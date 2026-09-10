import { motion } from 'framer-motion';
import { FileText, Globe, GraduationCap, Clock, ThumbsUp, ShieldCheck, ChevronRight, CheckCircle2, Car } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ServiceCard from '../components/services/ServiceCard';

const services = [
  {
    icon: Globe,
    title: 'Visas & Voyages',
    description: 'Obtenez votre visa tourisme, travail ou études pour plus de 15 destinations. Nous préparons votre dossier, vérifions les pièces et assurons le suivi consulaire.',
    image: '/images/services/visa.jpg',
    link: '/rdv',
    linkText: 'Prendre rendez-vous',
  },
  {
    icon: FileText,
    title: 'Documents administratifs',
    description: 'CIP, casier judiciaire, acte de naissance… Nous accélérons vos démarches administratives et vous évitons les longues files d’attente.',
    image: '/images/services/documents.jpg',
    link: '/rdv',
    linkText: 'Prendre rendez-vous',
  },
  {
    icon: GraduationCap,
    title: 'Études à l’étranger',
    description: 'Vous souhaitez étudier en France, au Canada ou ailleurs ? Nous vous aidons pour les inscriptions universitaires et les demandes de visa étudiant.',
    image: '/images/services/etudes.jpg',
    link: '/rdv',
    linkText: 'Prendre rendez-vous',
  },
  {
    icon: Car,
    title: 'Location de voiture',
    description: 'Louez un véhicule à Cotonou et partout au Bénin. Berlines, SUV et utilitaires disponibles.',
    image: '/images/services/location-voiture.jpg',
    link: '/location-voiture',
    linkText: 'Découvrir la flotte',
  },
];

const processSteps = [
  { icon: Clock, title: '1. Consultation', desc: 'Échangeons sur votre projet et vos besoins.' },
  { icon: ThumbsUp, title: '2. Préparation', desc: 'Nous constituons un dossier solide et complet.' },
  { icon: ShieldCheck, title: '3. Suivi', desc: 'Nous assurons le suivi jusqu’à l’obtention de votre visa.' },
];

export default function Services() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen">
      <Helmet>
  <title>Nos services — Visa, documents, études, location | ZT-Voyage</title>
  <meta name="description" content="Découvrez nos services : obtention de visa, documents administratifs, études  et travail à l'étranger et location de voiture à Cotonou. Accompagnement personnalisé." />
  <link rel="canonical" href="https://zt-voyage.com/services" />
</Helmet>

      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-r from-primary to-red-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="/images/hero-poster.jpg" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Nos services</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Des solutions complètes pour vos projets de mobilité, avec un accompagnement personnalisé.
          </p>
        </div>
      </section>

      {/* Cartes de services */}
      <section className="py-16 bg-light dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, i) => (
              <ServiceCard key={i} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* Processus */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-accent dark:text-white">Comment ça marche ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {processSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="text-center"
              >
                <div className="bg-primary/10 dark:bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-accent dark:text-white">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-16 bg-light dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-accent dark:text-white">Pourquoi choisir ZT-Voyage ?</h2>
            <ul className="space-y-4">
              {[
                'Expertise reconnue depuis plus de 5 ans',
                'Taux de réussite de 98%',
                'Accompagnement personnalisé',
                'Prix transparents et compétitifs',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to="/rdv"
              className="mt-8 inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-red-700 transition"
            >
              Réserver un rendez-vous <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img src="/images/agence/interieur.jpg" alt="Notre agence" className="w-full h-80 object-cover" loading="lazy" />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-accent dark:text-white">Questions fréquentes</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2 text-accent dark:text-white">Quels documents pour un visa ?</h3>
              <p className="text-gray-600 dark:text-gray-300">Cela dépend du pays. En général, un passeport valide, des photos d'identité, un formulaire consulaire et des justificatifs. Contactez-nous pour une liste personnalisée.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-accent dark:text-white">Puis-je payer en ligne ?</h3>
              <p className="text-gray-600 dark:text-gray-300">Non, nous ne demandons jamais d'argent en ligne. Tous les paiements se font directement à l'agence.</p>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
import { motion } from 'framer-motion';
import VideoBackground from '../components/common/VideoBackground';
import SearchBar from '../components/common/SearchBar';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Globe, GraduationCap, Award, Users, Target, ChevronRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import LocalBusinessSchema from '../components/common/StructuredData';
import NewsletterSubscribe from '../components/blog/NewsletterSubscribe';
import DestinationCard from '../components/services/DestinationCard';
import FormationCard from '../components/services/FormationCard';

const heroVideos = [
  '/videos/hero1.mp4',
  '/videos/hero2.mp4',
];

const posterImage = '/images/hero-poster.jpg';

export default function Home() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <Helmet>
        <title>ZT-Voyage – Visas, études, voyages, formations au Bénin</title>
        <meta name="description" content="Agence de voyages, visa, études et formations à Cotonou. Prenez rendez-vous, explorez nos destinations et formez-vous." />
        <link rel="canonical" href="https://zt-voyage.com" />
      </Helmet>
      <LocalBusinessSchema />

      <VideoBackground videoSrcs={heroVideos} posterSrc={posterImage}>
        <div className="text-center text-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 drop-shadow-lg">
            Votre avenir commence ici
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 drop-shadow">
            Visa, études, voyage, formations : nous vous accompagnons de A à Z
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link to="/rdv" className="bg-secondary text-primary px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:bg-yellow-500 transition inline-flex items-center gap-2 shadow-lg text-sm sm:text-base">
              Prendre rendez-vous <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/formations" className="bg-white/20 backdrop-blur text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:bg-white/30 transition text-sm sm:text-base">
              Nos formations
            </Link>
          </div>
        </div>
      </VideoBackground>

      {/* Statistiques */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Globe, label: '15+ destinations', desc: 'Pays accessibles' },
            { icon: Users, label: '2000+ clients', desc: 'Accompagnés avec succès' },
            { icon: Award, label: 'Agrément officiel', desc: 'Reconnu par les autorités' },
            { icon: Target, label: '98% de réussite', desc: 'Dossiers acceptés' },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <item.icon className="w-10 h-10 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-accent dark:text-white">{item.label}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Destinations populaires */}
      <section className="py-16 bg-light dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-accent dark:text-white">Destinations populaires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'France', image: '/destinations/france.jpg', desc: 'Visa tourisme, études, travail' },
              { name: 'Canada', image: '/destinations/canada.jpg', desc: 'Études et immigration' },
              { name: 'Chine', image: '/destinations/chine.jpg', desc: 'Visa affaires et tourisme' },
              { name: 'Turquie', image: '/destinations/turquie.jpg', desc: 'Voyages et études' },
            ].map((dest, i) => (
              <DestinationCard key={i} {...dest} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/blog" className="inline-flex items-center gap-2 text-primary dark:text-red-400 font-semibold hover:underline">
              Voir plus de destinations <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-accent dark:text-white">Nos services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: FileText, title: 'Documents administratifs', desc: 'CIP, casier judiciaire, acte de naissance...', link: '/services', image: '/services/documents.jpg' },
              { icon: Globe, title: 'Visas & Voyages', desc: 'Tourisme, travail, études à l\'étranger.', link: '/rdv', image: '/services/visa.jpg' },
              { icon: GraduationCap, title: 'Formations & Coaching', desc: 'Développez vos compétences avec nos experts.', link: '/formations', image: '/formations/informatique.jpg' },
            ].map((service, i) => (
              <motion.div key={i} whileHover={{ scale: 1.03 }} className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700">
                <img src={service.image} alt={service.title} className="w-full h-48 object-cover" loading="lazy" />
                <div className="p-6">
                  <service.icon className="w-10 h-10 text-primary mb-3" />
                  <h3 className="text-xl font-semibold mb-2 text-accent dark:text-white">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{service.desc}</p>
                  <Link to={service.link} className="text-primary dark:text-red-400 font-medium hover:underline">En savoir plus</Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Formations en vedette */}
      <section className="py-16 bg-light dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-accent dark:text-white">Formations & Coaching</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FormationCard
              title="Formation en informatique"
              image="/formations/informatique.jpg"
              category="formation"
              duration="3 mois"
            />
            <FormationCard
              title="Coaching visa"
              image="/formations/coaching.jpg"
              category="coaching"
              duration="1 séance"
            />
            <FormationCard
              title="Préparation entretien consulaire"
              image="/formations/entretien.jpg"
              category="coaching"
              duration="2 heures"
            />
          </div>
          <div className="text-center mt-8">
            <Link to="/formations" className="inline-flex items-center gap-2 text-primary dark:text-red-400 font-semibold hover:underline">
              Voir toutes les formations <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Espace VIP */}
      <section className="py-16 bg-gradient-to-r from-primary to-red-800 text-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Espace VIP</h2>
          <p className="text-lg mb-8">Un accompagnement personnalisé, des réponses prioritaires et un coaching sur mesure pour réussir vos démarches.</p>
          <a
            href={`https://wa.me/2290152431717?text=${encodeURIComponent("Bonjour, je suis intéressé par l'espace VIP.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-primary font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition inline-flex items-center gap-2"
          >
            Rejoindre le VIP <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-xl mx-auto px-4">
          <NewsletterSubscribe />
        </div>
      </section>
    </motion.div>
  );
}
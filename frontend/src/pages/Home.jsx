import { motion } from 'framer-motion';
import VideoBackground from '../components/common/VideoBackground';
import SearchBar from '../components/common/SearchBar';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Globe, GraduationCap } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import LocalBusinessSchema from '../components/common/StructuredData';

// Toutes les vidéos du dossier public
const heroVideos = [
  '/coverr-boy-and-girl-studying-outdoors-6650-1080p.mp4',
  '/coverr-plane-engine-in-the-air-2809-1080p.mp4',
  '/coverr-ready-for-takeoff-traveler-with-suitcase-1080p.mp4',
  '/coverr-woman-walking-with-luggage-on-street-1080p.mp4',
  '/istockphoto-112224288-640_adpp_is.mp4',
  '/istockphoto-1413476555-640_adpp_is.mp4',
];

const posterImage = '/nick-morrison-FHnnjk1Yj7Y-unsplash.jpg';

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>ZT-Voyage – Visas, études, voyages au Bénin</title>
        <meta
          name="description"
          content="Agence de services administratifs et voyages à Cotonou, Bénin. Obtenez votre visa, vos documents (CIP, casier judiciaire) et préparez vos études à l'étranger."
        />
        <link rel="canonical" href="https://zt-voyage.com" />
      </Helmet>

      <LocalBusinessSchema />

      {/* Fond vidéo avec rotation aléatoire */}
      <VideoBackground videoSrcs={heroVideos} posterSrc={posterImage}>
        <div className="text-center text-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 drop-shadow-lg">
            Votre avenir commence ici
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 drop-shadow">
            Visa études, travail et visite dans tous les pays: nous vous accompagnons de A à Z
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              to="/rdv"
              className="bg-secondary text-primary px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:bg-yellow-500 transition inline-flex items-center gap-2 shadow-lg text-sm sm:text-base"
            >
              Prendre rendez-vous <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/blog"
              className="bg-white/20 backdrop-blur text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:bg-white/30 transition text-sm sm:text-base"
            >
              Nos articles
            </Link>
          </div>
        </div>
      </VideoBackground>

      {/* Section services */}
      <section className="py-12 md:py-16 bg-light dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              icon: FileText,
              title: 'Documents administratifs',
              desc: 'CIP, casier judiciaire, acte de naissance...',
            },
            {
              icon: Globe,
              title: 'Visas & Voyages',
              desc: 'Tourisme, travail, études à l\'étranger.',
            },
            {
              icon: GraduationCap,
              title: 'Études',
              desc: 'Orientation et inscription dans les universités.',
            },
          ].map((service, i) => (
            <motion.div
              key={i}
              className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md text-center border border-gray-100 dark:border-gray-600"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.2 }}
            >
              <service.icon className="w-10 h-10 sm:w-12 sm:h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-accent dark:text-white">
                {service.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section recherche */}
      <section className="py-12 md:py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-accent dark:text-white">
            Trouvez un article
          </h2>
          <SearchBar />
        </div>
      </section>
    </motion.div>
  );
}
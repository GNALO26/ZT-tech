import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import NewsletterSubscribe from '../components/blog/NewsletterSubscribe';

export default function Newsletter() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl mx-auto px-4 py-10">
      <Helmet>
        <title>Newsletter | ZT-Voyage</title>
        <meta name="description" content="Abonnez-vous à notre newsletter pour recevoir nos actualités et offres." />
      </Helmet>
      <h1 className="text-3xl font-bold text-center mb-8">Newsletter</h1>
      <NewsletterSubscribe />
    </motion.div>
  );
}
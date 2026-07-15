import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../services/api';
import ShareButtons from '../components/blog/ShareButtons';
import { motion } from 'framer-motion';

export default function BlogArticle() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/articles/${slug}`)
      .then(res => setArticle(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-10">Chargement...</div>;
  if (!article) return <div className="max-w-4xl mx-auto px-4 py-10">Article introuvable</div>;

  const articleUrl = window.location.href;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto px-4 py-10">
      <Helmet>
        <title>{article.meta_title || article.title}</title>
        <meta name="description" content={article.meta_description} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.meta_description} />
        <meta property="og:image" content={article.featured_image_url} />
        <meta property="og:url" content={articleUrl} />
      </Helmet>

      <img src={article.featured_image_url || '/images/placeholder.jpg'} alt={article.title} className="w-full h-64 md:h-96 object-cover rounded-xl mb-8" />
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
      <div className="flex justify-between items-center mb-6">
        <span className="text-gray-500">{new Date(article.createdAt).toLocaleDateString()}</span>
        <ShareButtons title={article.title} url={articleUrl} />
      </div>
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
    </motion.div>
  );
}
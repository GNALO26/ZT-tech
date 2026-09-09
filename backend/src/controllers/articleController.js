const Article = require('../models/Article');

// Échappe les caractères spéciaux d'une chaîne pour une utilisation sûre dans une regex
const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Recherche d'articles par mot-clé dans le titre ou le contenu.
 * GET /api/articles?search=...
 */
exports.search = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search && search.trim() !== '') {
      const escaped = escapeRegex(search.trim());
      const regex = new RegExp(escaped, 'i'); // insensible à la casse
      query = {
        $or: [
          { title: { $regex: regex } },
          { content: { $regex: regex } },
        ],
      };
    }

    // Récupération des articles, triés du plus récent au plus ancien, limités à 10
    const articles = await Article.find(query)
      .select('title slug createdAt featured_image_url')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ articles });
  } catch (err) {
    console.error('Erreur recherche articles :', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

/**
 * Récupère un article complet par son slug.
 * GET /api/articles/:slug
 */
exports.getBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    if (!slug) {
      return res.status(400).json({ message: 'Slug requis.' });
    }

    const article = await Article.findOne({ slug });
    if (!article) {
      return res.status(404).json({ message: 'Article non trouvé.' });
    }

    res.json(article);
  } catch (err) {
    console.error('Erreur récupération article :', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
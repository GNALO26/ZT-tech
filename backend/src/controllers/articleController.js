const Article = require('../models/Article');

exports.search = async (req, res) => {
  const { search } = req.query;
  const query = search ? { title: { $regex: search, $options: 'i' } } : {};
  try {
    const articles = await Article.find(query).select('title slug createdAt featured_image_url').sort({ createdAt: -1 }).limit(10);
    res.json({ articles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.getBySlug = async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug });
    if (!article) return res.status(404).json({ message: 'Article non trouvé.' });
    res.json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
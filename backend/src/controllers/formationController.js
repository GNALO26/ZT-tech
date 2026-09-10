const Formation = require('../models/Formation');

// Utilitaire pour obtenir l'URL de base à partir de la requête
const getBaseUrl = (req) => `${req.protocol}://${req.get('host')}`;

// Liste publique avec filtre catégorie
exports.list = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category && category !== 'all') filter.category = category;
    const formations = await Formation.find(filter).sort({ createdAt: -1 });
    res.json(formations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Détail par slug
exports.getBySlug = async (req, res) => {
  try {
    const formation = await Formation.findOne({ slug: req.params.slug });
    if (!formation) return res.status(404).json({ message: 'Formation non trouvée.' });
    res.json(formation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Créer une formation (admin)
exports.create = async (req, res) => {
  try {
    const baseUrl = getBaseUrl(req);
    const data = {
      ...req.body,
      image_url: req.file
        ? `${baseUrl}/uploads/formations/${req.file.filename}`
        : req.body.image_url || '/images/placeholder.jpg'
    };
    const formation = await Formation.create(data);
    res.status(201).json(formation);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Ce slug existe déjà.' });
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Modifier une formation (admin)
exports.update = async (req, res) => {
  try {
    const baseUrl = getBaseUrl(req);
    const updateData = {
      ...req.body,
      image_url: req.file
        ? `${baseUrl}/uploads/formations/${req.file.filename}`
        : req.body.image_url
    };
    const formation = await Formation.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!formation) return res.status(404).json({ message: 'Formation non trouvée.' });
    res.json(formation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Supprimer une formation (admin)
exports.delete = async (req, res) => {
  try {
    const formation = await Formation.findByIdAndDelete(req.params.id);
    if (!formation) return res.status(404).json({ message: 'Formation non trouvée.' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
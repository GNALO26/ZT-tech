const mongoose = require('mongoose');
const Reaction = require('../models/Reaction');

exports.toggleReaction = async (req, res) => {
  try {
    const { articleId } = req.params;
    const { type } = req.body;
    const ip = req.ip || req.connection.remoteAddress;

    if (!['like', 'interested'].includes(type)) {
      return res.status(400).json({ message: 'Type invalide' });
    }

    const existing = await Reaction.findOne({ article_id: articleId, type, ip });
    if (existing) {
      await Reaction.deleteOne({ _id: existing._id });
      return res.json({ added: false });
    }

    await Reaction.create({ article_id: articleId, type, ip });
    res.json({ added: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getCounts = async (req, res) => {
  try {
    const { articleId } = req.params;
    const counts = await Reaction.aggregate([
      { $match: { article_id: new mongoose.Types.ObjectId(articleId) } },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    const result = { like: 0, interested: 0 };
    counts.forEach(c => { result[c._id] = c.count; });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
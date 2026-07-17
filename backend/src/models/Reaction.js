const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
  article_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
  type: { type: String, enum: ['like', 'interested'], required: true },
  ip: { type: String, required: true },
}, { timestamps: true });

reactionSchema.index({ article_id: 1, type: 1, ip: 1 }, { unique: true });

module.exports = mongoose.model('Reaction', reactionSchema);
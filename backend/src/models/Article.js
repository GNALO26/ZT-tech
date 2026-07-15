const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String },
  featured_image_url: { type: String },
  meta_title: { type: String },
  meta_description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Article', articleSchema);
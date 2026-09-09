const mongoose = require('mongoose');

const formationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  image_url: { type: String, default: '/images/placeholder.jpg' },
  category: { type: String, enum: ['formation', 'coaching'], default: 'formation' },
  price: { type: String, default: '' },
  duration: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Formation', formationSchema);
require('dotenv').config();
const mongoose = require('mongoose');
const Article = require('../src/models/Article');

// Fonction pour décoder les entités HTML échappées
function decodeHtmlEntities(str) {
  if (!str) return str;
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const articles = await Article.find();
    let fixed = 0;
    for (const article of articles) {
      if (article.content && /&lt;|&gt;|&amp;/.test(article.content)) {
        article.content = decodeHtmlEntities(article.content);
        await article.save();
        fixed++;
        console.log(`✅ Corrigé : ${article.title}`);
      }
    }
    console.log(`Total articles corrigés : ${fixed}`);
    process.exit();
  })
  .catch(err => {
    console.error('Erreur :', err);
    process.exit(1);
  });
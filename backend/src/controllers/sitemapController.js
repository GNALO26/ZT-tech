const Article = require('../models/Article');

module.exports = async (req, res) => {
  try {
    const baseUrl = 'https://zttechnologies.bj';
    const articles = await Article.find({}, 'slug updatedAt');
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    xml += `  <url><loc>${baseUrl}/</loc></url>\n`;
    xml += `  <url><loc>${baseUrl}/rdv</loc></url>\n`;
    xml += `  <url><loc>${baseUrl}/blog</loc></url>\n`;
    xml += `  <url><loc>${baseUrl}/contact</loc></url>\n`;
    xml += `  <url><loc>${baseUrl}/about</loc></url>\n`;
    articles.forEach(a => {
      xml += `  <url><loc>${baseUrl}/blog/${a.slug}</loc><lastmod>${a.updatedAt.toISOString()}</lastmod></url>\n`;
    });
    xml += '</urlset>';
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
};
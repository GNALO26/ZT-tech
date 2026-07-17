const Article = require('../models/Article');

module.exports = async (req, res) => {
  try {
    const baseUrl = 'https://zt-voyage.com';
    const articles = await Article.find({}, 'slug updatedAt');
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Pages statiques
    const staticPages = [
      { loc: '/', changefreq: 'weekly', priority: '1.0' },
      { loc: '/rdv', changefreq: 'monthly', priority: '0.8' },
      { loc: '/blog', changefreq: 'daily', priority: '0.9' },
      { loc: '/about', changefreq: 'monthly', priority: '0.7' },
      { loc: '/services', changefreq: 'monthly', priority: '0.8' },
      { loc: '/contact', changefreq: 'monthly', priority: '0.7' },
      { loc: '/mentions-legales', changefreq: 'yearly', priority: '0.3' },
      { loc: '/politique-de-confidentialite', changefreq: 'yearly', priority: '0.3' },
    ];

    staticPages.forEach(page => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${page.loc}</loc>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `  </url>\n`;
    });

    // Articles de blog dynamiques
    articles.forEach(article => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/blog/${article.slug}</loc>\n`;
      if (article.updatedAt) {
        xml += `    <lastmod>${article.updatedAt.toISOString()}</lastmod>\n`;
      }
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.6</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += '</urlset>';
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    console.error('Erreur sitemap :', err);
    res.status(500).send('Erreur serveur');
  }
};
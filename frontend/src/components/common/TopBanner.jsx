const Article = require('../models/Article');
const Formation = require('../models/Formation');

module.exports = async (req, res) => {
  try {
    const baseUrl = 'https://zt-voyage.com';
    const articles = await Article.find({}, 'slug updatedAt');
    const formations = await Formation.find({}, 'slug updatedAt');

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Pages statiques prioritaires
    const staticPages = [
      { loc: '/', priority: '1.0', changefreq: 'weekly' },
      { loc: '/rdv', priority: '0.9', changefreq: 'monthly' },
      { loc: '/services', priority: '0.9', changefreq: 'monthly' },
      { loc: '/location-voiture', priority: '0.8', changefreq: 'monthly' },
      { loc: '/formations', priority: '0.9', changefreq: 'weekly' },
      { loc: '/coaching', priority: '0.8', changefreq: 'monthly' },
      { loc: '/vip', priority: '0.8', changefreq: 'monthly' },
      { loc: '/blog', priority: '0.9', changefreq: 'daily' },
      { loc: '/about', priority: '0.7', changefreq: 'monthly' },
      { loc: '/contact', priority: '0.7', changefreq: 'monthly' },
      { loc: '/newsletter', priority: '0.5', changefreq: 'monthly' },
      { loc: '/mentions-legales', priority: '0.3', changefreq: 'yearly' },
      { loc: '/politique-de-confidentialite', priority: '0.3', changefreq: 'yearly' },
    ];

    staticPages.forEach(p => {
      xml += `  <url>\n    <loc>${baseUrl}${p.loc}</loc>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>\n`;
    });

    // Articles
    articles.forEach(a => {
      xml += `  <url>\n    <loc>${baseUrl}/blog/${a.slug}</loc>\n`;
      if (a.updatedAt) xml += `    <lastmod>${a.updatedAt.toISOString()}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    });

    // Formations
    formations.forEach(f => {
      xml += `  <url>\n    <loc>${baseUrl}/formations/${f.slug}</loc>\n`;
      if (f.updatedAt) xml += `    <lastmod>${f.updatedAt.toISOString()}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
    });

    xml += '</urlset>';
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    console.error('Erreur sitemap :', err);
    res.status(500).send('Erreur serveur');
  }
};
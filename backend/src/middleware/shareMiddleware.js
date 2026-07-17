const Article = require('../models/Article');

const BOTS = /facebookexternalhit|WhatsApp|Twitterbot|LinkedInBot|TelegramBot|Discordbot|Slackbot/i;

module.exports = async (req, res, next) => {
  const userAgent = req.get('User-Agent') || '';
  if (!BOTS.test(userAgent)) return next();

  const parts = req.path.split('/');
  if (parts[1] !== 'blog' || !parts[2]) return next();

  const slug = parts[2];
  try {
    const article = await Article.findOne({ slug });
    if (!article) return next();

    const html = `<!DOCTYPE html>
<html>
<head>
  <title>${article.meta_title || article.title}</title>
  <meta property="og:title" content="${article.title}">
  <meta property="og:description" content="${article.meta_description || ''}">
  <meta property="og:image" content="${article.featured_image_url}">
  <meta property="og:url" content="https://zt-voyage.com/blog/${article.slug}">
  <meta name="twitter:card" content="summary_large_image">
</head>
<body></body>
</html>`;

    res.set('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('Erreur shareMiddleware :', error);
    next();
  }
};
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const Sentry = require('@sentry/node');
const connectDB = require('./src/config/db');
const shareMiddleware = require('./src/middleware/shareMiddleware');
const logger = require('./src/config/logger');

// Connexion MongoDB
connectDB();

// Initialisation Sentry (avant les routes)
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
  });
}

const app = express();

app.set('trust proxy', 1);

// Morgan pour les logs HTTP (dans le format 'combined')
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// Sécurité
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://zt-tech.netlify.app',
  credentials: true,
}));

// Parsers avec limite de taille
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// Middleware de maintenance
app.use((req, res, next) => {
  if (process.env.MAINTENANCE_MODE === 'true' && !req.path.startsWith('/api/admin')) {
    return res.status(503).json({ message: 'Site en maintenance. Veuillez revenir plus tard.' });
  }
  next();
});

// En-têtes de sécurité supplémentaires
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Servir les fichiers uploadés
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware de partage réseaux sociaux
app.use(shareMiddleware);

// Import des routes
const appointmentsRoute = require('./src/routes/appointments');
const articlesRoute = require('./src/routes/articles');
const adminRoute = require('./src/routes/admin');
const contactRoute = require('./src/routes/contact');
const chatRoute = require('./src/routes/chat');
const reactionsRoute = require('./src/routes/reactions');

// Montage des routes
app.use('/api/appointments', appointmentsRoute);
app.use('/api/articles', articlesRoute);
app.use('/api/admin', adminRoute);
app.use('/api/contact', contactRoute);
app.use('/api/chat', chatRoute);
app.use('/api/articles', reactionsRoute);

// Endpoint de santé
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Sitemap
app.get('/sitemap.xml', require('./src/controllers/sitemapController'));

// Sentry error handler
if (process.env.SENTRY_DSN) {
  app.use(Sentry.Handlers.errorHandler());
}

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Démarrage
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  logger.info(`✅ Serveur démarré sur le port ${PORT}`);
});
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/config/db');
const shareMiddleware = require('./src/middleware/shareMiddleware');

// Connexion à MongoDB
connectDB();

const app = express();

// Sécurité
app.use(helmet());

// CORS – autorise le frontend (à adapter selon l'URL de production)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Parsers
app.use(express.json());
app.use(cookieParser());

// Middleware de partage pour les réseaux sociaux (avant les routes API)
app.use(shareMiddleware);

// Import des routes
const appointmentsRoute = require('./src/routes/appointments');
const articlesRoute = require('./src/routes/articles');
const adminRoute = require('./src/routes/admin');
const contactRoute = require('./src/routes/contact');
const chatRoute = require('./src/routes/chat');

// Montage des routes
app.use('/api/appointments', appointmentsRoute);
app.use('/api/articles', articlesRoute);
app.use('/api/admin', adminRoute);
app.use('/api/contact', contactRoute);
app.use('/api/chat', chatRoute);

// Endpoint de santé
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Sitemap
app.get('/sitemap.xml', require('./src/controllers/sitemapController'));

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Démarrage du serveur
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
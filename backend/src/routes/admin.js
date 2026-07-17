const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/adminController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const articleSchema = require('../validators/article');
const upload = require('../middleware/upload');

// Auth
router.post('/login', ctrl.login);
router.get('/me', auth, ctrl.me);

// Articles (avec upload d'image)
router.get('/articles', auth, ctrl.getAllArticles);
router.post('/articles', auth, upload.single('featured_image'), (req, res, next) => {
  if (req.file) {
    req.body.featuredImageUrl = `/uploads/articles/${req.file.filename}`;
  }
  next();
}, validate(articleSchema), ctrl.createArticle);
router.put('/articles/:id', auth, upload.single('featured_image'), (req, res, next) => {
  if (req.file) {
    req.body.featuredImageUrl = `/uploads/articles/${req.file.filename}`;
  }
  next();
}, validate(articleSchema), ctrl.updateArticle);
router.delete('/articles/:id', auth, ctrl.deleteArticle);

// Rendez-vous
router.get('/appointments', auth, ctrl.getAppointments);
router.get('/appointments/today', auth, ctrl.getTodayAppointments);   // ← nouvelle route
router.get('/appointments/export/pdf', auth, ctrl.exportAppointmentsPDF);
router.get('/stats', auth, ctrl.getStats);

module.exports = router;
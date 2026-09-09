const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/adminController');
const subscriberCtrl = require('../controllers/subscriberController');
const formationCtrl = require('../controllers/formationController');
const vipCtrl = require('../controllers/vipController');
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
  if (req.file) req.body.featuredImageUrl = `/uploads/articles/${req.file.filename}`;
  next();
}, validate(articleSchema), ctrl.createArticle);
router.put('/articles/:id', auth, upload.single('featured_image'), (req, res, next) => {
  if (req.file) req.body.featuredImageUrl = `/uploads/articles/${req.file.filename}`;
  next();
}, validate(articleSchema), ctrl.updateArticle);
router.delete('/articles/:id', auth, ctrl.deleteArticle);

// Rendez-vous
router.get('/appointments', auth, ctrl.getAppointments);
router.get('/appointments/today', auth, ctrl.getTodayAppointments);
router.get('/appointments/export/pdf', auth, ctrl.exportAppointmentsPDF);
router.delete('/appointments/:id', auth, ctrl.deleteAppointment);

// Statistiques
router.get('/stats', auth, ctrl.getStats);

// Abonnés (newsletter)
router.get('/subscribers', auth, subscriberCtrl.getAll);
router.delete('/subscribers/:id', auth, subscriberCtrl.deleteSubscriber);

// Formations & coaching (CRUD admin)
router.get('/formations', auth, formationCtrl.list); // liste admin (peut réutiliser)
router.post('/formations', auth, upload.single('image'), formationCtrl.create); // si upload d'image, adapter
router.put('/formations/:id', auth, formationCtrl.update);
router.delete('/formations/:id', auth, formationCtrl.delete);

// Demandes VIP
router.get('/vip-requests', auth, vipCtrl.getAll);
router.delete('/vip-requests/:id', auth, vipCtrl.delete);

module.exports = router;
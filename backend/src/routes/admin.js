const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/adminController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const articleSchema = require('../validators/article');

router.post('/login', ctrl.login);
router.get('/me', auth, ctrl.me);

// Gestion des articles
router.get('/articles', auth, ctrl.getAllArticles);
router.post('/articles', auth, validate(articleSchema), ctrl.createArticle);
router.put('/articles/:id', auth, validate(articleSchema), ctrl.updateArticle);
router.delete('/articles/:id', auth, ctrl.deleteArticle);

// Gestion des rendez-vous (admin)
router.get('/appointments', auth, ctrl.getAppointments);

module.exports = router;
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/articleController');

router.get('/', ctrl.search);
router.get('/:slug', ctrl.getBySlug);

module.exports = router;
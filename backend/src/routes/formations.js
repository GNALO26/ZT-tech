const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/formationController');

router.get('/', ctrl.list);
router.get('/:slug', ctrl.getBySlug);

module.exports = router;
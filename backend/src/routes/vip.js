const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/vipController');

router.post('/', ctrl.create);

module.exports = router;
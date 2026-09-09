const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/subscriberController');

router.post('/subscribe', ctrl.subscribe);
router.post('/unsubscribe', ctrl.unsubscribe);

module.exports = router;
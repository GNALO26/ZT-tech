const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/appointmentController');
const validate = require('../middleware/validate');
const schema = require('../validators/appointment');
const limiter = require('../middleware/rateLimiter');

router.post('/', limiter, validate(schema), ctrl.create);
router.get('/slots', ctrl.getSlots);

module.exports = router;
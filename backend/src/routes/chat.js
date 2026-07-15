const express = require('express');
const router = express.Router();            // ← manquant dans votre version
const chatController = require('../controllers/chatController');
const rateLimit = require('express-rate-limit');

const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10,
  message: { error: 'Trop de messages. Veuillez patienter.' },
});

router.post('/', chatLimiter, chatController.chat);

module.exports = router;
const rateLimit = require('express-rate-limit');

const appointmentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 tentatives par IP
  message: { message: 'Trop de demandes. Veuillez réessayer dans 15 minutes.' },
});

module.exports = appointmentLimiter;
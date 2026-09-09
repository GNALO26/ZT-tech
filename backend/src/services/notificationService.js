const Subscriber = require('../models/Subscriber');
const { sendConfirmationEmail } = require('./emailService');

/**
 * Envoie un email de notification à tous les abonnés.
 * @param {string} subject - Sujet de l'email
 * @param {string} text - Contenu texte
 */
exports.notifySubscribers = async (subject, text) => {
  try {
    const subscribers = await Subscriber.find();
    const sendPromises = subscribers.map(sub => {
      return sendConfirmationEmail(sub.email, subject, text, null)
        .catch(err => console.error(`Échec envoi à ${sub.email}:`, err.message));
    });
    await Promise.all(sendPromises);
    console.log(`Notifications envoyées à ${subscribers.length} abonnés.`);
  } catch (err) {
    console.error('Erreur notification abonnés:', err);
  }
};
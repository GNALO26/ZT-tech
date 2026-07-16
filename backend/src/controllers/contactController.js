const Contact = require('../models/Contact');

exports.submit = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Nom, email et message sont obligatoires.' });
    }
    const contact = await Contact.create({ name, email, subject, message });
    res.status(201).json({ success: true, id: contact._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
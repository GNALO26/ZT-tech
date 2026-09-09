const VipRequest = require('../models/VipRequest');

// Enregistrer une demande VIP (appelée avant la redirection WhatsApp)
exports.create = async (req, res) => {
  try {
    const { name, phone, message } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ message: 'Nom et téléphone requis.' });
    }
    const vip = await VipRequest.create({ name, phone, message });
    res.status(201).json({ success: true, id: vip._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Liste des demandes VIP (protégé admin)
exports.getAll = async (req, res) => {
  try {
    const requests = await VipRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Supprimer une demande VIP (protégé admin)
exports.delete = async (req, res) => {
  try {
    const vip = await VipRequest.findByIdAndDelete(req.params.id);
    if (!vip) return res.status(404).json({ message: 'Demande non trouvée.' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
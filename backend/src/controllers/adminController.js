const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Article = require('../models/Article');
const Appointment = require('../models/Appointment');
const PDFDocument = require('pdfkit');

// --------------- AUTH ---------------
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Identifiants incorrects.' });
    const valid = await user.comparePassword(password);
    if (!valid) return res.status(401).json({ message: 'Identifiants incorrects.' });
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, {
  httpOnly: true,
  secure: true,               // obligatoire pour sameSite: 'none'
  sameSite: 'none',           // autorise les requêtes cross-origin
  maxAge: 86400000,           // 1 jour
});
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.me = (req, res) => {
  res.json({ email: req.admin.email });
};

// --------------- ARTICLES ---------------
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.createArticle = async (req, res) => {
  try {
    const articleData = {
      ...req.body,
      featured_image_url: req.file ? `/uploads/articles/${req.file.filename}` : req.body.featuredImageUrl || ''
    };
    const article = await Article.create(articleData);
    res.status(201).json(article);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Ce slug existe déjà.' });
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.updateArticle = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      featured_image_url: req.file ? `/uploads/articles/${req.file.filename}` : req.body.featuredImageUrl
    };
    const article = await Article.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!article) return res.status(404).json({ message: 'Article non trouvé.' });
    res.json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article non trouvé.' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// --------------- APPOINTMENTS ---------------
exports.getAppointments = async (req, res) => {
  try {
    const { start, end } = req.query;
    const filter = {};
    if (start || end) {
      filter.appointment_date = {};
      if (start) filter.appointment_date.$gte = new Date(start);
      if (end) filter.appointment_date.$lte = new Date(end);
    }
    const appointments = await Appointment.find(filter).sort({ appointment_date: -1 });
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.getTodayAppointments = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointments = await Appointment.find({
      appointment_date: { $gte: today, $lt: tomorrow },
    }).sort({ appointment_time: 1 });

    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.exportAppointmentsPDF = async (req, res) => {
  try {
    const { start, end } = req.query;
    const filter = {};
    if (start || end) {
      filter.appointment_date = {};
      if (start) filter.appointment_date.$gte = new Date(start);
      if (end) filter.appointment_date.$lte = new Date(end);
    }
    const appointments = await Appointment.find(filter).sort({ appointment_date: 1 });

    const doc = new PDFDocument();
    const buffers = [];
    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=rendez-vous.pdf');
      res.send(pdfBuffer);
    });

    doc.fontSize(16).text('Liste des rendez-vous', { align: 'center' });
    doc.moveDown();
    appointments.forEach(apt => {
      doc.fontSize(12).text(`${apt.appointment_date.toISOString().split('T')[0]} ${apt.appointment_time} - ${apt.first_name} ${apt.last_name} (${apt.visa_type})`);
    });
    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de l\'export.' });
  }
};
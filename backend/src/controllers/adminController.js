const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Article = require('../models/Article');
const Appointment = require('../models/Appointment');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

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
      secure: true,               // nécessaire pour sameSite: 'none'
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

    // Format paysage pour 8 colonnes
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 30 });
    const buffers = [];
    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=rendez-vous.pdf');
      res.send(pdfBuffer);
    });

    // Logo (si présent)
    const logoPath = path.join(__dirname, '../assets/logo.png');
    try {
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 30, 20, { width: 50 });
        doc.image(logoPath, doc.page.width - 80, 20, { width: 50 });
      }
    } catch (e) { /* ignore */ }

    // Titre
    doc.moveDown(3);
    doc.fontSize(20).fillColor('#DC2626').font('Helvetica-Bold')
       .text('ZT Technologies – Rendez-vous', { align: 'center' });
    doc.moveDown(0.5);
    if (start || end) {
      let filtre = 'Période : ';
      if (start) filtre += `du ${new Date(start).toLocaleDateString('fr-FR')} `;
      if (end) filtre += `au ${new Date(end).toLocaleDateString('fr-FR')}`;
      doc.fontSize(10).fillColor('#6B7280').text(filtre, { align: 'center' });
    }
    doc.moveDown(1);

    // Définition des colonnes (largeurs réparties sur ~781 pts utiles)
    const startX = 30;
    const colWidths = [65, 55, 75, 160, 95, 85, 140, 60]; // total = 735, ok
    const headers = ['Date', 'Heure', 'Type visa', 'Nom complet', 'Destination', 'Ville', 'Contact', 'Notif.'];
    const headerHeight = 20;
    const rowHeight = 28; // hauteur de ligne augmentée

    let xCursor = startX;

    // En-tête du tableau
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#FFFFFF');
    doc.rect(startX, doc.y, doc.page.width - 60, headerHeight).fill('#1F2937');
    doc.fillColor('#FFFFFF');
    headers.forEach((h, i) => {
      doc.text(h, xCursor + 2, doc.y - headerHeight + 3, { width: colWidths[i], align: 'left' });
      xCursor += colWidths[i];
    });
    doc.moveDown(headerHeight / 14); // ajustement pour laisser l'espace

    doc.fillColor('#374151').font('Helvetica').fontSize(9);
    let y = doc.y;

    appointments.forEach((apt, index) => {
      // Fond alterné
      if (index % 2 === 0) {
        doc.rect(startX, y, doc.page.width - 60, rowHeight).fill('#F9FAFB');
      }
      doc.fillColor('#374151');

      const dateStr = new Date(apt.appointment_date).toLocaleDateString('fr-FR');
      const fullName = `${apt.first_name} ${apt.last_name}`;
      const contact = `${apt.email}\n${apt.whatsapp_number}`;

      xCursor = startX;
      const rowData = [
        dateStr,
        apt.appointment_time,
        apt.visa_type,
        fullName,
        apt.destination_country,
        apt.city_of_residence,
        contact,
        apt.notification_method,
      ];

      rowData.forEach((text, i) => {
        doc.text(text, xCursor + 2, y + 2, { width: colWidths[i] - 4, align: 'left', lineGap: 2 });
        xCursor += colWidths[i];
      });

      y += rowHeight;

      // Nouvelle page si nécessaire
      if (y > doc.page.height - 50) {
        doc.addPage();
        y = 50;
        // Redessiner l'en-tête sur la nouvelle page
        xCursor = startX;
        doc.rect(startX, y, doc.page.width - 60, headerHeight).fill('#1F2937');
        doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(10);
        headers.forEach((h, i) => {
          doc.text(h, xCursor + 2, y + 3, { width: colWidths[i], align: 'left' });
          xCursor += colWidths[i];
        });
        doc.fillColor('#374151').font('Helvetica').fontSize(9);
        y += headerHeight;
      }
    });

    // Ligne de fin
    doc.moveTo(startX, y).lineTo(doc.page.width - 30, y).strokeColor('#E5E7EB').stroke();

    // Pied de page
    doc.fontSize(9).fillColor('#9CA3AF').text(
      `Document généré le ${new Date().toLocaleDateString('fr-FR')} – ZT Technologies`,
      startX, doc.page.height - 40, { align: 'center' }
    );

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de l\'export.' });
  }
};
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

exports.generateConfirmationPDF = (appointment) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margins: { top: 50, bottom: 50, left: 60, right: 60 } });
    const buffers = [];
    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    // ---------- LOGO ----------
    const logoPath = path.join(__dirname, '../assets/logo.png');
    try {
      if (fs.existsSync(logoPath)) {
        // Logo en haut à gauche
        doc.image(logoPath, 60, 40, { width: 60 });
        // Logo en haut à droite
        doc.image(logoPath, doc.page.width - 120, 40, { width: 60 });
      }
    } catch (err) {
      console.warn('Logo non trouvé, on continue sans.');
    }

    // ---------- TITRE ----------
    doc.moveDown(7); // laisse l'espace pour les logos
    doc.fontSize(22).fillColor('#DC2626').font('Helvetica-Bold')
       .text('ZT Voyage', { align: 'center' });
    doc.moveDown(0.3);
    doc.fontSize(14).fillColor('#4B5563').font('Helvetica')
       .text('Confirmation de rendez-vous', { align: 'center' });
    doc.moveDown(1);

    // Ligne rouge
    const lineY1 = doc.y;
    doc.moveTo(60, lineY1).lineTo(doc.page.width - 60, lineY1).strokeColor('#DC2626').stroke();
    doc.moveDown(1.5);

    // ---------- INFORMATIONS ----------
    doc.fontSize(16).fillColor('#111827').font('Helvetica-Bold')
       .text('Détails du rendez-vous', { underline: true });
    doc.moveDown(1);

    const dateStr = new Date(appointment.appointment_date).toLocaleDateString('fr-FR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const rows = [
      ['Date', dateStr],
      ['Heure', appointment.appointment_time],
      ['Nom complet', `${appointment.first_name} ${appointment.last_name}`],
      ['Email', appointment.email],
      ['Téléphone', appointment.whatsapp_number],
      ['Type de visa', appointment.visa_type],
      ['Destination', appointment.destination_country],
      ['Ville de résidence', appointment.city_of_residence],
    ];

    const labelX = 60;
    const valueX = 210;
    const maxWidth = doc.page.width - 60 - valueX;

    let y = doc.y;

    rows.forEach(([label, value]) => {
      // Vérification de l'espace restant en bas de page
      if (y > doc.page.height - 100) {
        doc.addPage();
        y = 50;
      }

      // Label (colonne gauche)
      doc.font('Helvetica-Bold').fontSize(11).fillColor('#1F2937')
         .text(label, labelX, y, { width: valueX - labelX - 10 });
      // Valeur (colonne droite)
      doc.font('Helvetica').fontSize(11).fillColor('#374151')
         .text(value, valueX, y, { width: maxWidth });

      y = doc.y + 12; // espacement après chaque ligne
      doc.y = y;
    });

    // Ligne rouge finale
    doc.moveDown(1);
    const lineY2 = doc.y;
    doc.moveTo(60, lineY2).lineTo(doc.page.width - 60, lineY2).strokeColor('#DC2626').stroke();
    doc.moveDown(1.5);

    // ---------- MESSAGE FINAL ----------
    doc.fontSize(12).font('Helvetica').fillColor('#6B7280')
       .text('Merci de votre confiance.', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(10)
       .text('Veuillez vous présenter avec votre passeport le jour du rendez-vous.', { align: 'center' });
    doc.moveDown(0.3);
    doc.text(`Pour toute modification, contactez-nous au ${process.env.WHATSAPP_NUMBER || '+229 52 43 17 17'}.`, { align: 'center' });

    doc.end();
  });
};
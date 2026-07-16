const PDFDocument = require('pdfkit');
const path = require('path');

exports.generateConfirmationPDF = (appointment) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    const buffers = [];
    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    const logoPath = path.join(__dirname, '../assets/logo.png');

    // En-tête avec logo
    doc.image(logoPath, doc.page.width - 120, 20, { width: 80 });   // coin haut droit
    doc.image(logoPath, 40, 20, { width: 80 });                     // coin haut gauche

    doc.moveDown(5);
    doc.fontSize(22).fillColor('#1e3a8a').text('ZT Technologies', { align: 'center' });
    doc.fontSize(14).fillColor('#4b5563').text('Confirmation de rendez-vous', { align: 'center' });
    doc.moveDown(2);

    // Ligne décorative
    doc.moveTo(40, doc.y).lineTo(doc.page.width - 40, doc.y).strokeColor('#1e3a8a').stroke();
    doc.moveDown(2);

    const date = new Date(appointment.appointment_date).toLocaleDateString('fr-FR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    // Informations du rendez-vous
    doc.fontSize(14).fillColor('#111827').text('Informations du rendez-vous');
    doc.moveDown(0.5);
    const leftX = 40;
    const col2 = 250;
    const startY = doc.y + 5;
    doc.fontSize(11).fillColor('#374151');
    const fields = [
      ['Date :', `${date}`],
      ['Heure :', `${appointment.appointment_time}`],
      ['Nom :', `${appointment.first_name} ${appointment.last_name}`],
      ['Email :', appointment.email],
      ['Téléphone :', appointment.whatsapp_number],
      ['Type de visa :', appointment.visa_type],
      ['Destination :', appointment.destination_country],
      ['Ville :', appointment.city_of_residence],
    ];
    fields.forEach(([label, value]) => {
      doc.font('Helvetica-Bold').text(label, leftX, doc.y, { continued: true, width: col2 - leftX });
      doc.font('Helvetica').text(value, col2, doc.y - 14);
      doc.moveDown(0.5);
    });

    doc.moveDown(2);
    doc.moveTo(40, doc.y).lineTo(doc.page.width - 40, doc.y).strokeColor('#1e3a8a').stroke();
    doc.moveDown(2);

    doc.fontSize(10).fillColor('#6b7280').text(
      'Merci de votre confiance. Veuillez vous présenter avec votre passeport.\n' +
      'Pour toute modification, contactez-nous au ' + (process.env.WHATSAPP_NUMBER || '+229 01 52 43 17 17') + '.',
      { align: 'center' }
    );

    doc.end();
  });
};
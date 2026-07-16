const PDFDocument = require('pdfkit');

exports.generateConfirmationPDF = (appointment) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const buffers = [];

    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    // En-tête
    doc.fontSize(20).text('ZT Technologies', { align: 'center' });
    doc.fontSize(12).text('Confirmation de rendez-vous', { align: 'center' });
    doc.moveDown(2);

    // Détails
    const date = new Date(appointment.appointment_date).toLocaleDateString('fr-FR');
    doc.fontSize(14).text(`Date : ${date} à ${appointment.appointment_time}`);
    doc.text(`Nom : ${appointment.first_name} ${appointment.last_name}`);
    doc.text(`Email : ${appointment.email}`);
    doc.text(`Téléphone : ${appointment.whatsapp_number}`);
    doc.text(`Type de visa : ${appointment.visa_type}`);
    doc.text(`Destination : ${appointment.destination_country}`);
    doc.text(`Ville : ${appointment.city_of_residence}`);
    doc.moveDown(2);
    doc.text('Merci de votre confiance. Veuillez vous présenter avec votre passeport.');

    doc.end();
  });
};
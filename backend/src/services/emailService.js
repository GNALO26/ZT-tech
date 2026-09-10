const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

/**
 * Envoie un email avec pièce jointe PDF.
 * @param {string} to - destinataire
 * @param {string} subject - sujet
 * @param {string} content - contenu (texte brut OU HTML)
 * @param {Buffer} pdfBuffer - contenu du PDF (optionnel)
 */
exports.sendConfirmationEmail = async (to, subject, content, pdfBuffer) => {
  const isHtml = content && content.trim().startsWith('<!DOCTYPE') || content.trim().startsWith('<html');

  const mailOptions = {
    from: `"ZT-Voyage" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    ...(isHtml ? { html: content } : { text: content }),
    attachments: pdfBuffer ? [
      {
        filename: 'confirmation-rdv.pdf',
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ] : [],
  };

  return transporter.sendMail(mailOptions);
};
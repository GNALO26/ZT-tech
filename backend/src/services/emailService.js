const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

exports.sendConfirmationEmail = async (to, subject, text, pdfBuffer) => {
  const mailOptions = {
    from: `"ZT Technologies" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    text,
    attachments: [
      {
        filename: 'confirmation-rdv.pdf',
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ]
  };
  return transporter.sendMail(mailOptions);
};
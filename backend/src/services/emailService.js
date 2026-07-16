const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // SSL
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  // Timeout augmenté pour éviter les faux timeouts
  connectionTimeout: 30000, // 30 secondes
  greetingTimeout: 30000,
  socketTimeout: 30000,
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
        contentType: 'application/pdf',
      },
    ],
  };
  return transporter.sendMail(mailOptions);
};
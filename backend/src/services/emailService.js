const { google } = require('googleapis');

// Configuration OAuth2
const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  'urn:ietf:wg:oauth:2.0:oob'
);

oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

/**
 * Envoie un email avec pièce jointe PDF via l'API Gmail REST.
 */
exports.sendConfirmationEmail = async (to, subject, text, pdfBuffer) => {
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  const boundary = '===============ztboundary';
  const messageParts = [
    `From: ZT Technologies <${process.env.GMAIL_USER}>`,
    `To: ${to}`,
    `Subject: =?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    text,
    '',
    `--${boundary}`,
    'Content-Type: application/pdf; name="confirmation-rdv.pdf"',
    'Content-Transfer-Encoding: base64',
    'Content-Disposition: attachment; filename="confirmation-rdv.pdf"',
    '',
    pdfBuffer.toString('base64'),
    `--${boundary}--`,
  ];

  const raw = Buffer.from(messageParts.join('\r\n'))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw },
  });
};
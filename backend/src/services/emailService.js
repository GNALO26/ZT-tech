const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  'urn:ietf:wg:oauth:2.0:oob'
);

oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

/**
 * Envoie un email (texte OU HTML) avec pièce jointe PDF via l'API Gmail.
 * @param {string} to - destinataire
 * @param {string} subject - sujet
 * @param {string} content - contenu (texte brut OU HTML commençant par <!DOCTYPE ou <html)
 * @param {Buffer} pdfBuffer - contenu du PDF (optionnel)
 */
exports.sendConfirmationEmail = async (to, subject, content, pdfBuffer) => {
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  const isHtml = content && (content.trim().startsWith('<!DOCTYPE') || content.trim().startsWith('<html'));

  const mixedBoundary = '===============mixed_zt';
  const altBoundary = '===============alt_zt';

  // En-têtes
  const headers = [
    `From: "ZT-Voyage" <${process.env.GMAIL_USER}>`,
    `To: ${to}`,
    `Subject: =?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/mixed; boundary="${mixedBoundary}"`,
    '',
  ];

  // Partie alternative (texte + HTML)
  const altPart = [
    `--${mixedBoundary}`,
    `Content-Type: multipart/alternative; boundary="${altBoundary}"`,
    '',
  ];

  let bodyParts = [];

  if (isHtml) {
    // Texte brut simplifié (strip HTML grossièrement pour fallback)
    const plainText = content.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    bodyParts = [
      `--${altBoundary}`,
      'Content-Type: text/plain; charset=UTF-8',
      'Content-Transfer-Encoding: base64',
      '',
      Buffer.from(plainText).toString('base64'),
      '',
      `--${altBoundary}`,
      'Content-Type: text/html; charset=UTF-8',
      'Content-Transfer-Encoding: base64',
      '',
      Buffer.from(content).toString('base64'),
      '',
      `--${altBoundary}--`,
      '',
    ];
  } else {
    bodyParts = [
      `--${altBoundary}`,
      'Content-Type: text/plain; charset=UTF-8',
      'Content-Transfer-Encoding: base64',
      '',
      Buffer.from(content).toString('base64'),
      '',
      `--${altBoundary}--`,
      '',
    ];
  }

  // Partie pièce jointe (optionnelle)
  let attachmentParts = [];
  if (pdfBuffer) {
    attachmentParts = [
      `--${mixedBoundary}`,
      'Content-Type: application/pdf; name="confirmation-rdv.pdf"',
      'Content-Transfer-Encoding: base64',
      'Content-Disposition: attachment; filename="confirmation-rdv.pdf"',
      '',
      pdfBuffer.toString('base64'),
      '',
    ];
  }

  const closing = [`--${mixedBoundary}--`];

  const fullMessage = [...headers, ...altPart, ...bodyParts, ...attachmentParts, ...closing].join('\r\n');

  const raw = Buffer.from(fullMessage)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw },
  });
};
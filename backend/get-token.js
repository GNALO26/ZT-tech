const { google } = require('googleapis');
const readline = require('readline');

const CLIENT_ID = '355619263855-qb68kghbt55tt6o4k70psffml1urck5t.apps.googleusercontent.com';
const CLIENT_SECRET = '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';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  'urn:ietf:wg:oauth:2.0:oob'
);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/gmail.send'],
  prompt: 'consent',
});

console.log('Ouvrez cette URL :\n', authUrl);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question('Collez le code ici : ', async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  console.log('Refresh token :', tokens.refresh_token);
  rl.close();
});
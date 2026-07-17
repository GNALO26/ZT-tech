const OpenAI = require('openai');

console.log('✅ CHAT CONTROLLER LOADED (DeepSeek)');
console.log('✅ DEEPSEEK_API_KEY :', process.env.DEEPSEEK_API_KEY ? 'définie' : 'MANQUANTE');

const openai = process.env.DEEPSEEK_API_KEY
  ? new OpenAI({
      baseURL: 'https://api.deepseek.com/v1',
      apiKey: process.env.DEEPSEEK_API_KEY,
      timeout: 8000, // timeout de 8 secondes
    })
  : null;

console.log(openai ? '✅ DeepSeek client OK' : '❌ DeepSeek client NON INITIALISÉ');

const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || '+229 52 43 17 17';

const FAQ = `
FAQ ZT Technologies :
- Horaires : Lundi-Vendredi 8h-18h, Samedi 9h-13h.
- Délai visa France : 10 jours ouvrés.
- Prix passeport : Veuillez prendre un rendez-vous ou contactez directement le service.
- Contact : ${WHATSAPP_NUMBER}
- Adresse : Cotonou, Quartier Zongo.
- Site web : https://zt-tech.netlify.app
- Rendez-vous : https://zt-tech.netlify.app/rdv
`;

const SYSTEM_PROMPT = `Tu es l'assistant virtuel de ZT Technologies, une agence de services administratifs et de voyages basée à Cotonou, Bénin.
Tu aides les clients pour :
- Les visas (tourisme, travail, études) : délais, documents requis, pays disponibles.
- Les documents administratifs : CIP, casier judiciaire, acte de naissance.
- La prise de rendez-vous.
- Les questions sur les destinations (France, Belgique, Canada, etc.).

Utilise les informations suivantes quand c'est pertinent :
${FAQ}

Règles strictes :
- Réponds toujours en français, de manière professionnelle et concise (maximum 3 phrases).
- Si la question est hors sujet, réponds poliment : "Je suis là pour vous aider sur les services de ZT Technologies. Comment puis-je vous assister ?"
- Ne donne jamais d'informations personnelles, de prix exacts ou de conseils juridiques. Invite plutôt à prendre rendez-vous.
- Si tu ne connais pas la réponse, propose de prendre rendez-vous ou d'appeler le ${WHATSAPP_NUMBER}.
- Sois chaleureux mais efficace.`;

const sessions = new Map();
const MAX_HISTORY = 3; // réduit pour plus de rapidité

function getHistory(sessionId) {
  if (!sessions.has(sessionId)) sessions.set(sessionId, []);
  return sessions.get(sessionId);
}

function addToHistory(sessionId, role, content) {
  const history = getHistory(sessionId);
  history.push({ role, content });
  if (history.length > MAX_HISTORY * 2) {
    history.splice(0, history.length - MAX_HISTORY * 2);
  }
}

const fastResponseRules = [
  { pattern: /^(bonjour|salut|hello|coucou|bjr|bsr|bonsoir)\b/i,  answer: 'Bonjour ! Comment puis-je vous aider ?' },
  { pattern: /\b(merci|thanks|merci beaucoup)\b/i,                answer: 'Avec plaisir ! N\'hésitez pas si vous avez d\'autres questions.' },
  { pattern: /\b(au revoir|bye|à bientôt|a plus)\b/i,             answer: 'À bientôt ! Passez une excellente journée.' },
  { pattern: /\b(rendez-vous|rdv|prendre rendez-vous)\b/i,        answer: 'Pour prendre un rendez-vous, rendez-vous sur https://zt-tech.netlify.app/rdv.' },
  { pattern: /\b(contact|téléphone|appeler|whatsapp)\b/i,         answer: `Vous pouvez nous appeler ou nous écrire sur WhatsApp au ${WHATSAPP_NUMBER}.` },
  { pattern: /\b(horaires|heures d'ouverture|ouverture)\b/i,      answer: 'Nous sommes ouverts du Lundi au Vendredi de 8h à 18h, et le Samedi de 9h à 13h.' },
  { pattern: /\b(adresse|localisation|où|quartier)\b/i,           answer: 'Nous sommes situés à Cotonou, Quartier Zongo.' },
  { pattern: /\b(passeport|prix passeport)\b/i,                   answer: 'Le passeport coûte 25 000 FCFA. Pour plus de détails, prenez rendez-vous.' },
  { pattern: /\b(délai visa|combien de temps)\b/i,                answer: 'Le délai pour un visa France est de 10 jours ouvrés en moyenne.' },
];

function findFastAnswer(text) {
  for (const rule of fastResponseRules) {
    if (rule.pattern.test(text)) return rule.answer;
  }
  return null;
}

exports.chat = async (req, res) => {
  const startTime = Date.now();
  try {
    const { message, sessionId } = req.body;
    if (!message) return res.status(400).json({ error: 'Message requis' });

    const userMessage = message.trim();
    const lowerMsg = userMessage.toLowerCase();
    const currentSessionId = sessionId || 'default';

    const fastAnswer = findFastAnswer(lowerMsg);
    if (fastAnswer) {
      addToHistory(currentSessionId, 'user', userMessage);
      addToHistory(currentSessionId, 'assistant', fastAnswer);
      return res.json({ reply: fastAnswer });
    }

    if (!openai) {
      return res.json({ reply: `Le service IA n'est pas disponible pour le moment. Contactez-nous au ${WHATSAPP_NUMBER}.` });
    }

    const history = getHistory(currentSessionId);
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.map(entry => ({ role: entry.role, content: entry.content })),
      { role: 'user', content: userMessage },
    ];

    console.log(`🤖 Appel DeepSeek... (session: ${currentSessionId})`);
    const completion = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages,
      temperature: 0.3,         // plus bas = plus rapide et cohérent
      max_tokens: 200,          // réponse plus courte
    });

    const reply = completion.choices[0]?.message?.content || "Je n'ai pas compris. Pouvez-vous reformuler ?";

    addToHistory(currentSessionId, 'user', userMessage);
    addToHistory(currentSessionId, 'assistant', reply);

    const duration = Date.now() - startTime;
    console.log(`✅ Réponse DeepSeek (${duration}ms)`);

    res.json({ reply });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Erreur chat (${duration}ms) :`, error.message);
    let userMsg = "Une erreur est survenue. Veuillez réessayer plus tard.";
    if (error.status === 429) userMsg = "Trop de requêtes. Merci de patienter quelques secondes.";
    else if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') userMsg = "Le service est temporairement indisponible. Veuillez réessayer.";
    else if (error.status === 402) userMsg = "Le service de chat est en maintenance. Veuillez nous contacter au +229 01 52 43 17 17.";
    res.status(500).json({ reply: userMsg });
  }
};
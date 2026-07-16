const OpenAI = require('openai');

// ---------------------------------------------------------------------------
// Initialisation du client DeepSeek (compatible OpenAI)
// ---------------------------------------------------------------------------
console.log('✅ CHAT CONTROLLER LOADED (DeepSeek)');
console.log('✅ DEEPSEEK_API_KEY :', process.env.DEEPSEEK_API_KEY ? 'définie' : 'MANQUANTE');

const openai = process.env.DEEPSEEK_API_KEY
  ? new OpenAI({
      baseURL: 'https://api.deepseek.com/v1',
      apiKey: process.env.DEEPSEEK_API_KEY,
    })
  : null;

console.log(openai ? '✅ DeepSeek client OK' : '❌ DeepSeek client NON INITIALISÉ');

// ---------------------------------------------------------------------------
// FAQ intégrée au prompt système
// ---------------------------------------------------------------------------
const FAQ = `
FAQ ZT Technologies :
- Horaires : Lundi-Vendredi 8h-18h, Samedi 9h-13h.
- Délai visa France : 10 jours ouvrés.
- Prix passeport : 25 000 FCFA.
- Contact : +229 01 56 03 58 88.
- Adresse : Cotonou, Quartier Zongo.
- Site web : https://zt-tech.netlify.app
- Rendez-vous : https://zt-tech.netlify.app/rdv
`;

// ---------------------------------------------------------------------------
// Prompt système
// ---------------------------------------------------------------------------
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
- Si tu ne connais pas la réponse, propose de prendre rendez-vous ou d'appeler le +229 01 56 03 58 88.
- Sois chaleureux mais efficace.`;

// ---------------------------------------------------------------------------
// Réponses instantanées (expressions régulières)
// ---------------------------------------------------------------------------
const fastResponseRules = [
  { pattern: /^(bonjour|salut|hello|coucou|bjr|bsr|bonsoir)\b/i,  answer: 'Bonjour ! Comment puis-je vous aider ?' },
  { pattern: /\b(merci|thanks|merci beaucoup)\b/i,                answer: 'Avec plaisir ! N\'hésitez pas si vous avez d\'autres questions.' },
  { pattern: /\b(au revoir|bye|à bientôt|a plus)\b/i,             answer: 'À bientôt ! Passez une excellente journée.' },
  { pattern: /\b(rendez-vous|rdv|prendre rendez-vous)\b/i,        answer: 'Pour prendre un rendez-vous, rendez-vous sur https://zt-tech.netlify.app/rdv.' },
  { pattern: /\b(contact|téléphone|appeler|whatsapp)\b/i,         answer: 'Vous pouvez nous appeler ou nous écrire sur WhatsApp au +229 01 56 03 58 88.' },
  { pattern: /\b(horaires|heures d'ouverture|ouverture)\b/i,      answer: 'Nous sommes ouverts du Lundi au Vendredi de 8h à 18h, et le Samedi de 9h à 13h.' },
];

function findFastAnswer(text) {
  for (const rule of fastResponseRules) {
    if (rule.pattern.test(text)) return rule.answer;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Contrôleur principal
// ---------------------------------------------------------------------------
exports.chat = async (req, res) => {
  const startTime = Date.now();
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message requis' });

    const userMessage = message.trim();
    const lowerMsg = userMessage.toLowerCase();

    // 1. Réponse instantanée
    const fastAnswer = findFastAnswer(lowerMsg);
    if (fastAnswer) return res.json({ reply: fastAnswer });

    // 2. IA indisponible
    if (!openai) {
      return res.json({ reply: "Le service IA n'est pas disponible pour le moment. Contactez-nous au +229 01 56 03 58 88." });
    }

    // 3. Appel DeepSeek via l'API Chat Completion
    console.log('🤖 Appel DeepSeek...');
    const completion = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.4,
      max_tokens: 250,
    });

    const reply = completion.choices[0]?.message?.content || "Je n'ai pas compris. Pouvez-vous reformuler ?";
    const duration = Date.now() - startTime;
    console.log(`✅ Réponse DeepSeek (${duration}ms)`);
    res.json({ reply });

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Erreur chat (${duration}ms) :`, error.message);

    let userMsg = "Une erreur est survenue. Veuillez réessayer plus tard.";
    if (error.status === 429) userMsg = "Trop de requêtes. Merci de patienter quelques secondes.";
    else if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') userMsg = "Le service est temporairement indisponible. Veuillez réessayer.";

    res.status(500).json({ reply: userMsg });
  }
};
const { GoogleGenAI } = require('@google/genai');

// ---------------------------------------------------------------------------
// Initialisation
// ---------------------------------------------------------------------------
console.log('✅ CHAT CONTROLLER LOADED');
console.log('✅ GEMINI_API_KEY :', process.env.GEMINI_API_KEY ? 'définie' : 'MANQUANTE');

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

console.log(ai ? '✅ GoogleGenAI OK' : '❌ GoogleGenAI NON INITIALISÉ');

// ---------------------------------------------------------------------------
// FAQ interne (sera incluse dans le prompt système)
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
// Prompt système (donne le ton et les règles à l'IA)
// ---------------------------------------------------------------------------
const SYSTEM_PROMPT = `Tu es l'assistant virtuel de ZT Technologies, une agence de services administratifs et de voyages basée à Cotonou, Bénin.
Tu aides les clients pour :
- Les visas (tourisme, travail, études) : délais, documents requis, pays disponibles.
- Les documents administratifs : CIP, casier judiciaire, acte de naissance.
- La prise de rendez-vous.
- Les questions sur les destinations (France, Belgique, Canada, etc.).

Utilise les informations suivantes pour répondre quand c'est pertinent :
${FAQ}

Règles à respecter impérativement :
- Réponds toujours en français, de manière professionnelle et concise (maximum 3 phrases).
- Si la question est hors sujet, réponds poliment : "Je suis là pour vous aider sur les services de ZT Technologies. Comment puis-je vous assister ?"
- Ne donne jamais d'informations personnelles, de prix exacts ou de conseils juridiques. Invite plutôt à prendre rendez-vous.
- Si tu ne connais pas la réponse, propose de prendre rendez-vous ou d'appeler le +229 01 56 03 58 88.
- Sois chaleureux mais efficace.`;

// ---------------------------------------------------------------------------
// Historique des conversations (mémoire volatile, limitée à 5 échanges)
// ---------------------------------------------------------------------------
const sessions = new Map();   // clé = sessionId, valeur = [{ role, text }]
const MAX_HISTORY = 5;       // nombre de paires question/réponse conservées

function getHistory(sessionId) {
  if (!sessions.has(sessionId)) sessions.set(sessionId, []);
  return sessions.get(sessionId);
}

function addToHistory(sessionId, role, text) {
  const history = getHistory(sessionId);
  history.push({ role, text });
  // Garder seulement les N derniers échanges (N paires = 2*MAX_HISTORY entrées)
  if (history.length > MAX_HISTORY * 2) {
    history.splice(0, history.length - MAX_HISTORY * 2);
  }
}

// ---------------------------------------------------------------------------
// Réponses instantanées basées sur des expressions régulières (prioritaires)
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
    const { message, sessionId } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message requis' });
    }

    const userMessage = message.trim();
    const lowerMsg = userMessage.toLowerCase();
    const currentSessionId = sessionId || 'default';

    // 1. Réponse instantanée (court-circuite l'IA)
    const fastAnswer = findFastAnswer(lowerMsg);
    if (fastAnswer) {
      addToHistory(currentSessionId, 'user', userMessage);
      addToHistory(currentSessionId, 'model', fastAnswer);
      return res.json({ reply: fastAnswer });
    }

    // 2. Si l'IA n'est pas disponible
    if (!ai) {
      return res.json({ reply: "Le service IA n'est pas disponible pour le moment. Contactez-nous au +229 01 56 03 58 88." });
    }

    // 3. Préparer l'historique pour Gemini
    const history = getHistory(currentSessionId);
    const contents = history.map(entry => ({
      role: entry.role === 'model' ? 'model' : 'user',
      parts: [{ text: entry.text }],
    }));
    // Ajouter le message actuel
    contents.push({ role: 'user', parts: [{ text: userMessage }] });

    // 4. Appeler Gemini
    console.log(`🤖 [${currentSessionId}] Appel Gemini (${contents.length} entrées)`);
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents,
      config: {
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        temperature: 0.4,
        maxOutputTokens: 250,
      },
    });

    // 5. Extraire la réponse (plusieurs chemins possibles selon la version du SDK)
    let reply;
    if (typeof response.text === 'function') {
      reply = response.text();
    } else if (typeof response.text === 'string') {
      reply = response.text;
    } else if (response.candidates?.[0]?.content?.parts?.[0]?.text) {
      reply = response.candidates[0].content.parts[0].text;
    } else {
      reply = "Je n'ai pas compris. Pouvez-vous reformuler ?";
    }

    // 6. Mettre à jour l'historique
    addToHistory(currentSessionId, 'user', userMessage);
    addToHistory(currentSessionId, 'model', reply);

    const duration = Date.now() - startTime;
    console.log(`✅ [${currentSessionId}] Réponse (${duration}ms)`);

    res.json({ reply });

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Erreur chat (${duration}ms) :`, error.message);

    // Différencier les erreurs pour un message plus utile
    let userMessage = "Une erreur est survenue. Veuillez réessayer plus tard.";
    if (error.message?.includes('quota') || error.status === 429) {
      userMessage = "Nous sommes très sollicités, merci de patienter quelques instants.";
    } else if (error.message?.includes('timeout') || error.code === 'ETIMEDOUT') {
      userMessage = "La réponse prend trop de temps. Veuillez réessayer.";
    }

    res.status(500).json({ reply: userMessage });
  }
};
const { GoogleGenAI } = require('@google/genai');

console.log('✅ GEMINI_API_KEY :', process.env.GEMINI_API_KEY ? 'définie' : 'MANQUANTE');

let ai = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  console.log('✅ Instance GoogleGenAI créée');
}

const FAQ = `
FAQ ZT Technologies :
- Horaires : Lundi-Vendredi 8h-18h, Samedi 9h-13h.
- Délai visa France : 10 jours ouvrés.
- Prix passeport : 25 000 FCFA.
- Contact : +229 01 56 03 58 88.
- Adresse : Cotonou, Quartier Zongo.
`;

const fastAnswers = {
  'bonjour': 'Bonjour ! Comment puis-je vous aider ?',
  'rendez-vous': 'Pour prendre un rendez-vous, rendez-vous sur la page /rdv.',
  'contact': 'Vous pouvez nous appeler au +229 01 56 03 58 88.',
};

const forbiddenWords = ['politique', 'religion', 'prix'];

const SYSTEM_PROMPT = `Tu es l'assistant virtuel de ZT Technologies, une agence de services administratifs et de voyages basée à Cotonou, Bénin.
Tu aides les clients pour :
- Les visas (tourisme, travail, études) : délais, documents requis, pays disponibles.
- Les documents administratifs : CIP, casier judiciaire, acte de naissance.
- La prise de rendez-vous (redirige vers la page /rdv si nécessaire).
- Les questions sur les destinations (France, Belgique, Canada, etc.).

Règles strictes :
- Réponds toujours en français, de manière professionnelle et concise (maximum 3 phrases).
- Si une question est hors sujet, réponds poliment : "Je suis là pour vous aider sur les services de ZT Technologies. Comment puis-je vous assister ?"
- Ne donne jamais d'informations personnelles, de prix exacts ou de conseils juridiques. Invite plutôt à prendre rendez-vous.
- Si tu ne connais pas la réponse, propose de contacter l'agence directement ou de prendre rendez-vous.
- S'il y a des questions que tu aimerais confier au gérant de l'entreprise lui-même, tu peux rediriger l'utilisateur vers le compte WhatsApp de l'entreprise au +229 01 56 03 58 88.
- Sois chaleureux mais efficace.
- Utilise les informations de la FAQ suivante lorsque cela est pertinent : ${FAQ}`;

exports.chat = async (req, res) => {
  console.log('📥 Requête reçue sur /api/chat');
  console.log('Body :', req.body);

  try {
    const { message } = req.body;
    if (!message) {
      console.log('❌ Message vide');
      return res.status(400).json({ error: 'Message requis' });
    }

    const lowerMsg = message.toLowerCase().trim();
    console.log('Message traité :', lowerMsg);

    // 1. Filtrage
    if (forbiddenWords.some(w => lowerMsg.includes(w))) {
      console.log('🚫 Mot interdit détecté');
      return res.json({ reply: "Je ne peux pas répondre à cette question. Puis-je vous aider sur nos services ?" });
    }

    // 2. Réponses instantanées
    if (fastAnswers[lowerMsg]) {
      console.log('⚡ Réponse instantanée :', fastAnswers[lowerMsg]);
      return res.json({ reply: fastAnswers[lowerMsg] });
    }

    // 3. IA disponible ?
    if (!ai) {
      console.log('❌ IA non initialisée');
      return res.json({ reply: "Le service de chat IA n'est pas configuré pour le moment. Veuillez prendre rendez-vous ou discuter en direct via WhatsApp." });
    }

    console.log('📤 Appel à Gemini...');
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: message }],
        },
      ],
      config: {
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        temperature: 0.4,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 200,
      },
    });

    console.log('📨 Réponse brute de Gemini :', JSON.stringify(response, null, 2));

    let reply = 'Réponse vide de l\'IA.';
    if (response.text) {
      reply = response.text;
    } else if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0]?.content?.parts;
      if (parts && parts.length > 0) {
        reply = parts[0].text || reply;
      }
    }

    console.log('✅ Réponse finale :', reply);
    res.json({ reply });
  } catch (error) {
    console.error('❌ Erreur Gemini :', error);
    console.error('Message :', error.message);
    console.error('Stack :', error.stack);
    res.status(500).json({ reply: error.message }); // renvoie l'erreur réelle au frontend pour débogage
  }
};
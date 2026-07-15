const { GoogleGenAI } = require('@google/genai');

console.log('✅ CHAT CONTROLLER LOADED');
console.log('✅ GEMINI_API_KEY :', process.env.GEMINI_API_KEY ? 'définie' : 'MANQUANTE');

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

console.log(ai ? '✅ GoogleGenAI OK' : '❌ GoogleGenAI NON INITIALISÉ');

const fastAnswers = {
  'bonjour': 'Bonjour ! Comment puis-je vous aider ?',
  'bonsoir': 'Bonsoir ! Comment puis-je vous aider ?',
  'rendez-vous': 'Pour prendre un rendez-vous, rendez-vous sur la page /rdv.',
  'contact': 'Vous pouvez nous appeler au +229 01 56 03 58 88.',
};

const SYSTEM_PROMPT = `Tu es l'assistant de ZT Technologies, agence de visa et documents à Cotonou. Réponds en français, 3 phrases max. Si tu ne sais pas, propose de contacter le gérant au +229 01 56 03 58 88.`;

exports.chat = async (req, res) => {
  console.log('📩 Requête reçue sur /api/chat');
  console.log('Body complet :', JSON.stringify(req.body));

  try {
    const { message } = req.body;
    if (!message) {
      console.log('❌ Pas de message dans le body');
      return res.status(400).json({ error: 'Message requis' });
    }

    const lowerMsg = message.toLowerCase().trim();
    console.log('💬 Message :', lowerMsg);

    // Réponses instantanées
    if (fastAnswers[lowerMsg]) {
      console.log('⚡ Réponse instantanée');
      return res.json({ reply: fastAnswers[lowerMsg] });
    }

    // IA indisponible
    if (!ai) {
      console.log('⚠️ IA non disponible');
      return res.json({ reply: "Le service IA n'est pas disponible. Contactez-nous au +229 01 56 03 58 88." });
    }

    console.log('🤖 Appel Gemini...');
    
    // Correction de la structure pour le nouveau SDK @google/genai
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: message, // Chaîne de caractères acceptée directement
      config: {
        systemInstruction: SYSTEM_PROMPT, // Chaîne de caractères acceptée directement
        temperature: 0.4,
        maxOutputTokens: 200,
      },
    });

    // Extraction simplifiée du texte via le nouveau SDK
    const reply = response.text || 'Je n\'ai pas compris.';
    console.log('✅ Réponse :', reply);
    res.json({ reply });
    
  } catch (error) {
    console.error('❌ ERREUR DANS LE CHAT :', error.message);
    console.error('Stack :', error.stack);
    res.status(500).json({ reply: "Erreur serveur. Veuillez réessayer." });
  }
};

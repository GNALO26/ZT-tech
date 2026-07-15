const { GoogleGenAI } = require('@google/genai');

console.log('✅ CHAT CONTROLLER LOADED');

// Initialisation standard avec la nouvelle clé API sécurisée
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

console.log(ai ? '✅ GoogleGenAI initialisé' : '❌ GEMINI_API_KEY MANQUANTE');

const fastAnswers = {
  'bonjour': 'Bonjour ! Comment puis-je vous aider ?',
  'bonsoir': 'Bonsoir ! Comment puis-je vous aider ?',
  'rendez-vous': 'Pour prendre un rendez-vous, rendez-vous sur la page /rdv.',
  'contact': 'Vous pouvez nous appeler au +229 01 56 03 58 88.',
};

const SYSTEM_PROMPT = `Tu es l'assistant de ZT Technologies, agence de visa et documents à Cotonou. Réponds en français, 3 phrases max. Si tu ne sais pas, propose de contacter le gérant au +229 01 56 03 58 88.`;

exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message requis' });
    }

    const lowerMsg = message.toLowerCase().trim();

    // 1. Réponses instantanées du dictionnaire
    if (fastAnswers[lowerMsg]) {
      return res.json({ reply: fastAnswers[lowerMsg] });
    }

    // 2. IA non configurée sur le serveur
    if (!ai) {
      return res.json({ reply: "Le service d'IA n'est pas disponible pour le moment. Veuillez nous contacter directement." });
    }

    console.log('🤖 Envoi de la requête à Google Gemini...');
    
    // Appel conforme avec la configuration de prompt système
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: message,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.4,
        maxOutputTokens: 200,
      }
    });

    const reply = response.text || "Je n'ai pas pu formuler de réponse.";
    return res.json({ reply });
    
  } catch (error) {
    // Les erreurs d'API restent côté serveur pour la sécurité
    console.error('❌ ERREUR API GEMINI EN PROD :', error.message);
    
    // Message propre pour l'utilisateur final
    return res.status(500).json({ 
      reply: "Désolé, l'assistant rencontre une forte affluence. Veuillez réessayer dans quelques instants ou nous appeler au +229 01 56 03 58 88." 
    });
  }
};

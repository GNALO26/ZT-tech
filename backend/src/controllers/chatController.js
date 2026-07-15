const { GoogleGenAI } = require('@google/genai');

console.log('✅ CHAT CONTROLLER LOADED');

// Initialisation directe standard du SDK
let ai = null;
try {
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    console.log('✅ GoogleGenAI OK');
  } else {
    console.log('❌ GEMINI_API_KEY MANQUANTE');
  }
} catch (e) {
  console.error('❌ Erreur d\'instanciation du SDK:', e.message);
}

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

    // 1. Réponses instantanées
    if (fastAnswers[lowerMsg]) {
      return res.json({ reply: fastAnswers[lowerMsg] });
    }

    // 2. IA indisponible au niveau du code
    if (!ai) {
      return res.json({ reply: "L'instance d'IA n'est pas initialisée sur le serveur." });
    }

    console.log('🤖 Envoi de la requête à Google Gemini...');
    
    // Appel épuré au maximum pour éliminer un bug de configuration de paramètres
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: message
    });

    const reply = response.text || 'L\'IA a renvoyé une réponse vide.';
    return res.json({ reply });
    
  } catch (error) {
    console.error('❌ CRASH GEMINI DETECTE :', error.message);
    
    // LE DIAGNOSTIC : On renvoie l'erreur Google réelle directement dans l'interface du chatbot
    return res.status(200).json({ 
      reply: `⚠️ Erreur API Gemini : ${error.message} | Rappel : Vérifiez que l'adresse IP de votre serveur Render n'est pas bloquée géographiquement par l'API Google.`
    });
  }
};

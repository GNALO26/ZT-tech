const { GoogleGenAI } = require('@google/genai');

console.log('✅ CHAT CONTROLLER LOADED');
console.log('✅ GEMINI_API_KEY :', process.env.GEMINI_API_KEY ? 'définie' : 'MANQUANTE');

// Initialisation conforme au nouveau SDK standardisé
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
  
  try {
    const { message } = req.body;
    if (!message) {
      console.log('❌ Pas de message dans le body');
      return res.status(400).json({ error: 'Message requis' });
    }

    const lowerMsg = message.toLowerCase().trim();
    console.log('💬 Message reçu :', lowerMsg);

    // 1. Gestion des réponses instantanées du dictionnaire
    if (fastAnswers[lowerMsg]) {
      console.log('⚡ Réponse instantanée trouvée');
      return res.json({ reply: fastAnswers[lowerMsg] });
    }

    // 2. Vérification de la disponibilité de l'instance d'IA
    if (!ai) {
      console.log('⚠️ Instance IA non disponible (Clé manquante)');
      return res.json({ reply: "Le service IA n'est pas disponible actuellement. Contactez-nous au +229 01 56 03 58 88." });
    }

    console.log('🤖 Appel de l\'API Gemini (gemini-2.0-flash)...');
    
    // Structure officielle du SDK @google/genai pour la configuration
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: message,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.4,
        maxOutputTokens: 200,
      }
    });

    // Le nouveau SDK expose directement la propriété text ou un helper natif
    // Si la structure renvoyée par l'API subit des variations, on sécurise l'accès
    const reply = response.text || 
                  response.output_text ||
                  response.candidates?.[0]?.content?.parts?.[0]?.text || 
                  'Je n\'ai pas pu formuler de réponse.';

    console.log('✅ Réponse générée avec succès :', reply);
    return res.json({ reply });
    
  } catch (error) {
    // Analyse essentielle des logs en cas d'échec de l'appel HTTP Google
    console.error('❌ ERREUR LORS DE L\'APPEL GEMINI :');
    console.error('Message d\'erreur :', error.message);
    console.error('Détails complets de l\'erreur :', JSON.stringify(error, null, 2));
    console.error('Stack Trace :', error.stack);
    
    return res.status(500).json({ 
      reply: "Désolé, une erreur est survenue lors du traitement de votre demande." 
    });
  }
};

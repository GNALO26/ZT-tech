// Variable globale pour stocker l'instance de l'IA une fois chargée
let ai = null;

console.log('✅ CHAT CONTROLLER LOADED');

// Initialisation asynchrone robuste pour le nouveau SDK @google/genai en CommonJS
(async () => {
  try {
    if (process.env.GEMINI_API_KEY) {
      // Import dynamique pour garantir la compatibilité ESM / CommonJS du SDK
      const genAIModule = await import('@google/genai');
      // Le SDK exporte souvent GoogleGenAI à la racine ou via default
      const GoogleGenAI = genAIModule.GoogleGenAI || genAIModule.default?.GoogleGenAI;
      
      if (GoogleGenAI) {
        ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        console.log('✅ GoogleGenAI initialisé avec succès');
      } else {
        console.error('❌ Impossible de trouver la classe GoogleGenAI dans le module');
      }
    } else {
      console.log('⚠️ GEMINI_API_KEY : MANQUANTE dans les variables d\'environnement');
    }
  } catch (err) {
    console.error('❌ Erreur lors de l\'initialisation dynamique du SDK Gemini :', err.message);
  }
})();

// Dictionnaire intelligent (recherche par mot-clé inclus au lieu de correspondance exacte)
const getFastAnswer = (text) => {
  if (text.includes('bonjour') || text.includes('salut')) {
    return 'Bonjour ! Comment puis-je vous aider ?';
  }
  if (text.includes('bonsoir')) {
    return 'Bonsoir ! Comment puis-je vous aider ?';
  }
  if (text.includes('rendez-vous') || text.includes('rdv') || text.includes('prendre un rdv')) {
    return 'Pour prendre un rendez-vous, rendez-vous sur la page /rdv.';
  }
  if (text.includes('contact') || text.includes('numéro') || text.includes('telephone') || text.includes('appeler')) {
    return 'Vous pouvez nous appeler au +229 01 56 03 58 88.';
  }
  return null;
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
    console.log('💬 Message traité :', lowerMsg);

    // 1. Réponses instantanées souples
    const quickResponse = getFastAnswer(lowerMsg);
    if (quickResponse) {
      console.log('⚡ Réponse instantanée déclenchée');
      return res.json({ reply: quickResponse });
    }

    // 2. IA indisponible
    if (!ai) {
      console.log('⚠️ IA non disponible (Vérifier les logs d\'initialisation)');
      return res.json({ reply: "Le service d'intelligence artificielle est indisponible. Veuillez nous contacter au +229 01 56 03 58 88." });
    }

    console.log('🤖 Appel de l\'API Gemini (gemini-2.0-flash)...');
    
    // Structure validée pour l'appel de contenu
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: message,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.4,
        maxOutputTokens: 200,
      },
    });

    // Extraction sécurisée du texte
    const reply = response.text || 'Je n\'ai pas pu formuler de réponse.';
    console.log('✅ Réponse générée :', reply);
    
    return res.json({ reply });
    
  } catch (error) {
    console.error('❌ ERREUR CRITIQUE DANS LE CONTRÔLEUR CHAT :');
    console.error('Message :', error.message);
    console.error('Stack :', error.stack);
    
    return res.status(500).json({ 
      reply: "Désolé, une erreur technique est survenue sur notre serveur. Veuillez réessayer." 
    });
  }
};

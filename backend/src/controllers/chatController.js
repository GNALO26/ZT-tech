const { GoogleGenAI } = require('@google/genai');

// Logs pour confirmer le chargement
console.log('✅ GEMINI_API_KEY :', process.env.GEMINI_API_KEY ? 'définie' : 'MANQUANTE');

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

if (ai) console.log('✅ Instance GoogleGenAI créée');
else console.error('❌ GoogleGenAI non initialisé');

const fastAnswers = {
  'bonjour': 'Bonjour ! Comment puis-je vous aider ?',
  'rendez-vous': 'Pour prendre un rendez-vous, rendez-vous sur la page /rdv.',
  'contact': 'Vous pouvez nous appeler au +229 01 56 03 58 88.',
};

const SYSTEM_PROMPT = `Tu es l'assistant de ZT Technologies, agence de visa et documents à Cotonou. Réponds en français, 3 phrases max. Si tu ne sais pas, propose de contacter le gérant au +229 01 56 03 58 88.`;

exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message requis' });

    const lowerMsg = message.toLowerCase().trim();

    // Réponses instantanées
    if (fastAnswers[lowerMsg]) {
      return res.json({ reply: fastAnswers[lowerMsg] });
    }

    // IA indisponible
    if (!ai) {
      return res.json({ reply: "Le service IA n'est pas disponible. Contactez-nous au +229 01 56 03 58 88." });
    }

    console.log('📤 Envoi à Gemini :', message);

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        temperature: 0.4,
        maxOutputTokens: 200,
      },
    });

    const reply = response.text || response.candidates?.[0]?.content?.parts?.[0]?.text || 'Je n\'ai pas compris.';
    console.log('✅ Réponse Gemini :', reply);

    res.json({ reply });
  } catch (error) {
    console.error('❌ Erreur chat :', error);
    res.status(500).json({ reply: "Une erreur est survenue. Veuillez réessayer plus tard." });
  }
};
import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import api from '../../services/api';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Bonjour ! Comment puis‑je vous aider ? Choisissez une option ou écrivez votre question.' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '2290156035888';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (from, text) => {
    setMessages(prev => [...prev, { from, text }]);
  };

  const handleSend = async (text) => {
    if (!text.trim()) return;
    addMessage('user', text);
    setInput('');
    setIsLoading(true);
    try {
      const res = await api.post('/chat', { message: text });
      addMessage('bot', res.data.reply);
    } catch (err) {
      addMessage('bot', 'Désolé, une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOption = (type) => {
    if (type === 'rdv') {
      window.location.href = '/rdv';
      return;
    }
    if (type === 'whatsapp') {
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Bonjour ZT Technologies, je souhaite discuter avec un conseiller.')}`, '_blank');
      return;
    }
    const messages = {
      admin: "Bonjour, je souhaite une assistance pour documents administratifs.",
      visa: "Bonjour, je souhaite des informations sur les visas.",
    };
    const text = messages[type] || '';
    if (text) handleSend(text);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary text-white p-4 rounded-full shadow-2xl hover:bg-red-700 transition-transform hover:scale-110"
          aria-label="Ouvrir le chat"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="bg-white w-80 sm:w-96 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
          {/* En-tête */}
          <div className="bg-primary p-4 text-white flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm">Assistant ZT Technologies</h3>
              <p className="text-xs text-red-100">En ligne • IA</p>
            </div>
            <button onClick={() => setIsOpen(false)} aria-label="Fermer le chat">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 space-y-3 bg-gray-50 overflow-y-auto max-h-80">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.from === 'user'
                      ? 'bg-primary text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none shadow-sm border'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl shadow-sm border flex items-center gap-2">
                  <Loader2 className="animate-spin w-4 h-4 text-primary" />
                  <span className="text-sm text-gray-500">Écriture...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Boutons rapides */}
          <div className="p-3 border-t bg-white space-y-2">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => handleOption('rdv')}
                className="flex-1 bg-primary/10 text-primary text-xs font-semibold py-2 px-2 rounded-lg hover:bg-primary/20 transition"
              >
                📅 Prendre RDV
              </button>
              <button
                onClick={() => handleOption('admin')}
                className="flex-1 bg-primary/10 text-primary text-xs font-semibold py-2 px-2 rounded-lg hover:bg-primary/20 transition"
              >
                📄 Documents
              </button>
              <button
                onClick={() => handleOption('visa')}
                className="flex-1 bg-primary/10 text-primary text-xs font-semibold py-2 px-2 rounded-lg hover:bg-primary/20 transition"
              >
                ✈️ Visas
              </button>
              <button
                onClick={() => handleOption('whatsapp')}
                className="flex-1 bg-green-50 text-green-700 border border-green-200 text-xs font-semibold py-2 px-2 rounded-lg hover:bg-green-100 transition"
              >
                💬 Discuter en direct
              </button>
            </div>

            {/* Saisie libre */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Écrivez votre message..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-primary text-white p-2 rounded-full hover:bg-red-700 transition disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
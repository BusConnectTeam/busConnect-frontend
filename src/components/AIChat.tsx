'use client';

import { useCurrentUser } from '@/contexts/UserContext';
import { ChatMessage, processMessage } from '@/lib/chatbot';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, MessageCircle, Send, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

const INITIAL_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    '¡Hola! 👋 Soy tu asistente de BusConnect. Puedo ayudarte a calcular rutas, buscar municipios, conocer al equipo y más. Escribe **"ayuda"** para ver todas las opciones.',
  timestamp: new Date(),
};

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { currentUser } = useCurrentUser();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Actualizar mensaje de bienvenida cuando cambia el usuario
  useEffect(() => {
    if (currentUser) {
      setMessages((prevMessages) => {
        // Solo actualizar si es el mensaje inicial
        if (prevMessages.length === 1 && prevMessages[0].id === 'welcome' && !prevMessages[0].content.includes(currentUser.firstName)) {
          return [
            {
              ...INITIAL_MESSAGE,
              content: `¡Hola ${currentUser.firstName}! 👋 Soy tu asistente de BusConnect. Puedo ayudarte a calcular rutas, buscar municipios, conocer al equipo y más. Escribe **"ayuda"** para ver todas las opciones.`,
            },
          ];
        }
        return prevMessages;
      });
    }
  }, [currentUser]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage('');
    setIsProcessing(true);

    try {
      const response = await processMessage(userMessage.content, currentUser);
      setMessages((prev) => [...prev, response]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Ocurrió un error al procesar tu mensaje. Por favor, intenta de nuevo.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatMessageContent = (content: string) => {
    // Convertir markdown básico a HTML
    return content
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br />');
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-petroleo hover:bg-petroleo-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110"
        aria-label={isOpen ? 'Cerrar asistente' : 'Abrir asistente'}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ maxHeight: 'calc(100vh - 160px)' }}
          >
            {/* Header */}
            <div className="bg-petroleo p-4 text-white flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">
                  🤖
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">Asistente BusConnect</h3>
                  <p className="text-sm text-white/80">
                    {currentUser ? `Conectado como ${currentUser.firstName}` : 'Modo demo'}
                  </p>
                </div>
                {currentUser?.role === 'ADMIN' && (
                  <span className="px-2 py-1 bg-amber-500/30 text-amber-200 text-xs rounded-full">
                    Admin
                  </span>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50 dark:bg-neutral-900">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-2 ${
                    msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 bg-petroleo rounded-full flex items-center justify-center text-white text-sm flex-shrink-0">
                      🤖
                    </div>
                  )}
                  <div
                    className={`rounded-lg p-3 shadow-sm max-w-[85%] ${
                      msg.role === 'user'
                        ? 'bg-petroleo text-white'
                        : 'bg-white dark:bg-neutral-800'
                    }`}
                  >
                    <p
                      className={`text-sm ${
                        msg.role === 'user'
                          ? 'text-white'
                          : 'text-neutral-900 dark:text-neutral-100'
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: formatMessageContent(msg.content),
                      }}
                    />
                  </div>
                </div>
              ))}

              {isProcessing && (
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 bg-petroleo rounded-full flex items-center justify-center text-white text-sm flex-shrink-0">
                    🤖
                  </div>
                  <div className="bg-white dark:bg-neutral-800 rounded-lg p-3 shadow-sm">
                    <Loader2 className="w-5 h-5 animate-spin text-petroleo" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-2 border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex-shrink-0">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setMessage('¿Cuánto tarda de Barcelona a Girona?')}
                  className="text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
                >
                  Calcular ruta
                </button>
                <button
                  type="button"
                  onClick={() => setMessage('Municipios de Tarragona')}
                  className="text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
                >
                  Ver municipios
                </button>
                <button
                  type="button"
                  onClick={() => setMessage('¿Quiénes crearon BusConnect?')}
                  className="text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
                >
                  Equipo
                </button>
                {currentUser && (
                  <button
                    type="button"
                    onClick={() => setMessage('¿Quién soy?')}
                    className="text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
                  >
                    Mi perfil
                  </button>
                )}
                {currentUser?.role === 'ADMIN' && (
                  <button
                    type="button"
                    onClick={() => setMessage('Estadísticas')}
                    className="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
                  >
                    Stats
                  </button>
                )}
              </div>
            </div>

            {/* Input */}
            <form
              onSubmit={handleSend}
              className="p-4 border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex-shrink-0"
            >
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-petroleo focus:border-transparent outline-none bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isProcessing || !message.trim()}
                  className="bg-petroleo hover:bg-petroleo-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Enviar mensaje"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

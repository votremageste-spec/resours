import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, X, MessageCircle, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const SYSTEM_INSTRUCTION = `Ты — заботливый ИИ-ассистент студии телесного восстановления «РЕСУРС» в Альметьевске. 
Твоя цель: помочь клиенту понять пользу процедур и записать его на визит.

ОСНОВНЫЕ ПРАВИЛА:
1. Используй ТОЛЬКО данные из базы знаний:
   - Живой Пар: мягкий прогрев (42°C), ионизированный пар, расслабление, легкость. Комфортнее сауны.
   - Синусоида: волновое движение тела, снятие зажимов, восстановление подвижности. Ощущается как волна.
   - Массаж: ручная работа с напряжением.
2. КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО: использовать медицинские термины (лечит, диагноз, давление, грыжа и т.д.).
3. Если спрашивают про болезни: отвечай, что мы — wellness-студия для расслабления, а при болях нужно к врачу.
4. В конце ответов предлагай записаться через WhatsApp или прийти на пробный визит.
5. Тон: теплый, спокойный, вежливый.`;

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize AI instance with fallback
  const ai = React.useMemo(() => {
    const key = process.env.GEMINI_API_KEY || '';
    if (!key) {
      console.error('AI Assistant Error: GEMINI_API_KEY is not defined in environment variables.');
    }
    return new GoogleGenAI({ apiKey: key });
  }, []);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-ai', handleOpen);
    return () => window.removeEventListener('open-ai', handleOpen);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input;
    const userMsg = { role: 'user', parts: [{ text: userText }] };
    setHistory(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Hardened History Logic for Gemini
      // 1. Must alternate User -> Model
      // 2. Must start with User
      // 3. Must end with User (userMsg)
      const refinedHistory: any[] = [];
      let nextRole = 'user';

      for (const msg of history) {
        if (msg.role === nextRole) {
          refinedHistory.push(msg);
          nextRole = nextRole === 'user' ? 'model' : 'user';
        }
      }

      // If refinedHistory ends with 'user', we drop it because userMsg is about to be added
      if (refinedHistory.length > 0 && refinedHistory[refinedHistory.length - 1].role === 'user') {
        refinedHistory.pop();
      }

      const model = ai.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: SYSTEM_INSTRUCTION
      });

      const result = await model.generateContent({
        contents: [...refinedHistory, userMsg],
        generationConfig: {
          temperature: 0.7,
        }
      });

      const response = await result.response;
      const text = response.text();

      if (text) {
        setHistory(prev => [...prev, { role: 'model', parts: [{ text }] }]);
      } else {
        throw new Error('Empty response or blocked content');
      }
    } catch (error: any) {
      console.error('AI Chat Error Details:', error);
      
      const errorMessage = error?.message || '';
      if (errorMessage.includes('API_KEY')) {
         console.error('CRITICAL: API Key issue detected.');
      }

      setHistory(prev => [...prev, { role: 'model', parts: [{ text: 'Извините, произошла ошибка. Пожалуйста, попробуйте позже или напишите нам в WhatsApp.' }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[500px] bg-white rounded-[32px] shadow-2xl border border-brand-secondary overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-brand-dark p-6 text-white flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg">Ассистент РЕСУРС</h3>
                <p className="text-white/60 text-xs">Всегда на связи</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-grow p-6 overflow-y-auto space-y-4 bg-brand-primary/20">
              {history.length === 0 && (
                <div className="text-brand-dark/40 text-center py-10 space-y-4">
                  <MessageCircle className="w-10 h-10 mx-auto opacity-20" />
                  <p className="text-sm px-10">Здравствуйте! Я помогу подобрать процедуру и отвечу на любые вопросы о студии.</p>
                </div>
              )}
              {history.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-[20px] text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-brand-accent text-white rounded-br-none' 
                      : 'bg-white border border-brand-secondary text-brand-dark rounded-bl-none'
                  }`}>
                    {msg.parts[0].text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-brand-secondary p-4 rounded-[20px] rounded-bl-none">
                    <Loader2 className="w-4 h-4 animate-spin text-brand-accent" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-brand-secondary">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ваш вопрос..."
                  className="flex-grow bg-brand-primary/30 border-none rounded-full px-5 py-3 text-sm focus:ring-2 focus:ring-brand-accent outline-none"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading}
                  className="w-12 h-12 bg-brand-dark text-white rounded-full flex items-center justify-center hover:bg-brand-accent transition-colors shrink-0 disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-brand-dark text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-brand-accent transition-all relative"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-accent border-2 border-white rounded-full animate-pulse" />
      </motion.button>
    </div>
  );
};

import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Assistant Route
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history } = req.body;
      const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      
      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [...(history || []), { role: 'user', parts: [{ text: message }] }],
        config: {
          systemInstruction: `Ты — заботливый ИИ-ассистент студии телесного восстановления «РЕСУРС» в Альметьевске. 
          Твоя цель: помочь клиенту понять пользу процедур и записать его на визит.
          
          ОСНОВНЫЕ ПРАВИЛА:
          1. Используй ТОЛЬКО данные из базы знаний:
             - Живой Пар: мягкий прогрев (42°C), ионизированный пар, расслабление, легкость. Комфортнее сауны.
             - Синусоида: волновое движение тела, снятие зажимов, восстановление подвижности. Ощущается как волна.
             - Массаж: ручная работа с напряжением.
          2. КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО: использовать медицинские термины (лечит, диагноз, давление, грыжа и т.д.).
          3. Если спрашивают про болезни: отвечай, что мы — wellness-студия для расслабления, а при болях нужно к врачу.
          4. В конце ответов предлагай записаться через WhatsApp или прийти на пробный визит.
          5. Тон: теплый, спокойный, вежливый.`
        }
      });

      res.json({ text: response.text });
    } catch (error) {
      console.error('AI Error:', error);
      res.status(500).json({ error: 'Ошибка ассистента' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

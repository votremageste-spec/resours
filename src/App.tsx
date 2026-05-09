import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wind, 
  Activity, 
  Hand, 
  Clock, 
  MapPin, 
  Phone, 
  Instagram, 
  ChevronRight, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Gift,
  Plus,
  MessageCircle,
  Menu,
  X,
  Target,
  Users
} from 'lucide-react';
import { AIAssistant } from './components/AIAssistant';

// --- Types ---
interface Service {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: string;
  icon: React.ReactNode;
  benefits: string[];
  forWhom: string;
}

// --- Constants & Content ---
const SERVICES: Service[] = [
  {
    id: 'steam',
    title: 'Живой Пар',
    description: 'Мягкое паровое воздействие ионизированным паром при комфортной температуре до 42°C. Без жара и нагрузки на сердце.',
    duration: '30-40 мин',
    price: 'от 1 200 ₽',
    icon: <Wind className="w-6 h-6" />,
    benefits: ['Глубокое увлажнение кожи', 'Ощущение легкости', 'Снятие эмоционального напряжения'],
    forWhom: 'Для тех, кто хочет мягкого прогрева и тишины.'
  },
  {
    id: 'sinusoid',
    title: 'Синусоида',
    description: 'Бережная процедура волнообразного движения тела. Помогает мышцам расслабиться и возвращает чувство свободы движений.',
    duration: '15-20 мин',
    price: 'от 700 ₽',
    icon: <Activity className="w-6 h-6" />,
    benefits: ['Снятие мышечных зажимов', 'Улучшение микроциркуляции', 'Восстановление после усталости'],
    forWhom: 'Если вы много сидите и чувствуете скованность.'
  },
  {
    id: 'massage',
    title: 'Массаж',
    description: 'Профессиональная ручная работа с телесным напряжением. Техника подбирается индивидуально под ваш запрос.',
    duration: '60 мин',
    price: 'от 2 000 ₽',
    icon: <Hand className="w-6 h-6" />,
    benefits: ['Проработка триггерных зон', 'Снятие усталости', 'Улучшение качества сна'],
    forWhom: 'Для глубокой проработки зажимов и полного расслабления.'
  }
];

const TROUBLES = [
  { t: "Усталость после работы", r: "Живой Пар + Синусоида", icon: <Clock />, target: "#complex" },
  { t: "Напряжение в спине и шее", r: "Синусоида или Массаж", icon: <Target />, target: "#services" },
  { t: "Хочется расслабиться", r: "Живой Пар", icon: <Wind />, target: "#services" },
  { t: "Не знаю, что выбрать", r: "Спросить ассистента", icon: <MessageCircle />, target: "ai" },
];

const RESULTS = [
  { t: "Ощущение легкости", d: "Самый частый отзыв. Клиенты говорят, что после визита тело становится «невесомым»." },
  { t: "Глубокое спокойствие", d: "Мягкий пар и ритм синусоиды замедляют поток мыслей и снимают стресс." },
  { t: "Свобода движений", d: "Уходит чувство скованности в плечах и спине, возвращается естественная подвижность." },
  { t: "Ресурсное состояние", d: "Чувство бодрости и ясности, как после полноценного выходного дня." }
];

const STEPS = [
  { n: '01', t: 'Знакомство', d: 'Встречаем, уточняем ваш запрос и самочувствие перед началом.' },
  { n: '02', t: 'Подготовка', d: 'Расскажем, как проходят процедуры, что можно и нельзя.' },
  { n: '03', t: 'Живой Пар', d: 'Мягкое паровое воздействие при температуре до 42°C.' },
  { n: '04', t: 'Синусоида', d: 'Плавное волнообразное движение для расслабления тела.' },
  { n: '05', t: 'Отдых', d: 'Несколько минут тишины и спокойствия после процедуры.' },
  { n: '06', t: 'Рекомендация', d: 'Подскажем, какой формат подойдет дальше: разово или курс.' },
];

const AUDIENCES = [
  { t: "Офисные сотрудники", d: "Для тех, кто много сидит, устает от компьютера и чувствует напряжение в спине. Поможем сбросить груз рабочего дня." },
  { t: "Предприниматели", d: "Для тех, кто принимает много решений и хочет восстановить спокойствие. 45 минут тишины для вашей перезагрузки." },
  { t: "Спортсмены", d: "Для мягкого восстановления мышц и ощущения легкости после нагрузок. Пар и волны синусоиды ускорят восстановление." },
  { t: "Пожилые люди", d: "Для бережной заботы о теле, расслабления и поддержания подвижности без лишнего стресса для сердца." },
  { t: "Любители массажа", d: "Идеально в дополнение к классическому массажу. Мягкий пар подготовит мышцы к более глубокой проработке." },
  { t: "Ищущие тишины", d: "Кому нужно время наедине с собой в уютной, спокойной обстановке. Мы создали пространство для замедления." }
];

const PREPARATION = [
  "Возьмите с собой только хорошее настроение",
  "Мы предоставим всё необходимое: полотенце, тапочки, халат",
  "Рекомендуем не есть за 1.5–2 часа до процедур",
  "Настройтесь на 45–90 минут полного цифрового детокса"
];

const PRICES = {
  single: [
    { name: "Живой Пар", price: "1 200 ₽", time: "30-40 мин" },
    { name: "Синусоида", price: "700 ₽", time: "15-20 мин" },
    { name: "Массаж", price: "2 000 ₽", time: "60 мин" },
  ],
  complex: [
    { name: "Живой Пар + Синусоида", price: "1 800 ₽", oldPrice: "2 200 ₽", label: "Популярно" },
    { name: "Пар + Массаж", price: "2 900 ₽", oldPrice: "3 200 ₽" },
    { name: "Антистресс (Всё включено)", price: "3 500 ₽", oldPrice: "4 000 ₽" },
  ],
  courses: [
    { name: "Курс «Обновление» (5 визитов)", price: "8 000 ₽", oldPrice: "10 000 ₽" },
    { name: "Курс «Ресурс» (10 визитов)", price: "15 000 ₽", oldPrice: "20 000 ₽" },
  ]
};

const FAQ_ITEMS = [
  { q: 'Что такое Живой Пар?', a: 'Это мягкая процедура в специальной капсуле с ионизированным паром комнатной влажности. Температура около 40-42°C, что позволяет расслабиться без стресса, который бывает в обычной бане.' },
  { q: 'Синусоида — это больно?', a: 'Напротив, это одна из самых приятных процедур. Аппарат создает мягкие, плавные колебания, напоминающие движение волны. Это абсолютно безболезненно и очень расслабляет.' },
  { q: 'Нужно ли что-то брать с собой?', a: 'Мы предоставляем всё необходимое: халаты, полотенца, тапочки и принадлежности для душа. Вам не нужно ничего готовить заранее.' },
  { q: 'Есть ли противопоказания?', a: 'Да, как и у любых оздоровительных процедур. Мы не рекомендуем посещение при острых воспалениях, высокой температуре и поздних сроках беременности. При наличии хронических заболеваний лучше проконсультироваться с врачом.' },
];

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-brand-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-brand-accent rounded-full flex items-center justify-center text-white">
            <span className="font-display font-semibold">Р</span>
          </div>
          <span className="font-display text-xl font-bold tracking-wider underline decoration-brand-accent/30 underline-offset-4 decoration-2 tracking-tighter">Ресурс</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-dark/50">
          <a href="#about" className="hover:text-brand-accent transition-colors">О студии</a>
          <a href="#services" className="hover:text-brand-accent transition-colors">Услуги</a>
          <a href="#complex" className="hover:text-brand-accent transition-colors">Комплекс</a>
          <a href="#faq" className="hover:text-brand-accent transition-colors">Вопросы</a>
          <a href="#contacts" className="hover:text-brand-accent transition-colors">Контакты</a>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          <button className="px-6 py-2.5 bg-brand-dark text-white rounded-full text-sm font-medium hover:bg-brand-accent transition-all">
            Записаться
          </button>
        </div>
        
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-brand-secondary overflow-hidden"
          >
            <div className="p-4 space-y-4">
              <a href="#about" className="block text-lg font-medium px-4" onClick={() => setIsOpen(false)}>О студии</a>
              <a href="#services" className="block text-lg font-medium px-4" onClick={() => setIsOpen(false)}>Услуги</a>
              <a href="#complex" className="block text-lg font-medium px-4" onClick={() => setIsOpen(false)}>Комплекс</a>
              <a href="#contacts" className="block text-lg font-medium px-4" onClick={() => setIsOpen(false)}>Контакты</a>
              <button className="w-full py-4 bg-brand-dark text-white rounded-2xl">Записаться</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const SectionHeading = ({ title, subtitle, centered = false }: { title: string, subtitle?: string, centered?: boolean }) => (
  <div className={`mb-16 ${centered ? 'text-center' : ''}`}>
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="font-display text-4xl md:text-6xl font-bold mb-6 tracking-tight"
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className={`text-brand-dark/50 max-w-2xl text-xl font-light leading-relaxed ${centered ? 'mx-auto' : ''}`}
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <AIAssistant />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 bg-brand-accent/10 text-brand-accent rounded-full text-xs font-bold tracking-[0.2em] uppercase mb-8">
              Студия телесного восстановления • Альметьевск
            </span>
            <h1 className="font-display text-5xl md:text-8xl font-bold leading-[1.0] mb-8 text-balance tracking-tighter">
              Место, где тело отдыхает <span className="text-brand-accent italic font-medium">по-настоящему</span>
            </h1>
            <p className="text-xl text-brand-dark/60 mb-12 max-w-lg leading-relaxed font-light">
              Мягкие процедуры Живого Пара, Синусоиды и массажа помогают расслабиться, снять напряжение и вернуть ощущение легкости.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button className="flex items-center justify-center gap-3 px-10 py-6 bg-brand-dark text-white rounded-full text-lg font-bold hover:bg-brand-accent hover:-translate-y-1 transition-all shadow-xl shadow-brand-dark/10">
                Записаться на визит <ArrowRight className="w-5 h-5" />
              </button>
              <button className="flex items-center justify-center gap-2 px-10 py-6 bg-white text-brand-dark border border-brand-secondary rounded-full text-lg font-bold hover:bg-brand-secondary transition-all">
                Наши услуги
              </button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="aspect-[4/5] rounded-[80px] bg-brand-accent/20 overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1000" 
                alt="Wellness atmosphere" 
                className="w-full h-full object-cover mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 to-transparent" />
              <div className="absolute bottom-12 left-12 right-12 glass-card p-10 rounded-[40px]">
                <div className="text-white text-2xl font-display font-medium mb-2">Пробный визит со скидкой 30%</div>
                <p className="text-white/80 font-light">Живой Пар + Синусоида для вашего первого обновления</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trouble Chooser */}
      <section className="py-24 px-4 bg-brand-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-xl">
               <h2 className="font-display text-3xl md:text-5xl font-bold mb-4 tracking-tight">С чем вы пришли сегодня?</h2>
               <p className="text-brand-dark/50 text-lg font-light">Выберите ваше состояние — мы подскажем, с чего лучше начать знакомство со студией.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TROUBLES.map((item, i) => (
              <motion.a 
                key={i}
                href={item.target === 'ai' ? undefined : item.target}
                onClick={item.target === 'ai' ? () => window.dispatchEvent(new CustomEvent('open-ai')) : undefined}
                whileHover={{ y: -5 }}
                className="p-8 bg-white border border-brand-secondary rounded-[40px] text-left hover:shadow-xl hover:border-brand-accent transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 bg-brand-secondary flex items-center justify-center rounded-2xl mb-6 text-brand-accent group-hover:bg-brand-accent group-hover:text-white transition-colors">
                  {item.icon}
                </div>
                <h4 className="font-bold text-lg mb-2 leading-tight">{item.t}</h4>
                <div className="flex items-center gap-2 text-brand-accent text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.r} <ChevronRight className="w-4 h-4" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section id="about" className="py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <SectionHeading 
            title="Философия мягкого восстановления"
            subtitle="Мы отказались от агрессивных методик. «РЕСУРС» — это пространство, где технологии работают в ритме вашего тела, помогая ему вспомнить, что такое легкость."
          />
          <div className="grid sm:grid-cols-2 gap-8">
            {[
              { icon: <ShieldCheck />, title: "Без перегрузки", desc: "Комфортная температура и мягкий ритм процедур безопасны для любого возраста." },
              { icon: <Hand />, title: "Бережно", desc: "Учитываем ваше состояние и подбираем интенсивность под ваши ощущения." },
              { icon: <Users />, title: "Индивидуально", desc: "Всегда уточняем ваши пожелания перед процедурой." },
              { icon: <ArrowRight />, title: "Результативно", desc: "Эффект расслабления чувствуется уже после первого визита." },
            ].map((item, i) => (
              <div key={i} className="p-6">
                <div className="text-brand-accent mb-4">{item.icon}</div>
                <h4 className="font-bold mb-2 tracking-tight">{item.title}</h4>
                <p className="text-sm text-brand-dark/50 leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-32 px-4 bg-brand-primary">
        <div className="max-w-7xl mx-auto">
          <SectionHeading 
            centered
            title="Наши направления"
            subtitle="В каждой процедуре — ваш шаг к ресурсному состоянию"
          />
          
          <div className="grid lg:grid-cols-3 gap-8">
            {SERVICES.map((s, i) => (
              <div key={s.id} className="bg-white rounded-[50px] p-10 md:p-12 border border-brand-secondary flex flex-col hover:shadow-xl transition-all">
                <div className="w-16 h-16 bg-brand-secondary rounded-2xl flex items-center justify-center text-brand-accent mb-10">
                  {s.icon}
                </div>
                <h3 className="font-display text-3xl font-bold mb-6 tracking-tight">{s.title}</h3>
                <p className="text-brand-dark/60 mb-8 flex-grow font-light text-lg tracking-tight">
                  {s.description}
                </p>
                <div className="p-6 bg-brand-primary/30 rounded-3xl mb-10">
                  <p className="text-xs uppercase font-bold text-brand-dark/30 mb-2 tracking-widest">Для кого</p>
                  <p className="text-sm font-medium">{s.forWhom}</p>
                </div>
                <div className="flex items-center justify-between pt-8 border-t border-brand-secondary">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-brand-dark/30 tracking-widest">Длительность / Цена</span>
                    <div className="font-display text-xl font-bold">{s.price} <span className="text-sm font-normal text-brand-dark/40 italic">/ {s.duration}</span></div>
                  </div>
                  <button className="w-12 h-12 bg-brand-dark text-white rounded-full flex items-center justify-center hover:bg-brand-accent transition-colors">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flagship Block */}
      <section id="complex" className="py-32 px-4 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="bg-brand-dark rounded-[100px] p-12 md:p-24 text-white relative overflow-hidden flex flex-col lg:flex-row gap-20">
             <div className="lg:w-3/5 relative z-10">
               <span className="text-brand-accent font-bold tracking-[0.4em] uppercase text-[10px] mb-10 block">Флагманский комплекс</span>
               <h2 className="font-display text-4xl md:text-7xl font-bold mb-10 tracking-tighter leading-[0.9]">Живой Пар + Синусоида</h2>
               <p className="text-xl text-white/50 mb-16 max-w-xl font-light leading-relaxed">
                 Идеальное комбо для первого знакомства со студией. Мягкий прогрев готовит тело, а волновое движение возвращает ему свободу.
               </p>
               
               <div className="grid grid-cols-2 gap-10 mb-16">
                 <div>
                   <div className="font-display text-5xl font-bold text-brand-accent mb-2">30</div>
                   <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30">Минут Живого Пара</p>
                 </div>
                 <div>
                   <div className="font-display text-5xl font-bold text-brand-accent mb-2">15</div>
                   <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30">Минуты Синусоиды</p>
                 </div>
               </div>
               
               <button className="px-12 py-6 bg-brand-accent text-white rounded-full text-xl font-bold hover:bg-white hover:text-brand-dark transition-all transform hover:-translate-y-1">
                 Записаться на комплекс — 2 200 ₽
               </button>
             </div>
             <div className="lg:w-2/5 flex items-center justify-center">
               <div className="w-full aspect-square border-2 border-white/10 rounded-full flex items-center justify-center relative">
                 <div className="absolute inset-0 bg-brand-accent/5 rounded-full blur-[100px]" />
                 <div className="text-center relative z-10">
                   <div className="text-8xl font-display font-bold">45</div>
                   <div className="text-xs uppercase tracking-[0.4em] font-bold text-brand-accent">минут отдыха</div>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Step by Step Section */}
      <section id="process" className="py-32 px-4 bg-white overflow-hidden relative border-t border-brand-secondary/50">
        <div className="max-w-7xl mx-auto">
          <SectionHeading 
            centered
            title="Путь к расслаблению"
            subtitle="Мы продумали каждую деталь вашего визита, чтобы вы могли просто закрыть глаза и довериться нам"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {STEPS.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 items-start"
              >
                <div className="w-16 h-16 bg-brand-secondary rounded-2xl flex items-center justify-center font-display text-2xl font-bold text-brand-accent shrink-0">
                  {step.n}
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2 tracking-tight">{step.t}</h4>
                  <p className="text-sm text-brand-dark/50 leading-relaxed font-light">{step.d}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Audiences Section */}
      <section className="py-32 px-4 bg-brand-primary">
        <div className="max-w-7xl mx-auto">
          <SectionHeading 
            centered
            title="Кому это необходимо?"
            subtitle="Наши гости — это люди, которые ценят свое время и качество жизни"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {AUDIENCES.map((item, i) => (
              <div key={i} className="p-10 bg-white rounded-[40px] border border-brand-secondary hover:border-brand-accent transition-all group">
                <div className="w-12 h-12 bg-brand-secondary/50 rounded-xl flex items-center justify-center text-brand-accent mb-6 group-hover:bg-brand-accent group-hover:text-white transition-colors">
                  <Target className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold mb-4 tracking-tight">{item.t}</h4>
                <p className="text-brand-dark/50 text-sm leading-relaxed font-light">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeading 
            centered
            title="Ощущения после визита"
            subtitle="Что чаще всего отмечают наши гости после процедур"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {RESULTS.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-[40px] bg-brand-secondary/20 border border-brand-secondary/50"
              >
                <h4 className="text-xl font-bold mb-4 tracking-tighter">{item.t}</h4>
                <p className="text-sm text-brand-dark/60 leading-relaxed font-light">{item.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="prices" className="py-32 px-4 bg-brand-primary">
        <div className="max-w-7xl mx-auto">
          <SectionHeading 
            centered
            title="Стоимость и форматы"
            subtitle="Выберите подходящий вариант для разового отдыха или долгосрочного восстановления"
          />
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Single Services */}
            <div className="bg-white rounded-[60px] p-12 border border-brand-secondary">
              <h3 className="text-2xl font-bold mb-10 tracking-tight">Разовые процедуры</h3>
              <div className="space-y-6">
                {PRICES.single.map((p, i) => (
                  <div key={i} className="flex items-center justify-between py-4 border-b border-brand-secondary last:border-0">
                    <div>
                      <div className="font-bold">{p.name}</div>
                      <div className="text-xs text-brand-dark/40 uppercase tracking-widest mt-1">{p.time}</div>
                    </div>
                    <div className="font-display font-bold text-lg">{p.price}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Complexes */}
            <div className="bg-brand-dark rounded-[60px] p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <ShieldCheck className="w-40 h-40" />
              </div>
              <h3 className="text-2xl font-bold mb-10 tracking-tight relative z-10">Выгодные комплексы</h3>
              <div className="space-y-6 relative z-10">
                {PRICES.complex.map((p, i) => (
                  <div key={i} className="flex items-center justify-between py-4 border-b border-white/10 last:border-0">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold">{p.name}</span>
                        {p.label && <span className="text-[9px] bg-brand-accent text-white px-2 py-0.5 rounded-full uppercase font-bold">{p.label}</span>}
                      </div>
                      <div className="text-xs text-white/40 line-through mt-1">{p.oldPrice}</div>
                    </div>
                    <div className="font-display font-bold text-xl text-brand-accent">{p.price}</div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-10 py-5 bg-brand-accent text-white rounded-full font-bold hover:bg-white hover:text-brand-dark transition-all">
                Записаться на комплекс
              </button>
            </div>

            {/* Courses */}
            <div className="lg:col-span-2 bg-white rounded-[60px] p-12 border border-brand-secondary">
              <h3 className="text-2xl font-bold mb-10 tracking-tight">Курсовые предложения</h3>
              <div className="grid md:grid-cols-2 gap-12">
                {PRICES.courses.map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-8 bg-brand-primary/50 rounded-3xl border border-brand-secondary">
                    <div>
                      <div className="font-bold text-lg">{p.name}</div>
                      <div className="text-xs text-brand-dark/40 line-through mt-1">{p.oldPrice}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-display font-bold text-2xl text-brand-dark">{p.price}</div>
                      <div className="text-[10px] text-brand-accent font-bold uppercase mt-1">Лучшая цена</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preparation Section */}
      <section className="py-32 px-4 bg-brand-dark text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center">
          <div className="lg:w-1/2">
            <SectionHeading 
              light
              title="Как подготовиться?"
              subtitle="Мы позаботились обо всём, чтобы ваш визит был максимально комфортным"
            />
            <div className="space-y-6 mt-12">
              {PREPARATION.map((item, i) => (
                <div key={i} className="flex gap-6 items-center">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6 text-brand-accent" />
                  </div>
                  <p className="text-lg font-light text-white/80">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="aspect-square bg-brand-secondary/10 rounded-[60px] border border-white/10 flex items-center justify-center p-20 text-center">
              <div>
                <Wind className="w-20 h-20 text-brand-accent mx-auto mb-8 opacity-50" />
                <h4 className="text-3xl font-bold mb-4 tracking-tight">Никаких забот</h4>
                <p className="text-white/40 font-light">Вам не нужно брать с собой сумки с вещами. Просто приходите — всё остальное ждет вас в студии.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section id="contacts" className="py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeading 
            centered
            title="Ждем вас в гости"
            subtitle="Студия находится в тихом районе Альметьевска, где легко припарковаться и забыть о городской суете"
          />
          
          <div className="grid lg:grid-cols-3 gap-8 mt-16">
            <div className="p-10 bg-brand-primary rounded-[40px] border border-brand-secondary">
              <h4 className="text-xl font-bold mb-4 tracking-tight">Адрес</h4>
              <p className="text-brand-dark/60 font-light">г. Альметьевск, <br/>уточняйте при записи</p>
            </div>
            <div className="p-10 bg-brand-primary rounded-[40px] border border-brand-secondary">
              <h4 className="text-xl font-bold mb-4 tracking-tight">Время работы</h4>
              <p className="text-brand-dark/60 font-light">Ежедневно: 09:00 — 21:00 <br/>По предварительной записи</p>
            </div>
            <div className="p-10 bg-brand-primary rounded-[40px] border border-brand-secondary">
              <h4 className="text-xl font-bold mb-4 tracking-tight">Контакты</h4>
              <p className="text-brand-dark/60 font-light">+7 (XXX) XXX-XX-XX <br/>WhatsApp / Telegram</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ & Gifts */}
      <section id="faq" className="py-32 px-4 bg-brand-primary">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24">
          <div>
            <SectionHeading 
              title="Часто спрашивают"
              subtitle="Отвечаем на важные вопросы перед вашим первым визитом"
            />
            <div className="space-y-6">
              {FAQ_ITEMS.map((item, i) => (
                <details key={i} className="group bg-white rounded-[40px] border border-brand-secondary overflow-hidden">
                  <summary className="p-10 flex items-center justify-between font-bold text-lg list-none cursor-pointer">
                    {item.q}
                    <div className="w-10 h-10 rounded-full bg-brand-secondary flex items-center justify-center group-open:rotate-45 transition-transform">
                      <Plus className="w-5 h-5 text-brand-accent" />
                    </div>
                  </summary>
                  <div className="px-10 pb-10 text-brand-dark/60 text-lg font-light leading-relaxed">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
          
          <div className="space-y-10">
            <div className="bg-brand-accent rounded-[80px] p-16 text-white relative overflow-hidden h-full flex flex-col justify-between">
              <div className="absolute top-0 right-0 p-16 opacity-10">
                <Gift className="w-48 h-48" />
              </div>
              <div>
                <h3 className="font-display text-5xl font-bold mb-8 leading-[0.9]">Подарите <br/>состояние ресурса</h3>
                <p className="text-lg text-white/70 font-light mb-16 leading-relaxed">
                  Сертификат в нашу студию — это проявление заботы через время, тишину и телесный комфорт.
                </p>
              </div>
              <button className="px-12 py-6 bg-brand-dark text-white rounded-full text-xl font-bold hover:bg-white hover:text-brand-dark transition-all">
                Купить сертификат
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-32 pb-16 px-4 bg-white border-t border-brand-secondary">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-20 mb-24">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 bg-brand-accent rounded-2xl flex items-center justify-center text-white font-display font-bold text-2xl uppercase">Р</div>
              <span className="font-display text-2xl font-bold tracking-tighter uppercase">Ресурс</span>
            </div>
            <h4 className="text-4xl font-display font-bold mb-12 tracking-tight leading-tight">Бережно восстанавливаем <br/>ваш телесный ресурс</h4>
            
            <div className="grid sm:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex gap-4">
                  <MapPin className="w-6 h-6 text-brand-accent shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-brand-dark/30 block mb-1">Адрес</span>
                    <p className="font-medium text-lg leading-tight">ул. Ленина, 140, офис 204 <br/><span className="text-sm font-normal text-brand-dark/50">Альметьевск</span></p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Phone className="w-6 h-6 text-brand-accent shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-brand-dark/30 block mb-1">Запись</span>
                    <p className="font-bold text-xl">+7 (917) 000-00-00</p>
                  </div>
                </div>
              </div>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <Clock className="w-6 h-6 text-brand-accent shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-brand-dark/30 block mb-1">График</span>
                    <p className="font-medium text-lg">Ежедневно <br/><span className="font-bold text-brand-accent italic">09:00 — 20:00</span></p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <a href="#" className="w-12 h-12 bg-brand-secondary rounded-2xl flex items-center justify-center hover:bg-brand-accent hover:text-white transition-all"><Instagram /></a>
                  <a href="#" className="w-12 h-12 bg-brand-secondary rounded-2xl flex items-center justify-center hover:bg-brand-accent hover:text-white transition-all"><MessageCircle /></a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:pt-10">
            <h5 className="font-bold uppercase tracking-[0.2em] text-[10px] mb-10 text-brand-dark/30">Карта сайта</h5>
            <ul className="space-y-5 font-medium text-lg">
              <li><a href="#about" className="hover:text-brand-accent transition-colors">О студии</a></li>
              <li><a href="#services" className="hover:text-brand-accent transition-colors">Услуги</a></li>
              <li><a href="#complex" className="hover:text-brand-accent transition-colors text-balance">Флагманский комплекс</a></li>
              <li><a href="#faq" className="hover:text-brand-accent transition-colors">Частые вопросы</a></li>
            </ul>
          </div>
          
          <div className="md:pt-10 flex flex-col justify-between">
            <div>
              <h5 className="font-bold uppercase tracking-[0.2em] text-[10px] mb-10 text-brand-dark/30">Для быстрой связи</h5>
              <button className="w-full py-5 bg-brand-dark text-white rounded-full font-bold shadow-xl shadow-brand-dark/10 hover:bg-brand-accent transition-all flex items-center justify-center gap-2 mb-6">
                Написать в WhatsApp <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="text-[10px] leading-relaxed text-brand-dark/30 italic">
               * Не является медицинской услугой. Возможны противопоказания.
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-12 border-t border-brand-secondary text-xs text-brand-dark/40 flex flex-col md:flex-row justify-between gap-6 uppercase tracking-widest font-bold">
          <p>© {new Date().getFullYear()} Студия телесного восстановления «РЕСУРС»</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-brand-dark transition-colors">Политика данных</a>
            <a href="#" className="hover:text-brand-dark transition-colors">Договор оферты</a>
          </div>
        </div>
      </footer>

      {/* Sticky Mobile Panel */}
      <div className="md:hidden fixed bottom-0 left-0 w-full p-4 bg-white/80 backdrop-blur-lg border-t border-brand-secondary z-40 flex gap-3">
        <button className="flex-grow py-4 bg-brand-dark text-white rounded-2xl font-bold text-sm shadow-xl shadow-brand-dark/10">
          Записаться
        </button>
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('open-ai'))}
          className="w-14 h-14 bg-brand-accent text-white rounded-2xl flex items-center justify-center shrink-0 shadow-xl shadow-brand-accent/20"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}


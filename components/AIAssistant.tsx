"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bot, Mic, Send } from "lucide-react";

interface Message {
  sender: "User" | "AI";
  text: string;
  time: string;
}

interface AIAssistantProps {
  onToast: (msg: string) => void;
  chatTrigger: string | null;
  onChatTriggerConsumed: () => void;
}

export default function AIAssistant({ onToast, chatTrigger, onChatTriggerConsumed }: AIAssistantProps) {
  const [lang, setLang] = useState("en");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "AI",
      text: "Hello! I am your StadiumGPT assistant. Ask me anything about routes, crowds, accessibility or emergency status.",
      time: "08:45 PM"
    },
    {
      sender: "User",
      text: "Where is the nearest food court?",
      time: "08:45 PM"
    },
    {
      sender: "AI",
      text: "The nearest food court is at Section 107 (South Concourse). Approx. 3 minutes walk from your current location.",
      time: "08:46 PM"
    }
  ]);

  const feedRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat feed
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle external prompts (like clicking items in Sidebar/Volunteers)
  useEffect(() => {
    if (chatTrigger) {
      handleUserSendMessage(chatTrigger);
      onChatTriggerConsumed();
    }
  }, [chatTrigger]);

  const handleUserSendMessage = (textToSend: string) => {
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = {
      sender: "User",
      text: textToSend,
      time
    };

    setMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      const response = getAIResponseText(textToSend, lang);
      const aiMsg: Message = {
        sender: "AI",
        text: response,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 700);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleUserSendMessage(input);
    setInput("");
  };

  const switchLanguage = (newLang: string) => {
    setLang(newLang);
    const greets: Record<string, string> = {
      en: "Hello! I am your StadiumGPT assistant. Ask me anything about routes, crowds, accessibility or emergency status.",
      es: "¡Hola! Soy tu asistente StadiumGPT. Pregúntame sobre rutas, multitudes, accesibilidad o seguridad de emergencia.",
      fr: "Bonjour! Je suis votre assistant StadiumGPT. Posez-moi des questions sur les navettes, la foule ou la sécurité.",
      ar: "مرحباً! أنا مساعدك الذكي في الملعب. اسألني عن مسارات التنقل، الازدحام، الإسعافات أو الطوارئ.",
      ja: "こんにちは！スタジアムGPTアシスタントです。混雑状況、非常口、シャトルバスについてお気軽にご質問ください。"
    };

    setMessages(prev => [
      ...prev,
      {
        sender: "AI",
        text: greets[newLang] || greets.en,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);

    const languageNames: Record<string, string> = {
      en: "English",
      es: "Español",
      fr: "Français",
      ar: "العربية",
      ja: "日本語"
    };

    onToast(`Language switched to: ${languageNames[newLang]}`);
  };

  const triggerMicMock = () => {
    onToast("Listening... Speak now. (Voice transcription simulation activated)");
    setTimeout(() => {
      setInput("Where is the nearest emergency exit?");
      onToast("Voice transcription complete: 'Where is the nearest emergency exit?'");
    }, 2000);
  };

  return (
    <div className="rounded-2xl bg-gradient-to-b from-indigo-950/40 to-navy-card/30 border border-navy-border p-5 flex flex-col justify-between backdrop-blur-md relative h-full">
      <div className="absolute inset-0 bg-gradient-to-t from-neon-purple/5 to-transparent pointer-events-none"></div>

      {/* Header with Language Selector */}
      <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-navy-border/50">
        <div className="flex items-center space-x-2">
          <Bot className="w-4 h-4 text-neon-purple" />
          <h3 className="text-xs font-bold uppercase tracking-wider">AI Assistant</h3>
        </div>
        <div>
          <select
            value={lang}
            onChange={e => switchLanguage(e.target.value)}
            className="bg-navy-dark border border-navy-border rounded-lg px-2 py-1 text-[9px] font-semibold text-gray-300 focus:outline-none cursor-pointer"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="ar">العربية</option>
            <option value="ja">日本語</option>
          </select>
        </div>
      </div>

      {/* Chat Dialog Feed */}
      <div
        ref={feedRef}
        className="flex-1 overflow-y-auto pr-1 space-y-3 h-[200px] custom-scroll text-xs mb-3"
      >
        {messages.map((m, idx) => {
          const isAi = m.sender === "AI";
          return (
            <div
              key={idx}
              className={`flex items-start space-x-2 fade-in ${
                isAi ? "" : "justify-end"
              }`}
            >
              {isAi && (
                <div className="w-6 h-6 rounded-lg bg-neon-purple/10 border border-neon-purple/30 flex items-center justify-center text-neon-purple text-[10px] font-bold">
                  AI
                </div>
              )}
              <div
                className={`border rounded-bl-xl p-2.5 max-w-[85%] ${
                  isAi
                    ? "bg-navy-dark/80 border-navy-border/60 rounded-r-xl"
                    : "bg-neon-purple/10 border-neon-purple/20 rounded-l-xl rounded-br-xl text-white"
                }`}
              >
                <p className={isAi ? "text-gray-300" : "text-white"}>{m.text}</p>
                <span className="text-[8px] text-gray-500 block text-right mt-1">{m.time}</span>
              </div>
              {!isAi && (
                <div className="w-6 h-6 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan text-[10px] font-bold">
                  U
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Chat input fields */}
      <div>
        {/* Quick action shortcuts */}
        <div className="flex flex-wrap gap-1 mb-2">
          <button
            onClick={() => handleUserSendMessage("Nearest emergency exit")}
            className="px-2 py-1 bg-navy-dark hover:bg-navy-dark/80 border border-navy-border rounded-lg text-[8px] text-gray-400 hover:text-white transition-colors"
          >
            Emergency Exit?
          </button>
          <button
            onClick={() => handleUserSendMessage("Gate D congestion level")}
            className="px-2 py-1 bg-navy-dark hover:bg-navy-dark/80 border border-navy-border rounded-lg text-[8px] text-gray-400 hover:text-white transition-colors"
          >
            Gate D Density?
          </button>
          <button
            onClick={() => handleUserSendMessage("Shuttle schedule")}
            className="px-2 py-1 bg-navy-dark hover:bg-navy-dark/80 border border-navy-border rounded-lg text-[8px] text-gray-400 hover:text-white transition-colors"
          >
            Bus Status?
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={lang === "ja" ? "質問を入力してください..." : "Ask anything..."}
            className="w-full bg-navy-dark/80 border border-navy-border focus:border-neon-purple/60 focus:ring-1 focus:ring-neon-purple/20 text-xs px-3.5 py-2.5 rounded-xl pr-20 focus:outline-none transition-all placeholder-gray-500 text-white"
          />
          <div className="absolute right-2 flex items-center space-x-1">
            <button
              type="button"
              onClick={triggerMicMock}
              className="p-1 text-gray-400 hover:text-white transition-colors"
            >
              <Mic className="w-3.5 h-3.5" />
            </button>
            <button
              type="submit"
              className="p-1.5 bg-neon-purple text-white rounded-lg hover:bg-neon-purple/95 transition-colors shadow-md shadow-neon-purple/20"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Response generator
function getAIResponseText(query: string, lang: string): string {
  const q = query.toLowerCase();
  const responses: Record<string, Record<string, string>> = {
    en: {
      exit: "Emergency exits are located at Gates A, B, D, and E. The nearest exit from your current position is Gate E. Follow the green glowing floor markings.",
      food: "Food courts are located on Concourse Levels 1 (Section 107) and 2 (Section 224). Level 1 has pizza and burgers; Level 2 features global cuisine.",
      medical: "The nearest First Aid station is at Gate C (West Concourse). Support team has been alerted and can be contacted via the Volunteer hub.",
      congestion: "Gate D is currently experiencing critical congestion (94% density). We recommend fans exit via Gate A or E where crowd flow is normal.",
      shuttle: "Shuttle buses run every 5 minutes from Lot 4 to the central metro station. Transit status is On Time.",
      generic: "I've analyzed the request. Stadium telemetry shows normal operations. Let me know if you need specific route planning or gate capacity forecasts."
    },
    es: {
      exit: "Las salidas de emergencia están ubicadas en las Puertas A, B, D y E. La salida más cercana es la Puerta E. Siga las marcas iluminadas en verde.",
      food: "Las plazas de comida están en los niveles 1 (Sección 107) y 2 (Sección 224). Hamburguesas y pizza disponibles.",
      medical: "La estación de primeros auxilios más cercana está en la Puerta C. Hemos alertado al equipo médico de apoyo.",
      congestion: "La Puerta D tiene congestión crítica (94%). Le recomendamos salir por la Puerta A o E.",
      shuttle: "Los autobuses lanzadera salen cada 5 minutos hacia el metro. Estado del tránsito: A tiempo.",
      generic: "Entendido. La telemetría del estadio muestra operaciones normales. ¿En qué más puedo ayudarle?"
    },
    fr: {
      exit: "Les sorties de secours sont situées aux Portes A, B, D et E. La sortie la plus proche est la Porte E. Suivez les flèches lumineuses vertes.",
      food: "Les restaurants sont situés au Niveau 1 (Section 107) et Niveau 2 (Section 224). Pizzas, burgers et spécialités mondiales.",
      medical: "Le poste de secours le plus proche est à la Porte C (Hall Ouest). L'équipe médicale a été prévenue.",
      congestion: "La Porte D est très encombrée (94% de densité). Veuillez utiliser les Portes A ou E pour sortir.",
      shuttle: "Navettes gratuites toutes les 5 minutes vers le métro. Statut du transit: À l'heure.",
      generic: "Demande analysée. Les systèmes fonctionnent normalement. Posez-moi des questions sur les navettes ou la sécurité."
    },
    ar: {
      exit: "مخارج الطوارئ تقع عند البوابات A و B و D و E. المخرج الأقرب هو البوابة E. يرجى اتباع الإشارات المضيئة باللون الأخضر.",
      food: "صالة الطعام تقع في الطابق الأول (قسم 107) والطابق الثاني (قسم 224). تتوفر الوجبات السريعة والمأكولات العالمية.",
      medical: "أقرب وحدة إسعافات أولية تقع عند البوابة C. تم إخطار فريق الدعم الطبي.",
      congestion: "البوابة D تشهد ازدحاماً حرجاً (94%). ننصح باستخدام البوابة A أو E للخروج الآمن.",
      shuttle: "الحافلات الترددية تعمل كل 5 دقائق إلى محطة المترو الرئيسية. حركة المرور منتظمة.",
      generic: "تمت معالجة الطلب. القياسات الحيوية للملعب طبيعية. كيف يمكنني مساعدتك أكثر؟"
    },
    ja: {
      exit: "非常口はゲートA、B、D、Eにあります。現在地から最も近いのはゲートEです。緑色の誘導表示に従ってください。",
      food: "フードコートは1階（107セクション）と2階（224セクション）にあります。ピザ、バーガー、多国籍料理があります。",
      medical: "最寄りの救護所はゲートC（西コンコース）にあります。ボランティアチームがサポート可能です。",
      congestion: "ゲートDは現在非常に混雑しています（混雑率94%）。ゲートAまたはEからの退場をお勧めします。",
      shuttle: "シャトルバスは5分間隔で中央駅まで運行しています。運行状況：平常通り。",
      generic: "スタジアムの運行システムは正常です。ルート案内、ゲート混雑予測など何でもお尋ねください。"
    }
  };

  const dict = responses[lang] || responses.en;

  if (q.includes("exit") || q.includes("out") || q.includes("salida") || q.includes("sortie") || q.includes("مخرج") || q.includes("出口") || q.includes("非常")) {
    return dict.exit;
  } else if (q.includes("food") || q.includes("eat") || q.includes("comida") || q.includes("nourriture") || q.includes("طعام") || q.includes("フード") || q.includes("飯")) {
    return dict.food;
  } else if (q.includes("medical") || q.includes("doctor") || q.includes("help") || q.includes("aid") || q.includes("médical") || q.includes("إسعاف") || q.includes("救護") || q.includes("医")) {
    return dict.medical;
  } else if (q.includes("congestion") || q.includes("crowd") || q.includes("gate d") || q.includes("tráfico") || q.includes("ازدحام") || q.includes("混雑")) {
    return dict.congestion;
  } else if (q.includes("shuttle") || q.includes("bus") || q.includes("metro") || q.includes("autobús") || q.includes("navette") || q.includes("バス") || q.includes("電車")) {
    return dict.shuttle;
  } else {
    return dict.generic;
  }
}

import React, { useState, useRef, useEffect } from "react";
import { Send, Mic, Sparkles, Languages } from "lucide-react";

interface Message {
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "StadiumGPT AI Assistant online. Monitoring telemetry systems. How can I assist you with stadium operations?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("EN");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Quick prompt chips
  const quickPrompts = [
    "Crowd levels at gates?",
    "Transit & Metro status?",
    "Sustainability metrics?",
    "Gate B security check?"
  ];

  // International language chips
  const languages = [
    { code: "EN", name: "English" },
    { code: "ES", name: "Español" },
    { code: "FR", name: "Français" },
    { code: "AR", name: "العربية" },
    { code: "HI", name: "हिं" },
    { code: "JA", name: "日本語" },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      sender: "user",
      text: textToSend,
      timestamp: userTime,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: textToSend }),
      });

      if (!response.ok) {
        throw new Error("Assistant API failed");
      }

      const data = await response.json();
      
      // Simulate slightly delayed typing response
      setTimeout(() => {
        const aiMsg: Message = {
          sender: "ai",
          text: data.response,
          timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);
      }, 700);

    } catch (error) {
      console.error(error);
      setTimeout(() => {
        const errMsg: Message = {
          sender: "ai",
          text: "Communication error with AI dispatch server. Please verify FastAPI backend status.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errMsg]);
        setIsTyping(false);
      }, 500);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 flex flex-col h-[520px]">
      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-gray-800/80 mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-brand-purple/10 border border-brand-purple/25 text-brand-purple">
            <Sparkles className="w-4 h-4 animate-pulse-slow" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white leading-tight">StadiumGPT AI Copilot</h3>
            <span className="text-[10px] text-gray-500">Operations Control Center</span>
          </div>
        </div>

        {/* Languages Selector */}
        <div className="flex items-center space-x-1">
          <Languages className="w-3.5 h-3.5 text-gray-500 mr-1" />
          <div className="flex space-x-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded transition-all ${
                  selectedLanguage === lang.code
                    ? "bg-brand-purple text-white"
                    : "bg-gray-800 text-gray-400 hover:text-gray-200"
                }`}
              >
                {lang.code === "HI" ? "हिं" : lang.code === "AR" ? "ع" : lang.code}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages Bubbles Area */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 mb-3 scrollbar-thin">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs ${
                msg.sender === "user"
                  ? "bg-brand-purple/20 text-white border border-brand-purple/30 rounded-tr-none"
                  : "bg-gray-900/60 text-gray-200 border border-gray-800 rounded-tl-none"
              }`}
            >
              {msg.text}
            </div>
            <span className="text-[9px] text-gray-500 mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}

        {isTyping && (
          <div className="flex flex-col items-start">
            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl rounded-tl-none px-4 py-3 text-xs flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-bounce" style={{ animationDelay: "0ms" }}></span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-bounce" style={{ animationDelay: "150ms" }}></span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-bounce" style={{ animationDelay: "300ms" }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="text-[10px] text-brand-cyan hover:text-white border border-brand-cyan/20 hover:border-brand-cyan bg-brand-cyan/5 hover:bg-brand-cyan/10 rounded-full px-2.5 py-1 transition-all"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="flex items-center space-x-2 bg-gray-900/80 border border-gray-800 rounded-xl px-3 py-1.5 focus-within:border-brand-purple transition-all"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask StadiumGPT about metrics..."
          className="flex-1 bg-transparent border-none text-xs text-white focus:outline-none placeholder-gray-500"
        />
        <button
          type="button"
          className="p-1 rounded-lg text-gray-500 hover:text-brand-purple hover:bg-gray-800 transition-all"
          title="Voice Command"
        >
          <Mic className="w-4 h-4" />
        </button>
        <button
          type="submit"
          className="p-1.5 rounded-lg bg-brand-purple/20 border border-brand-purple/35 text-brand-purple hover:bg-brand-purple hover:text-white transition-all disabled:opacity-50"
          disabled={!input.trim()}
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};

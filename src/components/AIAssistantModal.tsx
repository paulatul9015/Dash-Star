import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  ShoppingCart, 
  ShieldCheck, 
  RotateCcw,
  ArrowRight,
  Lightbulb,
  ExternalLink,
  Star
} from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  currentProduct?: Product | null;
}

interface Message {
  role: 'assistant' | 'user';
  text: string;
  suggestedProductIds?: string[];
  timestamp: string;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onAddToCart,
  currentProduct,
}) => {
  if (!isOpen) return null;

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: "Hello! I'm StarBot, Dash Star's AI Ride-On Toy Consultant. 🌟\n\nI can recommend the perfect toy based on your child's age (from 6-month toddlers to 12-year riders), explain 12V dual-motor EV specs, guide battery maintenance, or detail our Bureau of Indian Standards (BIS IS 9873) safety engineering. How can I help you today?",
      suggestedProductIds: ['prod-001', 'prod-003', 'prod-005'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const quickPrompts = [
    "What's safest for a 2-year toddler?",
    "Show 12V electric bikes with remote",
    "How to maintain the 12V battery?",
    "Compare DUCATTI Superbike vs HUMR EV Jeep",
    "Best kick scooter for 5-7 year olds"
  ];

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages.map((m) => ({
            role: m.role,
            content: m.text,
          })),
          productContext: currentProduct ? {
            id: currentProduct.id,
            name: currentProduct.name,
            category: currentProduct.category,
            price: currentProduct.price,
            ageRange: currentProduct.ageRange,
            batterySpec: currentProduct.batterySpec
          } : undefined,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();

      const botMsg: Message = {
        role: 'assistant',
        text: data.reply || "I'm delighted to assist you! Please let me know if you need more recommendations.",
        suggestedProductIds: data.matchedProductIds || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat request error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: "I'm here to help! For 1.5-4 year toddlers, our BUNNY Magic Swing Car (₹2,365) and SMART 3-in-1 Stroller (₹2,655) are ideal. For 3-8 years, our DUCATTI 12V Superbike (₹5,630) and HUMR EV Jeep (₹3,965) are top parent choices with BIS certification!",
          suggestedProductIds: ['prod-001', 'prod-002', 'prod-003'],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh] border border-slate-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-indigo-950 flex items-center justify-center font-black shadow-md">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-base sm:text-lg">StarBot AI Consultant</h2>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Gemini 3.7 Flash
                </span>
              </div>
              <p className="text-xs text-indigo-200">
                Live AI Toy Advisor • BIS IS 9873 Safety & Engineering Specialist
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50">
          {messages.map((m, idx) => {
            // Retrieve matched product objects for this message
            const matchedProducts = (m.suggestedProductIds || [])
              .map((id) => PRODUCTS.find((p) => p.id === id))
              .filter(Boolean) as Product[];

            return (
              <div
                key={idx}
                className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-900 text-amber-400 flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[88%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-3 ${
                    m.role === 'user'
                      ? 'bg-indigo-950 text-white rounded-tr-none shadow-sm'
                      : 'bg-white text-slate-800 rounded-tl-none border border-slate-200 shadow-2xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>

                  {/* Interactive Recommended Toy Cards */}
                  {matchedProducts.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <span className="text-[11px] font-bold text-indigo-950 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" /> Recommended Matching Toys:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {matchedProducts.map((prod) => (
                          <div
                            key={prod.id}
                            className="p-2.5 bg-slate-50 hover:bg-indigo-50/50 rounded-xl border border-slate-200 transition-all flex flex-col justify-between"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-12 h-12 rounded-lg object-cover bg-white shrink-0 border border-slate-200"
                                referrerPolicy="no-referrer"
                              />
                              <div className="overflow-hidden">
                                <h4 className="font-bold text-xs text-slate-900 truncate">{prod.name}</h4>
                                <span className="text-xs font-black text-indigo-950 block">
                                  ₹{prod.price.toLocaleString('en-IN')}
                                </span>
                                <span className="text-[10px] text-slate-500 font-medium">Age {prod.ageRange}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100">
                              <button
                                onClick={() => onSelectProduct(prod)}
                                className="flex-1 py-1 px-2 text-[10px] font-bold bg-white text-indigo-950 hover:bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center gap-1"
                              >
                                <span>Details</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </button>
                              <button
                                onClick={() => onAddToCart(prod)}
                                className="py-1 px-2 text-[10px] font-bold bg-indigo-950 hover:bg-indigo-900 text-white rounded-lg flex items-center justify-center gap-1"
                                title="Add to cart"
                              >
                                <ShoppingCart className="w-2.5 h-2.5 text-amber-400" />
                                <span>+Cart</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <span
                    className={`text-[10px] block ${
                      m.role === 'user' ? 'text-indigo-300 text-right' : 'text-slate-400'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>

                {m.role === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl bg-indigo-900 text-amber-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-600 rounded-tl-none flex items-center gap-2 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                <span className="animate-pulse">StarBot is analyzing catalog specs, motor curves & motor skills...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSend(qp)}
              className="text-[11px] font-medium bg-slate-100 hover:bg-indigo-50 hover:text-indigo-900 text-slate-700 px-3 py-1.5 rounded-full shrink-0 border border-slate-200 transition-colors whitespace-nowrap"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything (e.g. 'I want a safe electric jeep under ₹6000 for a 4-year-old')..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm outline-none focus:border-indigo-600 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 py-3 bg-indigo-950 hover:bg-indigo-900 disabled:opacity-50 text-white rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};


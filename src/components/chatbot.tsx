"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageSquare, Send, X, Bot, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { slugify } from "@/lib/slugify";

interface Message {
  role: string;
  content: string;
  products?: any[];
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })) 
        }),
      });

      const data = await response.json();
      if (data.response) {
        setMessages((prev) => [...prev, { 
          role: "assistant", 
          content: data.response,
          products: data.products 
        }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I encountered an error." }]);
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Failed to connect to the chatbot." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageContent = (msg: Message) => {
    if (!msg.content) return null;

    // Split content by product card tags [PRODUCT_CARD:id]
    const parts = msg.content.split(/(\[PRODUCT_CARD:[a-f0-9-]{36}\])/g);
    
    return (
      <div className="space-y-3">
        {parts.map((part, index) => {
          const match = part.match(/\[PRODUCT_CARD:([a-f0-9-]{36})\]/);
          if (match) {
            const productId = match[1];
            const product = msg.products?.find(p => p.id === productId);
            
            if (!product) return null;

            return (
              <Link
                key={index}
                href={`/products/${slugify(product.title)}`}
                target="_self"
                className="block bg-white/10 rounded-xl overflow-hidden hover:bg-accent/20 transition-all border border-white/5 group"
              >
                <div className="flex gap-3 p-2">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                    {product.image_urls?.[0] ? (
                      <img
                        src={product.image_urls[0]}
                        alt={product.title}
                        className="w-full h-full object-contain p-1 group-hover:scale-110 transition-transform"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/20 text-[10px]">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h4 className="text-[11px] font-medium text-white truncate leading-tight">{product.title}</h4>
                    <p className="text-[11px] text-accent font-bold mt-0.5">
                      RS. {product.price?.toLocaleString()}
                    </p>
                    <div className="flex gap-1.5 mt-1 flex-wrap">
                      {product.specs?.ram && (
                        <span className="text-[8px] bg-white/10 px-1.5 py-0.5 rounded text-white/70">
                          {product.specs.ram}
                        </span>
                      )}
                      {product.specs?.storage && (
                        <span className="text-[8px] bg-white/10 px-1.5 py-0.5 rounded text-white/70">
                          {product.specs.storage}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          }
          
          return part.trim() ? (
            <p key={index} className="whitespace-pre-wrap leading-relaxed">{part}</p>
          ) : null;
        })}
      </div>
    );
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-[92px] right-[24px] z-[50] bg-accent text-white p-[14px] rounded-full shadow-[0_10px_30px_rgba(220,38,38,0.4)] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group"
        aria-label="Open Chatbot"
      >
        <MessageSquare size={28} className="drop-shadow-sm group-hover:drop-shadow-md" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-[160px] right-[24px] z-[60] w-[350px] max-w-[calc(100vw-48px)] h-[500px] bg-[#0c1221] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-accent flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Lapzen" className="w-6 h-6 rounded-full object-contain bg-white p-0.5 shadow-sm" />
                <span className="font-semibold text-sm">Lapzen Assistant</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-1 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
              {messages.length === 0 && (
                <div className="text-center text-white/40 mt-10">
                  <Bot size={40} className="mx-auto mb-2 opacity-20" />
                  <p className="text-sm">How can I help you today?</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-[13px] ${
                      msg.role === "user"
                        ? "bg-accent text-white rounded-tr-none shadow-lg"
                        : "bg-white/5 text-white/90 border border-white/10 rounded-tl-none"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5 opacity-50 text-[10px] uppercase font-bold tracking-wider">
                      {msg.role === "user" ? (
                        <>
                          <span>You</span>
                          <User size={10} />
                        </>
                      ) : (
                        <>
                          <img src="/logo.png" alt="Lapzen" className="w-4 h-4 rounded-full object-contain bg-white p-0.5" />
                          <span>Lapzen</span>
                        </>
                      )}
                    </div>
                    {renderMessageContent(msg)}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 text-white/90 border border-white/10 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-accent" />
                    <span className="text-[13px] opacity-50">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-white/5">
              <div className="relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full bg-[#0c1221] border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm text-white !text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 transition-colors"
                  />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-accent hover:bg-accent/10 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

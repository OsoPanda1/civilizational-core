import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function RealitoOrb() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "¡Hola! Soy **REALITO**, tu guía cognitivo de Real del Monte. Pregúntame sobre comida, historia, aventura, hospedaje o cultura. 🏔️",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("realito-chat", {
        body: {
          messages: allMessages
            .filter((m) => m.id !== "welcome")
            .map((m) => ({ role: m.role, content: m.content })),
        },
      });

      if (error) throw error;
      const content = data?.response || data?.choices?.[0]?.message?.content || "La bruma interrumpió la señal. ⛏️";
      setMessages((prev) => [...prev, { id: `a_${Date.now()}`, role: "assistant", content }]);
    } catch (e) {
      console.error("Realito error:", e);
      setMessages((prev) => [
        ...prev,
        { id: `err_${Date.now()}`, role: "assistant", content: "La bruma de la sierra interrumpió la señal. Explora el centro histórico mientras reconecto. ⛏️" },
      ]);
    }
    setIsLoading(false);
  };

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[hsl(var(--rdm-amber))] flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
            style={{ boxShadow: "0 0 20px hsl(24 72% 50% / 0.3)" }}
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] rounded-2xl rdm-glass shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-[hsl(220_11%_82%)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[hsl(var(--rdm-amber))] flex items-center justify-center relative">
                    <Sparkles className="w-5 h-5 text-white" />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white bg-[hsl(var(--rdm-green))]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ fontFamily: "var(--font-display)" }}>REALITO AI</p>
                    <p className="text-[10px] text-[hsl(215_13%_42%)]" style={{ fontFamily: "var(--font-body)" }}>
                      IA Territorial · Real del Monte
                    </p>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} className="text-[hsl(215_13%_42%)] hover:text-[hsl(218_24%_18%)] p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[hsl(var(--rdm-amber))] text-white rounded-br-sm"
                        : "bg-[hsl(210_18%_90%)] text-[hsl(218_24%_18%)] rounded-bl-sm"
                    }`}
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="px-4 py-2.5 rounded-2xl bg-[hsl(210_18%_90%)] rounded-bl-sm">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-2 h-2 rounded-full bg-[hsl(215_13%_42%)]"
                          style={{ animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-[hsl(220_11%_82%)]">
              <form
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Pregunta sobre Real del Monte..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[hsl(220_11%_82%)] bg-white/80 text-sm outline-none focus:ring-2 focus:ring-[hsl(var(--rdm-amber)/0.3)]"
                  style={{ fontFamily: "var(--font-body)" }}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="w-10 h-10 rounded-xl bg-[hsl(var(--rdm-amber))] text-white flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

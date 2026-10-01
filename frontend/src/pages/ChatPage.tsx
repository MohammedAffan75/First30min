import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Heart, X, Phone, Moon, Sun, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import api from "../lib/api";
import { ChatMessage, ChatResponse, Severity } from "../types";
import Disclaimer from "../components/Disclaimer";
import CrisisCard from "../components/CrisisCard";
import SuggestionCard from "../components/SuggestionCard";
import HelplineBar from "../components/HelplineBar";
import toast from "react-hot-toast";

const DISCLAIMER_TEXT =
  "I'm an AI support router, not a therapist. I'm here to help you through the next 30 minutes. If you're in immediate danger, please call 14416 (Tele-MANAS) or 9820466627 (AASRA).";

// Per-message extra data
interface MessageMeta {
  crisis_resources?: ChatResponse["crisis_resources"];
  emergency_contacts?: { id: number; label: string; name: string; phone: string }[];
  suggested_actions?: string[];
  motivational_story?: { title: string; story: string };
  suggested_song?: { title: string; artist: string; vibe: string };
  suggested_movie?: { title: string; type: string; reason: string };
  severity?: Severity;
}

export default function ChatPage() {
  const { user, logout } = useAuth();
  const { theme, toggle: toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [meta, setMeta] = useState<MessageMeta[]>([]); // parallel array of message metadata
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [currentSeverity, setCurrentSeverity] = useState<Severity>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const startSession = () => {
    setStarted(true);
    const welcome: ChatMessage = {
      role: "assistant",
      content: `Hey ${user?.nickname || "there"} 💜 I'm here. What's going on right now? Tell me anything – even just "I don't know" is okay.\n\n${DISCLAIMER_TEXT}`,
      timestamp: new Date(),
    };
    setMessages([welcome]);
    setMeta([{}]);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: "user", content: input.trim(), timestamp: new Date() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setMeta((m) => [...m, {}]);
    setInput("");
    setLoading(true);

    try {
      const history = updatedMessages
        .filter((m) => m.role !== "assistant" || !m.content.includes(DISCLAIMER_TEXT))
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await api.post<ChatResponse>("/chat", {
        session_id: sessionId,
        message: userMsg.content,
        history: history.slice(-10), // last 10 messages for context
      });

      const data = res.data;
      if (data.session_id) setSessionId(data.session_id);
      if (data.severity) setCurrentSeverity(data.severity);

      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: data.reply,
        severity: data.severity,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setMeta((prev) => [
        ...prev,
        {
          crisis_resources: data.crisis_resources || undefined,
          suggested_actions: data.suggested_actions || undefined,
          motivational_story: (data as any).motivational_story,
          suggested_song: (data as any).suggested_song,
          suggested_movie: (data as any).suggested_movie,
          severity: data.severity,
        },
      ]);
    } catch (err: any) {
      const errMsg = err?.response?.data?.detail || "Couldn't reach the server. Please check the backend is running.";
      toast.error(errMsg);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having trouble connecting right now. If you need help urgently, please call Tele-MANAS: 14416.",
          timestamp: new Date(),
        },
      ]);
      setMeta((prev) => [...prev, {}]);
    } finally {
      setLoading(false);
    }
  };

  const endSession = async () => {
    if (sessionId) {
      try {
        await api.post(`/chat/${sessionId}/end`);
      } catch {}
    }
    setStarted(false);
    setMessages([]);
    setMeta([]);
    setSessionId(null);
    setCurrentSeverity(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const severityBadgeColor = {
    Low: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    Moderate: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    High: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)]" style={{ paddingBottom: "56px" }}>
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-[var(--card)] border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-[var(--fg)]">First 30 Minutes</span>
          {currentSeverity && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${severityBadgeColor[currentSeverity]}`}>
              {currentSeverity}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-[var(--bg)] transition" aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="w-4 h-4 text-[var(--muted)]" /> : <Moon className="w-4 h-4 text-[var(--muted)]" />}
          </button>
          <button onClick={() => navigate("/profile")} className="p-2 rounded-lg hover:bg-[var(--bg)] transition" aria-label="Profile">
            <User className="w-4 h-4 text-[var(--muted)]" />
          </button>
          {started && (
            <button
              onClick={endSession}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
            >
              <X className="w-3 h-3" /> End session
            </button>
          )}
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 overflow-y-auto">
        {!started ? (
          // Landing screen
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)] p-6 text-center space-y-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-300/30"
            >
              <Heart className="w-12 h-12 text-white" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="space-y-2"
            >
              <h1 className="text-3xl font-bold text-[var(--fg)]">
                Hi {user?.nickname || "there"} 💜
              </h1>
              <p className="text-[var(--muted)] max-w-xs mx-auto">
                You're not alone right now. I'm here for the next 30 minutes.
              </p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileTap={{ scale: 0.97 }}
              onClick={startSession}
              className="w-full max-w-xs py-5 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 text-white text-lg font-bold shadow-lg shadow-brand-300/40 hover:shadow-xl hover:shadow-brand-300/50 transition-all"
            >
              I need help right now
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="w-full max-w-xs"
            >
              <Disclaimer />
            </motion.div>
          </div>
        ) : (
          // Chat view
          <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] space-y-2`}>
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === "user"
                          ? "bg-brand-500 text-white rounded-br-sm"
                          : "bg-[var(--card)] text-[var(--fg)] border border-[var(--border)] rounded-bl-sm"
                      }`}
                    >
                      {msg.content}
                    </div>

                    {/* Enrich assistant messages */}
                    {msg.role === "assistant" && meta[i] && (
                      <div className="space-y-2">
                        {meta[i].crisis_resources && (
                          <CrisisCard
                            resources={meta[i].crisis_resources!}
                            contacts={meta[i].emergency_contacts}
                          />
                        )}
                        {(meta[i].suggested_actions || meta[i].suggested_song || meta[i].suggested_movie || meta[i].motivational_story) && (
                          <SuggestionCard
                            actions={meta[i].suggested_actions}
                            song={meta[i].suggested_song}
                            movie={meta[i].suggested_movie}
                            story={meta[i].motivational_story}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <div className="flex justify-start">
                <div className="bg-[var(--card)] border border-[var(--border)] px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1.5 items-center">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [-3, 0, -3] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
                        className="w-2 h-2 rounded-full bg-brand-400"
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </main>

      {/* Input bar */}
      {started && (
        <div className="sticky bottom-14 bg-[var(--bg)] border-t border-[var(--border)] px-4 py-3">
          <div className="max-w-2xl mx-auto flex gap-2 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tell me what's happening..."
              rows={1}
              className="flex-1 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--fg)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none max-h-32 overflow-y-auto"
              style={{ lineHeight: "1.5" }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="p-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white transition disabled:opacity-50 shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-center text-xs text-[var(--muted)] mt-2">
            Not a therapist · Type "show helplines" anytime
          </p>
        </div>
      )}

      <HelplineBar />
    </div>
  );
}

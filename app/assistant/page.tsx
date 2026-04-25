'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { sendChatMessage, ChatMessage } from '@/lib/ai';
import { PageLoader, TypingDots } from '@/components/ui/LoadingSpinner';
import { Bot, Send, RotateCcw, Sparkles } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const SUGGESTIONS = [
  'How do I register to vote?',
  'What documents do I need on voting day?',
  'How do I check my name on the voter list?',
  'What is the process to vote in India?',
  'Can I vote if I lost my voter ID?',
  'What is NOTA and how does it work?',
];

export default function AssistantPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || thinking) return;
    setInput('');

    const userMsg: ChatMessage = { role: 'user', content: messageText };
    setMessages((prev) => [...prev, userMsg]);
    setThinking(true);

    try {
      const response = await sendChatMessage(messages, messageText);
      setMessages((prev) => [...prev, { role: 'model', content: response }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'model', content: '⚠️ Sorry, I couldn\'t get a response. Please check your internet connection or try again.' }]);
    } finally {
      setThinking(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setInput('');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col px-4 py-8">
        <div className="max-w-4xl mx-auto w-full flex flex-col flex-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-outfit font-bold text-3xl text-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                AI Election Assistant
              </h1>
              <p className="text-slate-400 text-sm mt-1 ml-14">Powered by Google Gemini • Ask anything about elections</p>
            </div>
            {messages.length > 0 && (
              <button onClick={clearChat} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors glass px-3 py-2 rounded-xl">
                <RotateCcw className="w-4 h-4" /> Clear
              </button>
            )}
          </div>

          {/* Chat area */}
          <div className="glass rounded-2xl flex-1 flex flex-col min-h-[500px] overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 scrollbar-thin">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 border border-violet-500/20 flex items-center justify-center mb-6">
                    <Sparkles className="w-10 h-10 text-violet-400" />
                  </div>
                  <h3 className="font-outfit font-bold text-xl text-white mb-2">How can I help you today?</h3>
                  <p className="text-slate-500 text-sm mb-8 max-w-sm">I&apos;m your AI-powered election guide. Ask me anything about voting, registration, or the election process.</p>
                  <div className="grid sm:grid-cols-2 gap-3 w-full max-w-lg">
                    {SUGGESTIONS.map((s) => (
                      <button key={s} onClick={() => sendMessage(s)} className="text-left text-sm glass px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:border-violet-500/30 transition-all duration-200 hover:-translate-y-0.5">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                  {msg.role === 'model' && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[75%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'chat-user text-white' : 'chat-ai text-slate-200'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {thinking && (
                <div className="flex justify-start animate-fade-in">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mr-3 flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="chat-ai">
                    <TypingDots />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-white/10 p-4">
              <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-3">
                <input
                  id="assistant-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about voting, registration, documents..."
                  className="input-field flex-1"
                  disabled={thinking}
                  autoComplete="off"
                />
                <button
                  id="assistant-send-btn"
                  type="submit"
                  disabled={!input.trim() || thinking}
                  className="btn-primary px-4 py-3 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

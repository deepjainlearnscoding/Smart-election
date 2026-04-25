'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { verifyInformation } from '@/lib/ai';
import { PageLoader, LoadingSpinner } from '@/components/ui/LoadingSpinner';
import Badge from '@/components/ui/Badge';
import {
  ShieldCheck, Send, Trash2, AlertTriangle,
  CheckCircle2, XCircle, HelpCircle, Clock, Sparkles,
} from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

interface VerifyResult {
  text: string;
  verdict: 'TRUE' | 'FALSE' | 'MISLEADING' | 'UNVERIFIABLE';
  explanation: string;
  confidence: number;
  checkedAt: string;
}

const EXAMPLES = [
  'The voting age in India has been reduced to 16 years.',
  'NOTA option is available on all EVMs in India.',
  'You need to carry your voter ID to vote — no Aadhaar allowed.',
  'EVM machines are connected to the internet during voting.',
];

const verdictConfig = {
  TRUE: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', label: 'This is TRUE' },
  FALSE: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', label: 'This is FALSE' },
  MISLEADING: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', label: 'This is MISLEADING' },
  UNVERIFIABLE: { icon: HelpCircle, color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20', label: 'Cannot be Verified' },
};

export default function MisinformationPage() {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [history, setHistory] = useState<VerifyResult[]>([]);

  const handleCheck = async () => {
    if (!text.trim() || checking) return;
    setChecking(true);
    setResult(null);
    try {
      const data = await verifyInformation(text.trim());
      const newResult: VerifyResult = {
        text: text.trim(),
        ...data,
        checkedAt: new Date().toLocaleTimeString('en-IN'),
      };
      setResult(newResult);
      setHistory((prev) => [newResult, ...prev.slice(0, 4)]);
    } catch {
      setResult({
        text: text.trim(),
        verdict: 'UNVERIFIABLE',
        explanation: 'Could not verify. Please ensure your Gemini API key is configured.',
        confidence: 0,
        checkedAt: new Date().toLocaleTimeString('en-IN'),
      });
    } finally {
      setChecking(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg shadow-pink-500/30 mb-6">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <p className="text-pink-400 text-sm font-medium uppercase tracking-widest mb-3">AI Fact Checker</p>
            <h1 className="font-outfit font-bold text-4xl sm:text-5xl text-white mb-4">Misinformation Checker</h1>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">Paste any election news, message, or rumor. Our AI will verify it instantly.</p>
          </div>

          {/* Input */}
          <div className="glass-strong rounded-3xl p-8 mb-8">
            <label htmlFor="misinfo-input" className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-400" />
              Paste message or headline to verify
            </label>
            <textarea
              id="misinfo-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. 'EVMs in India are hacked remotely...' or paste any WhatsApp forward"
              rows={4}
              className="input-field w-full resize-none mb-4 text-sm leading-relaxed"
            />

            {/* Example chips */}
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="text-xs text-slate-600">Try:</span>
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setText(ex)}
                  className="text-xs glass px-3 py-1.5 rounded-full text-slate-400 hover:text-white hover:border-pink-500/30 transition-all duration-200"
                >
                  {ex.slice(0, 40)}...
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                id="misinfo-check-btn"
                onClick={handleCheck}
                disabled={!text.trim() || checking}
                className="btn-primary flex-1 py-4 text-base disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {checking ? <LoadingSpinner className="w-5 h-5" /> : <Send className="w-5 h-5" />}
                {checking ? 'Verifying...' : 'Check Now'}
              </button>
              {text && (
                <button onClick={() => { setText(''); setResult(null); }} className="btn-secondary px-4">
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Result */}
          {result && (() => {
            const config = verdictConfig[result.verdict];
            const Icon = config.icon;
            return (
              <div className={`glass rounded-3xl p-8 mb-8 border ${config.bg} animate-scale-in`}>
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-14 h-14 rounded-2xl ${config.bg} border flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-7 h-7 ${config.color}`} />
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-1 uppercase tracking-wider">AI Verdict</p>
                    <h3 className={`font-outfit font-black text-2xl ${config.color}`}>{config.label}</h3>
                    <Badge variant={result.verdict.toLowerCase() as 'true' | 'false' | 'misleading' | 'unverifiable'} className="mt-2" />
                  </div>
                </div>

                <div className="glass rounded-xl p-5 mb-4">
                  <p className="text-sm font-medium text-slate-300 mb-2">Explanation</p>
                  <p className="text-sm text-slate-400 leading-relaxed">{result.explanation}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Checked at {result.checkedAt}</span>
                  <span className="flex items-center gap-1.5">
                    Confidence: <span className={`font-semibold ${result.confidence > 70 ? 'text-emerald-400' : result.confidence > 40 ? 'text-amber-400' : 'text-red-400'}`}>{result.confidence}%</span>
                  </span>
                </div>
              </div>
            );
          })()}

          {/* History */}
          {history.length > 1 && (
            <div>
              <h2 className="font-outfit font-bold text-xl text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-500" /> Recent Checks
              </h2>
              <div className="flex flex-col gap-3">
                {history.slice(1).map((item, i) => {
                  const cfg = verdictConfig[item.verdict];
                  const Ic = cfg.icon;
                  return (
                    <div key={i} className="glass rounded-xl p-4 flex items-center gap-4">
                      <Ic className={`w-5 h-5 ${cfg.color} flex-shrink-0`} />
                      <p className="text-sm text-slate-400 flex-1 truncate">{item.text}</p>
                      <Badge variant={item.verdict.toLowerCase() as 'true' | 'false' | 'misleading' | 'unverifiable'} className="flex-shrink-0" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

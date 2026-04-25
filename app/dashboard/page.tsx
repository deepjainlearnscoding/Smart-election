'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import {
  Bot, CalendarDays, MapPin, ShieldCheck, CheckCircle2,
  Circle, ArrowRight, User, Sparkles,
} from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const quickLinks = [
  { href: '/assistant', icon: Bot, label: 'AI Assistant', desc: 'Ask any election question', color: 'from-violet-500 to-purple-600' },
  { href: '/timeline', icon: CalendarDays, label: 'Timeline', desc: 'Track key dates', color: 'from-blue-500 to-cyan-600' },
  { href: '/map', icon: MapPin, label: 'Polling Info', desc: 'Find your booth', color: 'from-emerald-500 to-teal-600' },
  { href: '/misinformation', icon: ShieldCheck, label: 'Fact Check', desc: 'Verify news instantly', color: 'from-pink-500 to-rose-600' },
];

const nextSteps = [
  { label: 'Create your account', done: true },
  { label: 'Check your voter eligibility', done: true },
  { label: 'Register to vote (if not already)', done: false },
  { label: 'Locate your polling booth', done: false },
  { label: 'Prepare required documents', done: false },
  { label: 'Cast your vote on Election Day', done: false },
];

export default function DashboardPage() {
  const { user, profile } = useAuth();

  const firstName = profile?.name?.split(' ')[0] || 'Voter';
  const eligible = profile?.eligible ?? (profile?.age != null && profile.age >= 18);

  if (!user) return null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Banner */}
          <div className="relative glass-strong rounded-3xl p-8 mb-8 overflow-hidden">
            <div className="orb w-[300px] h-[300px] bg-violet-600 top-[-30%] right-[-10%] opacity-20" />
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-violet-400" />
                  <span className="text-violet-400 text-sm font-medium">Welcome back</span>
                </div>
                <h1 className="font-outfit font-bold text-3xl sm:text-4xl text-white mb-2">
                  Hello, {firstName}! 👋
                </h1>
                <p className="text-slate-400">Your personalized election guide is ready.</p>
              </div>
              <div className="flex flex-col items-start sm:items-end gap-2">
                <p className="text-slate-500 text-sm">Voting Status</p>
                <Badge
                  variant={eligible ? 'eligible' : 'ineligible'}
                  label={eligible ? 'Eligible to Vote' : 'Not Yet Eligible'}
                  className="text-sm px-4 py-1.5"
                />
                {profile?.age && (
                  <p className="text-slate-600 text-xs">Age: {profile.age} years</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Next Steps */}
            <div className="lg:col-span-2">
              <div className="glass rounded-2xl p-6 mb-6">
                <h2 className="font-outfit font-bold text-xl text-white mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-violet-400" />
                  Your Voting Checklist
                </h2>
                <div className="flex flex-col gap-3">
                  {nextSteps.map(({ label, done }) => (
                    <div key={label} className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${done ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-white/3 border border-white/5 hover:border-white/10'}`}>
                      {done
                        ? <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        : <Circle className="w-5 h-5 text-slate-600 flex-shrink-0" />
                      }
                      <span className={`text-sm font-medium ${done ? 'text-emerald-300 line-through opacity-60' : 'text-slate-300'}`}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Quick Links */}
            <div className="flex flex-col gap-4">
              <h2 className="font-outfit font-bold text-xl text-white flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-violet-400" />
                Quick Access
              </h2>
              {quickLinks.map(({ href, icon: Icon, label, desc, color }) => (
                <Link key={href} href={href} className="glass rounded-xl p-4 flex items-center gap-4 hover:-translate-y-1 hover:border-violet-500/30 transition-all duration-300 group">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{label}</p>
                    <p className="text-xs text-slate-500">{desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-violet-400 ml-auto transition-colors duration-300" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

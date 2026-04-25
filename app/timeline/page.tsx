'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getTimeUntil } from '@/lib/utils';
import {
  ClipboardList, BadgeCheck, Vote, Trophy,
  CheckCircle2, Clock, Lock, Radio, MapPin, 
  ChevronRight, Users, Activity
} from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const VOTING_DAY = new Date('2025-05-01T07:00:00+05:30');

const stages = [
  {
    id: 1,
    icon: ClipboardList,
    title: 'Voter Registration',
    description: 'Citizens register on the electoral roll. Ensure your name is on the voter list at your local election office or online via voters.eci.gov.in.',
    date: 'Jan 1 – Feb 28, 2025',
    status: 'completed' as const,
    color: 'from-emerald-500 to-teal-600',
    tip: 'Check your name: voters.eci.gov.in',
  },
  {
    id: 2,
    icon: BadgeCheck,
    title: 'Nominations & Verification',
    description: 'Political parties and independent candidates file nomination papers. Election Commission verifies candidate eligibility.',
    date: 'Mar 1 – Mar 20, 2025',
    status: 'completed' as const,
    color: 'from-blue-500 to-indigo-600',
    tip: 'Review candidate affidavits on ECI website',
  },
  {
    id: 3,
    icon: Vote,
    title: 'Campaign Period',
    description: 'Candidates campaign across constituencies. Model Code of Conduct is enforced. Last-day campaigning ends 48hrs before polling.',
    date: 'Mar 21 – Apr 28, 2025',
    status: 'active' as const,
    color: 'from-violet-500 to-purple-600',
    tip: 'Follow MCC rules — report violations to ECI',
  },
  {
    id: 4,
    icon: Trophy,
    title: 'Voting Day',
    description: 'Polling day. Bring your Voter ID or any approved photo ID. Voting hours: 7 AM – 6 PM. VVPAT machines ensure transparency.',
    date: 'May 1, 2025',
    status: 'upcoming' as const,
    color: 'from-pink-500 to-rose-600',
    tip: 'Bring: Voter ID / Aadhaar / Passport / Driving License',
  },
  {
    id: 5,
    icon: CheckCircle2,
    title: 'Results & New Government',
    description: 'Votes counted. Results announced. Winning party forms government. Full process overseen by Election Commission of India.',
    date: 'May 4, 2025',
    status: 'upcoming' as const,
    color: 'from-amber-500 to-orange-600',
    tip: 'Watch results live at results.eci.gov.in',
  },
];

const LIVE_ELECTIONS = [
  {
    id: 1,
    region: 'Delhi Municipal',
    phase: 'Phase 2',
    turnout: '42.8%',
    booths: '1,240 Active',
    status: 'Polling Live'
  },
  {
    id: 2,
    region: 'UP Bypolls',
    phase: 'Single Phase',
    turnout: '12.4%',
    booths: '450 Active',
    status: 'Early Voting'
  }
];

function CountdownTimer({ target }: { target: Date }) {
  const [time, setTime] = useState(getTimeUntil(target));

  useEffect(() => {
    const timer = setInterval(() => setTime(getTimeUntil(target)), 1000);
    return () => clearInterval(timer);
  }, [target]);

  const units = [
    { label: 'Days', value: time.days },
    { label: 'Hours', value: time.hours },
    { label: 'Minutes', value: time.minutes },
    { label: 'Seconds', value: time.seconds },
  ];

  return (
    <div className="flex items-center gap-4">
      {units.map(({ label, value }) => (
        <div key={label} className="text-center glass px-4 py-3 rounded-xl min-w-[72px]">
          <p className="font-outfit font-black text-2xl gradient-text">{String(value).padStart(2, '0')}</p>
          <p className="text-xs text-slate-500 mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  );
}

export default function TimelinePage() {
  const { user } = useAuth();

  const completedCount = stages.filter((s) => s.status === 'completed').length;
  const progressPct = Math.round((completedCount / stages.length) * 100);

  return (
    <ProtectedRoute>
      <div className="min-h-screen px-4 py-12 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-violet-400 text-sm font-medium uppercase tracking-widest mb-3">Election 2025</p>
            <h1 className="font-outfit font-bold text-4xl sm:text-5xl text-white mb-4">Election Timeline</h1>
            <p className="text-slate-400 text-lg">Track every phase of the democratic process</p>
          </div>

          {/* Live Status Section */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <h2 className="font-outfit font-bold text-xl text-white flex items-center gap-2">
                Live Election Status 
                <span className="text-[10px] bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-md uppercase tracking-wider">Live Now</span>
              </h2>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {LIVE_ELECTIONS.map((election) => (
                <div key={election.id} className="glass rounded-2xl p-5 border border-white/5 hover:border-rose-500/20 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-rose-500/10 transition-all" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-slate-400">
                        <MapPin className="w-4 h-4 text-rose-500" />
                        <span className="text-sm font-bold text-white uppercase">{election.region}</span>
                      </div>
                      <span className="text-[10px] font-black text-rose-400 uppercase tracking-tighter">{election.status}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex flex-col gap-1">
                        <p className="text-[10px] text-slate-500 flex items-center gap-1"><Activity className="w-3 h-3" /> Turnout</p>
                        <p className="text-lg font-outfit font-bold text-white">{election.turnout}</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-[10px] text-slate-500 flex items-center gap-1"><Users className="w-3 h-3" /> Progress</p>
                        <p className="text-lg font-outfit font-bold text-white">{election.phase}</p>
                      </div>
                    </div>

                    <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs text-slate-300 font-medium transition-all flex items-center justify-center gap-2 border border-white/5">
                      View Detailed Stats <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Countdown + Progress */}
          <div className="glass-strong rounded-3xl p-8 mb-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <p className="text-slate-400 text-sm mb-2 flex items-center gap-2"><Clock className="w-4 h-4" /> Time until Voting Day</p>
                <CountdownTimer target={VOTING_DAY} />
              </div>
              <div className="w-full md:w-64">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-violet-400 font-semibold">{progressPct}%</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full timeline-line rounded-full transition-all duration-1000"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <p className="text-xs text-slate-600 mt-2">{completedCount} of {stages.length} phases complete</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 timeline-line opacity-30 hidden sm:block" />

            <div className="flex flex-col gap-8">
              {stages.map(({ id, icon: Icon, title, description, date, status, color, tip }) => (
                <div key={id} className={`relative flex gap-6 animate-fade-in delay-${id * 100}`}>
                  {/* Node */}
                  <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg
                    ${status === 'upcoming' ? 'opacity-50' : ''}
                    ${status === 'active' ? 'animate-pulse-glow' : ''}
                  `}>
                    {status === 'upcoming' ? <Lock className="w-5 h-5 text-white" /> : <Icon className="w-5 h-5 text-white" />}
                  </div>

                  {/* Content */}
                  <div className={`flex-1 glass rounded-2xl p-6 border transition-all duration-300
                    ${status === 'active' ? 'border-violet-500/40 shadow-lg shadow-violet-500/10' : 'border-white/5'}
                    ${status === 'completed' ? 'opacity-75' : ''}
                    hover:-translate-y-1 hover:border-violet-500/20
                  `}>
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <h3 className="font-outfit font-bold text-lg text-white">{title}</h3>
                      <div className={`text-xs px-3 py-1 rounded-full font-medium border
                        ${status === 'completed' ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' : ''}
                        ${status === 'active' ? 'bg-violet-500/15 border-violet-500/30 text-violet-400' : ''}
                        ${status === 'upcoming' ? 'bg-slate-500/15 border-slate-500/30 text-slate-400' : ''}
                      `}>
                        {status === 'completed' ? '✅ Completed' : status === 'active' ? '🔴 In Progress' : '⏳ Upcoming'}
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed mb-4">{description}</p>
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5">
                      <span className="text-xs text-slate-500 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{date}</span>
                      <span className="text-xs text-violet-400 bg-violet-500/10 px-3 py-1 rounded-lg">💡 {tip}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

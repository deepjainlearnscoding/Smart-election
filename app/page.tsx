'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import {
  Bot,
  Map,
  CalendarCheck2,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Users,
  CheckCircle2,
  Star,
} from 'lucide-react';
import PublicRoute from '@/components/auth/PublicRoute';

const features = [
  {
    icon: Bot,
    title: 'AI Assistant',
    description: 'Ask anything about elections. Our AI gives simple, step-by-step answers in your language.',
    gradient: 'from-violet-500 to-purple-600',
    glow: 'hover:shadow-violet-500/20',
    href: '/assistant',
  },
  {
    icon: Map,
    title: 'Personalized Voting Guide',
    description: 'Enter your details and get a customized roadmap — from registration to casting your vote.',
    gradient: 'from-blue-500 to-cyan-600',
    glow: 'hover:shadow-blue-500/20',
    href: '/dashboard',
  },
  {
    icon: CalendarCheck2,
    title: 'Timeline Tracker',
    description: 'Track key election dates with live countdowns. Never miss a deadline again.',
    gradient: 'from-emerald-500 to-teal-600',
    glow: 'hover:shadow-emerald-500/20',
    href: '/timeline',
  },
  {
    icon: ShieldCheck,
    title: 'Misinformation Checker',
    description: 'Paste any news or rumor. Our AI verifies it instantly — protecting you from fake news.',
    gradient: 'from-pink-500 to-rose-600',
    glow: 'hover:shadow-pink-500/20',
    href: '/misinformation',
  },
];

const steps = [
  {
    number: '01',
    title: 'Sign Up',
    description: 'Create your account in 30 seconds with your email and basic details.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10 border-violet-500/20',
  },
  {
    number: '02',
    title: 'Enter Details',
    description: 'Tell us your age, location and we\'ll check your eligibility instantly.',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10 border-pink-500/20',
  },
  {
    number: '03',
    title: 'Get Your Roadmap',
    description: 'Receive a personalized election guide with steps, dates, and AI support.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
  },
];

const stats = [
  { value: '900M+', label: 'Eligible Voters', icon: Users },
  { value: '99.9%', label: 'Uptime', icon: CheckCircle2 },
  { value: '4.9★', label: 'User Rating', icon: Star },
];

export default function HomePage() {
  const { user } = useAuth();

  return (
    <PublicRoute>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
          {/* Background orbs */}
          <div className="orb w-[600px] h-[600px] bg-violet-600 top-[-10%] left-[-20%]" />
          <div className="orb w-[500px] h-[500px] bg-pink-600 bottom-[-10%] right-[-15%]" />
          <div className="orb w-[400px] h-[400px] bg-blue-600 top-[30%] right-[10%] opacity-10" />

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />

          <div className="relative z-10 max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-slate-300 mb-8 animate-fade-in">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              AI-Powered Election Assistant for India 🇮🇳
            </div>

            {/* Main Headline */}
            <h1 className="font-outfit font-bold text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-tight mb-6 animate-fade-in-up">
              Understand
              <br />
              <span className="gradient-text">Elections.</span>
              <br />
              Vote <span className="text-white/90">Smart.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 animate-fade-in-up delay-200">
              Your AI-powered guide to every step of the democratic process. Check eligibility, track timelines, find your polling booth, and bust misinformation — all in one place.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
              <Link href={user ? '/dashboard' : '/register'} id="hero-cta-get-started" className="btn-primary text-lg px-8 py-4 gap-2">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/login" id="hero-cta-signin" className="btn-secondary text-lg px-8 py-4">
                Sign In
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center justify-center gap-6 mt-12 animate-fade-in delay-500">
              {stats.map(({ value, label, icon: Icon }) => (
                <div key={label} className="text-center">
                  <p className="font-outfit font-bold text-xl gradient-text">{value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
            <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
              <div className="w-1 h-2 bg-violet-400 rounded-full animate-bounce" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-violet-400 font-medium text-sm uppercase tracking-widest mb-3">Features</p>
            <h2 className="font-outfit font-bold text-4xl sm:text-5xl text-white mb-4">
              Everything you need to
              <span className="gradient-text"> vote smart</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Four powerful tools built to make every citizen an informed voter.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, description, gradient, glow, href }) => (
              <Link
                key={title}
                href={href}
                className={`feature-card group flex flex-col gap-4 hover:shadow-2xl ${glow} transition-all duration-300`}
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-outfit font-bold text-lg text-white mb-2 group-hover:gradient-text transition-all duration-300">{title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
                </div>
                <div className="mt-auto flex items-center gap-1 text-sm text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Explore <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 px-4 relative overflow-hidden">
          <div className="orb w-[400px] h-[400px] bg-violet-600 left-[-10%] opacity-10" />

          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-pink-400 font-medium text-sm uppercase tracking-widest mb-3">How It Works</p>
              <h2 className="font-outfit font-bold text-4xl sm:text-5xl text-white">
                Your voting journey in
                <span className="gradient-text"> 3 steps</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-violet-500 via-pink-500 to-blue-500 opacity-30" />

              {steps.map(({ number, title, description, color, bg }) => (
                <div key={number} className="relative glass rounded-2xl p-8 text-center hover:-translate-y-2 transition-all duration-300">
                  <div className={`w-16 h-16 rounded-2xl ${bg} border flex items-center justify-center mx-auto mb-6`}>
                    <span className={`font-outfit font-black text-2xl ${color}`}>{number}</span>
                  </div>
                  <h3 className="font-outfit font-bold text-xl text-white mb-3">{title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href={user ? '/dashboard' : '/register'} className="btn-primary text-base px-8 py-4 inline-flex gap-2">
                Start Your Journey
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative glass-strong rounded-3xl p-12 text-center overflow-hidden">
              <div className="orb w-[300px] h-[300px] bg-violet-600 top-[-30%] right-[-10%] opacity-20" />
              <div className="orb w-[250px] h-[250px] bg-pink-600 bottom-[-30%] left-[-10%] opacity-20" />

              <div className="relative z-10">
                <h2 className="font-outfit font-black text-4xl sm:text-5xl text-white mb-4">
                  Ready to vote
                  <span className="gradient-text"> smart?</span>
                </h2>
                <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
                  Join millions of informed citizens. Create your free account and get your personalized election guide today.
                </p>
                <Link href={user ? '/dashboard' : '/register'} className="btn-primary text-lg px-10 py-4 inline-flex gap-2">
                  Get Started — It&apos;s Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-12 px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">SE</span>
              </div>
              <span className="font-outfit font-bold text-white">Smart Election Guide</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <Link href="/assistant" className="hover:text-white transition-colors">AI Assistant</Link>
              <Link href="/timeline" className="hover:text-white transition-colors">Timeline</Link>
              <Link href="/misinformation" className="hover:text-white transition-colors">Fact Check</Link>
            </div>
            <p className="text-slate-600 text-sm">© 2026 Smart Election Guide. Built for democracy.</p>
          </div>
        </footer>
      </div>
    </PublicRoute>
  );
}

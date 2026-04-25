'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Bot,
  CalendarDays,
  MapPin,
  ShieldCheck,
  Menu,
  X,
  Vote,
  LogOut,
  User,
  Mail,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/assistant', label: 'AI Assistant', icon: Bot },
  { href: '/timeline', label: 'Timeline', icon: CalendarDays },
  { href: '/map', label: 'Polling Info', icon: MapPin },
  { href: '/misinformation', label: 'Fact Check', icon: ShieldCheck },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, profile, signOut, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Filter links based on auth state (Requirement #6)
  const visibleLinks = navLinks.filter(({ href }) => {
    // Only show these links if logged in
    return user;
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'glass border-b border-white/10 shadow-lg shadow-black/20'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:shadow-violet-500/40 transition-all duration-300">
                <Vote className="w-5 h-5 text-white" />
              </div>
              <span className="font-outfit font-bold text-lg hidden sm:block">
                <span className="gradient-text">Smart Election</span>
                <span className="text-white/60 text-sm font-normal"> Guide</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {user && visibleLinks.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group',
                      isActive ? 'text-white' : 'text-slate-400 hover:text-white'
                    )}
                  >
                    {isActive && (
                      <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-violet-500/20 to-pink-500/10 border border-violet-500/30" />
                    )}
                    <Icon className={cn('w-4 h-4 transition-all duration-200', isActive ? 'text-violet-400' : 'text-slate-500 group-hover:text-violet-400')} />
                    <span className="relative">{label}</span>
                    {!isActive && (
                      <span className="absolute bottom-1 left-3 right-3 h-0.5 bg-gradient-to-r from-violet-500 to-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Auth Area */}
            <div className="hidden lg:flex items-center gap-3">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
              ) : user ? (
                <div className="flex items-center gap-3">
                  {/* Profile Link */}
                  <Link
                    href="/profile"
                    className={cn(
                      "flex items-center gap-2 glass px-3 py-1.5 rounded-xl hover:bg-white/10 transition-all duration-200",
                      pathname === '/profile' && "bg-white/10 border-violet-500/30"
                    )}
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-white/80 font-medium">
                      {profile?.name?.split(' ')[0] || 'User'}
                    </span>
                  </Link>

                  <button
                    id="navbar-signout-btn"
                    onClick={signOut}
                    className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-red-400 transition-colors duration-200 px-2 py-1.5 rounded-lg hover:bg-red-500/10"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    id="navbar-login-btn"
                    className="btn-secondary text-sm px-4 py-2"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    id="navbar-register-btn"
                    className="btn-primary text-sm px-4 py-2"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              id="navbar-mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg glass text-white/70 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute top-16 right-0 bottom-0 w-72 glass-strong border-l border-white/10 flex flex-col p-4 gap-2 animate-slide-in-right">
            {visibleLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-violet-500/20 to-pink-500/10 text-white border border-violet-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  <Icon className={cn('w-5 h-5', isActive ? 'text-violet-400' : 'text-slate-500')} />
                  {label}
                </Link>
              );
            })}

            <div className="mt-auto pt-4 border-t border-white/10">
              {user ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 px-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{profile?.name || 'User'}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={signOut}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all duration-200"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/login" className="btn-secondary text-center py-3 rounded-xl">
                    Sign In
                  </Link>
                  <Link href="/register" className="btn-primary text-center py-3 rounded-xl">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

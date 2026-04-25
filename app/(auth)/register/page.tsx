'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Mail, Lock, Eye, EyeOff, User, Vote, ArrowRight, Calendar } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import PublicRoute from '@/components/auth/PublicRoute';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', age: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setGlobalError('');
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim() || form.name.trim().length < 2) newErrors.name = 'Please enter your full name (min 2 chars)';
    const age = parseInt(form.age);
    if (!form.age || isNaN(age)) newErrors.age = 'Please enter your age';
    else if (age < 18) newErrors.age = 'You must be 18 or older to register';
    else if (age > 120) newErrors.age = 'Please enter a valid age';
    if (!form.email.includes('@')) newErrors.email = 'Please enter a valid email';
    if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: form.name.trim(),
        age: parseInt(form.age),
        email: form.email,
        eligible: parseInt(form.age) >= 18,
        createdAt: new Date().toISOString(),
        progress: 0,
      });
      router.push('/dashboard');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === 'auth/email-already-in-use') setGlobalError('This email is already registered. Try signing in.');
      else if (code === 'auth/invalid-email') setGlobalError('Invalid email address.');
      else if (code === 'auth/weak-password') setGlobalError('Password is too weak. Use at least 6 characters.');
      else setGlobalError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicRoute>
      <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
        <div className="orb w-[500px] h-[500px] bg-violet-600 top-[-10%] right-[-20%]" />
        <div className="orb w-[400px] h-[400px] bg-blue-600 bottom-[-20%] left-[-15%]" />

        <div className="w-full max-w-md relative z-10 animate-scale-in">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 shadow-lg shadow-violet-500/30 mb-4">
              <Vote className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-outfit font-bold text-3xl text-white">Create your account</h1>
            <p className="text-slate-400 text-sm mt-2">Join the Smart Election Guide community</p>
          </div>

          <div className="glass-strong rounded-3xl p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5" id="register-form">
              <Input
                id="register-name"
                name="name"
                type="text"
                label="Full Name"
                placeholder="Rahul Sharma"
                value={form.name}
                onChange={handleChange}
                icon={<User className="w-4 h-4" />}
                error={errors.name}
                required
              />
              <Input
                id="register-age"
                name="age"
                type="number"
                label="Age"
                placeholder="25"
                value={form.age}
                onChange={handleChange}
                icon={<Calendar className="w-4 h-4" />}
                error={errors.age}
                min="1"
                max="120"
                required
              />
              <Input
                id="register-email"
                name="email"
                type="email"
                label="Email Address"
                placeholder="you@gmail.com"
                value={form.email}
                onChange={handleChange}
                icon={<Mail className="w-4 h-4" />}
                error={errors.email}
                required
              />
              <div className="flex flex-col gap-1.5">
                <label htmlFor="register-password" className="text-sm font-medium text-slate-300">Password</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"><Lock className="w-4 h-4" /></div>
                  <input
                    id="register-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimum 6 characters"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-500/60' : ''}`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors" aria-label="Toggle password">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
              </div>

              {/* Age eligibility notice */}
              <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl px-4 py-3 text-sm text-violet-300">
                🗳️ You must be <strong>18 years or older</strong> to vote in India
              </div>

              {globalError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">{globalError}</div>
              )}

              <Button id="register-submit-btn" type="submit" variant="primary" size="lg" loading={loading} className="w-full">
                {!loading && <ArrowRight className="w-5 h-5" />}
                Create Account
              </Button>
            </form>
            <p className="text-slate-500 text-sm text-center mt-6">
              Already have an account?{' '}
              <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </PublicRoute>
  );
}

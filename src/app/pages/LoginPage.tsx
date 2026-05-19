import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, Zap, Shield, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuthStore } from '../store/authStore';
import { toast } from 'sonner';

const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  delay: Math.random() * 5,
  duration: Math.random() * 10 + 10,
}));

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        toast.success('Welcome back! Redirecting...', { icon: '🚀' });
      } else {
        toast.error('Invalid credentials. Please try again.');
      }
    } catch {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#060816]">
      {/* Ambient Orbs */}
      <div className="orb orb-blue" />
      <div className="orb orb-purple" />
      <div className="orb orb-cyan" />

      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid opacity-60" />

      {/* Floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-blue-400/30"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md px-4"
      >
        {/* Logo & Brand */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.25, type: 'spring', stiffness: 200 }}
          className="text-center mb-8"
        >
          <div className="relative inline-block mb-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-2xl"
              style={{
                background: 'conic-gradient(from 0deg, #3b82f6, #06b6d4, #8b5cf6, #3b82f6)',
                padding: '1.5px',
                borderRadius: '18px',
              }}
            />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0b1120] border border-white/10">
              <Zap className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white mb-1">
            <span className="gradient-text">AskTechSolutions</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium tracking-wider uppercase">
            Admin Control Panel
          </p>
        </motion.div>

        {/* Glass card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.25 }}
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06) inset',
          }}
        >
          {/* Top accent line */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />

          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">Sign In</h2>
              <p className="text-slate-400 text-sm mt-1">Enter your credentials to access the dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 }}
                className="space-y-1.5"
              >
                <Label htmlFor="email" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">
                  Email Address
                </Label>
                <div
                  className="relative rounded-xl overflow-hidden transition-all duration-300"
                  style={{
                    boxShadow: focused === 'email'
                      ? '0 0 0 1px rgba(59,130,246,0.6), 0 0 20px rgba(59,130,246,0.15)'
                      : '0 0 0 1px rgba(255,255,255,0.08)',
                  }}
                >
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@asktechsolutions.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                    required
                    className="h-12 bg-white/5 border-0 text-white placeholder:text-slate-500 rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0 px-4"
                  />
                </div>
              </motion.div>

              {/* Password field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.52 }}
                className="space-y-1.5"
              >
                <Label htmlFor="password" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">
                  Password
                </Label>
                <div
                  className="relative rounded-xl overflow-hidden transition-all duration-300"
                  style={{
                    boxShadow: focused === 'password'
                      ? '0 0 0 1px rgba(59,130,246,0.6), 0 0 20px rgba(59,130,246,0.15)'
                      : '0 0 0 1px rgba(255,255,255,0.08)',
                  }}
                >
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused(null)}
                    required
                    className="h-12 bg-white/5 border-0 text-white placeholder:text-slate-500 rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0 px-4 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </motion.div>

              {/* Submit button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(59,130,246,0.5)' }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-12 rounded-xl font-semibold text-white relative overflow-hidden flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    boxShadow: '0 0 20px rgba(59,130,246,0.35)',
                  }}
                >
                  {isLoading ? (
                    <motion.div
                      className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.25, repeat: Infinity, ease: 'linear' }}
                    />
                  ) : (
                    <>
                      Sign In <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full"
                    animate={{ translateX: ['−100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  />
                </motion.button>
              </motion.div>
            </form>

            {/* Demo hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 }}
              className="mt-6 flex items-center gap-2 justify-center text-center"
            >
              <Shield className="h-3.5 w-3.5 text-emerald-400" />
              <p className="text-xs text-slate-500">
                Demo: Use any email & password to login
              </p>
            </motion.div>
          </div>

          {/* Bottom accent line */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center text-xs text-slate-600 mt-6"
        >
          © 2026 AskTechSolutions. All rights reserved.
        </motion.p>
      </motion.div>
    </div>
  );
}

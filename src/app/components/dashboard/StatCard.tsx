import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../ui/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: { value: number; isPositive: boolean };
  className?: string;
  color?: 'blue' | 'cyan' | 'purple' | 'emerald' | 'amber' | 'rose';
  delay?: number;
}

const colorMap = {
  blue:    { icon: 'text-blue-400',    bg: 'bg-blue-500/10',    glow: 'rgba(59,130,246,0.3)',   border: 'rgba(59,130,246,0.25)' },
  cyan:    { icon: 'text-cyan-400',    bg: 'bg-cyan-500/10',    glow: 'rgba(6,182,212,0.3)',    border: 'rgba(6,182,212,0.25)' },
  purple:  { icon: 'text-purple-400',  bg: 'bg-purple-500/10',  glow: 'rgba(139,92,246,0.3)',   border: 'rgba(139,92,246,0.25)' },
  emerald: { icon: 'text-emerald-400', bg: 'bg-emerald-500/10', glow: 'rgba(16,185,129,0.3)',   border: 'rgba(16,185,129,0.25)' },
  amber:   { icon: 'text-amber-400',   bg: 'bg-amber-500/10',   glow: 'rgba(245,158,11,0.3)',   border: 'rgba(245,158,11,0.25)' },
  rose:    { icon: 'text-rose-400',    bg: 'bg-rose-500/10',    glow: 'rgba(244,63,94,0.3)',    border: 'rgba(244,63,94,0.25)' },
};

function useCountUp(target: number, duration = 1200, delay = 0) {
  const [count, setCount] = useState(0);
  const raf = useRef<number>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(eased * target));
        if (progress < 1) raf.current = requestAnimationFrame(tick);
        else setCount(target);
      };
      raf.current = requestAnimationFrame(tick);
    }, delay);

    return () => { clearTimeout(timer); if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, duration, delay]);

  return count;
}

export function StatCard({
  title, value, description, icon: Icon, trend,
  className, color = 'blue', delay = 0,
}: StatCardProps) {
  const [hovered, setHovered] = useState(false);
  const c = colorMap[color];

  const numericValue = typeof value === 'string'
    ? parseFloat(value.replace(/[^0-9.]/g, '')) || 0
    : value;
  const isNumeric = typeof value === 'number' || /^[\d,.$]+$/.test(String(value));
  const prefix = typeof value === 'string' ? value.replace(/[\d,.]+/, '') : '';
  const animatedCount = useCountUp(numericValue, 1200, delay * 1000 + 300);

  const displayValue = isNumeric
    ? `${prefix}${animatedCount.toLocaleString()}`
    : value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, }}
      animate={{ opacity: 1, y: 0, }}
      transition={{ duration: 0.25, delay, ease: 'easeOut' }}
      whileHover={{ y: -6, scale: 1.02 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className={cn('relative group cursor-default', className)}
    >
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          boxShadow: `0 0 40px ${c.glow}`,
          borderRadius: '1rem',
        }}
      />

      {/* Animated gradient border */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: `linear-gradient(135deg, ${c.border}, transparent, ${c.border})`,
          padding: '1px',
          borderRadius: '1rem',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Card body */}
      <div
        className="relative rounded-2xl p-5 h-full glass-card overflow-hidden"
        style={{ border: `1px solid ${hovered ? c.border : 'var(--border)'}`, transition: 'border-color 0.3s' }}
      >
        {/* Subtle top light reflection */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{title}</p>
            <motion.p
              className="text-3xl font-bold text-foreground"
              key={displayValue}
            >
              {displayValue}
            </motion.p>
          </div>

          <motion.div
            animate={{ scale: hovered ? 1.1 : 1, rotate: hovered ? 5 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={cn('p-2.5 rounded-xl', c.bg)}
          >
            <Icon className={cn('h-5 w-5', c.icon)} />
          </motion.div>
        </div>

        {description && (
          <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        )}

        {trend && (
          <div className="flex items-center gap-1.5 mt-3">
            <div className={cn(
              'flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold',
              trend.isPositive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
            )}>
              {trend.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
            </div>
            <span className="text-xs text-muted-foreground">vs last month</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

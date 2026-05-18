import { Bell, LogOut, Menu, Settings, User, Search, Zap, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { useDashboardStore } from '../../store/dashboardStore';
import { useAuthStore } from '../../store/authStore';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeToggle } from './ThemeToggle';
import { toast } from 'sonner';

export function Navbar() {
  const { mode, setMode, toggleSidebar } = useDashboardStore();
  const { user, logout } = useAuthStore();

  return (
    <div className="sticky top-0 z-50 w-full px-3 pt-3 pb-2">
      <motion.nav
        initial={{ y: -30, opacity: 0, filter: 'blur(10px)' }}
        animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex items-center justify-between h-14 px-4 mx-auto max-w-[1920px] rounded-2xl relative overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05) inset',
        }}
      >
        {/* Top shimmer line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

        {/* ─── Left: Menu + Logo + Brand ─── */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="lg:hidden h-9 w-9 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground transition-colors"
            style={{ background: 'rgba(255,255,255,0.06)' }}
            onClick={toggleSidebar}
          >
            <Menu className="h-4 w-4" />
          </motion.button>

          <div className="flex items-center gap-2.5">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="h-9 w-9 rounded-xl flex items-center justify-center relative overflow-hidden shrink-0"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                boxShadow: '0 0 15px rgba(59,130,246,0.4)',
              }}
            >
              <img
                src="/logo.png"
                alt="AST"
                className="h-full w-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <Zap className="h-4 w-4 text-white absolute" />
            </motion.div>

            {/* Brand text */}
            <div className="hidden md:block border-r border-white/10 pr-3">
              <p className="text-sm font-bold text-foreground leading-none">AskTechSolutions</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-widest">Admin Panel</p>
            </div>
          </div>

          {/* Welcome greeting */}
          <div className="hidden lg:flex flex-col pl-1">
            <p className="text-sm font-semibold text-foreground leading-none">
              Welcome back, <span className="text-blue-400">{user?.name?.split(' ')[0] || 'Admin'}</span>
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Manage your business operations</p>
          </div>
        </div>

        {/* ─── Right: Controls ─── */}
        <div className="flex items-center gap-2">
          {/* Mode toggle */}
          <div
            className="hidden sm:flex items-center gap-1 p-1 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {(['website', 'application'] as const).map((m) => (
              <motion.button
                key={m}
                onClick={() => setMode(m)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors"
                style={{ color: mode === m ? '#ffffff' : 'var(--muted-foreground)' }}
              >
                {mode === m && (
                  <motion.div
                    layoutId="mode-pill"
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      boxShadow: '0 0 15px rgba(59,130,246,0.4)',
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{m}</span>
              </motion.button>
            ))}
          </div>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Search */}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(59,130,246,0.3)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toast.info('Global Search', { description: 'Search will be wired to the backend API.' })}
            className="h-9 w-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <Search className="h-4 w-4" />
          </motion.button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="h-9 w-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground relative transition-colors"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
                  3
                </span>
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 rounded-2xl p-2"
              style={{
                background: 'rgba(11,17,32,0.97)',
                backdropFilter: 'blur(30px)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
              }}
            >
              <DropdownMenuLabel className="font-bold text-sm px-2 py-1.5 text-foreground flex items-center justify-between">
                Notifications
                <span className="text-[10px] text-blue-400 font-medium">3 new</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/06" />
              {[
                { title: 'New employee registered', time: '2 minutes ago', dot: 'bg-blue-500' },
                { title: 'Leave request pending', time: '1 hour ago', dot: 'bg-amber-500' },
                { title: 'Project milestone completed', time: '3 hours ago', dot: 'bg-emerald-500' },
              ].map((n, i) => (
                <DropdownMenuItem key={i} className="rounded-xl p-3 cursor-pointer gap-3 hover:bg-white/05">
                  <div className={`h-2 w-2 rounded-full ${n.dot} shrink-0 mt-1`} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl cursor-pointer transition-all"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <Avatar className="h-7 w-7 rounded-lg">
                  <AvatarFallback
                    className="rounded-lg text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
                  >
                    {user?.name?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden xl:flex flex-col">
                  <span className="text-xs font-semibold text-foreground leading-none">{user?.name || 'Admin'}</span>
                  <span className="text-[10px] text-muted-foreground mt-0.5 truncate max-w-[100px]">{user?.email || 'admin@ast.com'}</span>
                </div>
                <ChevronDown className="h-3 w-3 text-muted-foreground hidden xl:block" />
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-52 rounded-2xl p-2"
              style={{
                background: 'rgba(11,17,32,0.97)',
                backdropFilter: 'blur(30px)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
              }}
            >
              <DropdownMenuLabel className="p-2 pb-3">
                <p className="text-sm font-bold text-foreground">{user?.name || 'Admin User'}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{user?.email || 'admin@asktech.com'}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/06" />
              <DropdownMenuItem className="rounded-xl p-2.5 cursor-pointer gap-2.5 hover:bg-white/05">
                <User className="h-4 w-4 text-blue-400" /> <span className="text-sm">Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl p-2.5 cursor-pointer gap-2.5 hover:bg-white/05">
                <Settings className="h-4 w-4 text-purple-400" /> <span className="text-sm">Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/06" />
              <DropdownMenuItem
                onClick={logout}
                className="rounded-xl p-2.5 cursor-pointer gap-2.5 hover:bg-rose-500/10 text-rose-400"
              >
                <LogOut className="h-4 w-4" /> <span className="text-sm font-medium">Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Bottom glow line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
      </motion.nav>

      {/* Mobile mode tabs */}
      <div className="sm:hidden flex gap-2 mt-2 px-1">
        {(['website', 'application'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className="flex-1 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all"
            style={{
              background: mode === m
                ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                : 'rgba(255,255,255,0.05)',
              color: mode === m ? '#fff' : 'var(--muted-foreground)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: mode === m ? '0 0 15px rgba(59,130,246,0.35)' : 'none',
            }}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}

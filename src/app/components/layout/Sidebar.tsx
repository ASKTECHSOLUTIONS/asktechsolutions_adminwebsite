import { motion, AnimatePresence } from 'motion/react';
import {
  Users, Calendar, FileText, BarChart3, Settings, Briefcase,
  FolderKanban, GraduationCap, CreditCard, Video, Bell,
  TrendingUp, X, Clock, LayoutDashboard, Building2, ChevronRight, Zap,
} from 'lucide-react';
import { useDashboardStore } from '../../store/dashboardStore';
import { cn } from '../ui/utils';
import { ScrollArea } from '../ui/scroll-area';

interface NavItem {
  title: string;
  icon: any;
  href: string;
  badge?: string;
  group?: string;
  color?: string;
}

const websiteNavItems: NavItem[] = [
  { title: 'Dashboard',          icon: LayoutDashboard, href: '/',           group: 'Overview', color: '#3b82f6' },
  { title: 'Employees',          icon: Users,           href: '/employees',  group: 'HR',       color: '#06b6d4' },
  { title: 'Attendance',         icon: Clock,           href: '/attendance', group: 'HR',       color: '#8b5cf6' },
  { title: 'Leave Management',   icon: Calendar,        href: '/leaves',     group: 'HR',       color: '#10b981' },
  { title: 'Reports',            icon: BarChart3,        href: '/reports',    group: 'Insights', color: '#f59e0b' },
  { title: 'Settings',           icon: Settings,         href: '/settings',   group: 'System',   color: '#94a3b8' },
];

const applicationNavItems: NavItem[] = [
  { title: 'Dashboard',         icon: LayoutDashboard, href: '/',              group: 'Overview', color: '#3b82f6' },
  { title: 'Clients',           icon: Briefcase,       href: '/clients',      badge: '6', group: 'Business', color: '#06b6d4' },
  { title: 'Projects',          icon: FolderKanban,    href: '/projects',     badge: '5', group: 'Business', color: '#8b5cf6' },
  { title: 'Meetings',          icon: Video,           href: '/meetings',              group: 'Operations', color: '#10b981' },
  { title: 'Internships',       icon: GraduationCap,   href: '/internships',           group: 'Operations', color: '#f59e0b' },
  { title: 'Payments',          icon: CreditCard,      href: '/payments',              group: 'Finance',    color: '#06b6d4' },
  { title: 'Notifications',     icon: Bell,            href: '/notifications', badge: '3', group: 'System', color: '#f43f5e' },
  { title: 'Analytics',         icon: TrendingUp,      href: '/analytics',             group: 'Insights',  color: '#f59e0b' },
  { title: 'Settings',          icon: Settings,        href: '/app-settings',          group: 'System',    color: '#94a3b8' },
];

interface SidebarProps {
  onNavigate?: (path: string) => void;
  currentPath?: string;
}

export function Sidebar({ onNavigate, currentPath = '/' }: SidebarProps) {
  const { mode, sidebarCollapsed, setSidebarCollapsed } = useDashboardStore();
  const navItems = mode === 'website' ? websiteNavItems : applicationNavItems;
  const groups = navItems.reduce((acc, item) => {
    const g = item.group || 'General';
    if (!acc[g]) acc[g] = [];
    acc[g].push(item);
    return acc;
  }, {} as Record<string, NavItem[]>);

  const handleNavigation = (href: string) => {
    if (window.innerWidth < 1024) setSidebarCollapsed(true);
    onNavigate?.(href);
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden bg-slate-950/40 dark:bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarCollapsed(true)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: sidebarCollapsed ? '-100%' : 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        className={cn(
          'fixed left-0 top-0 z-40 h-screen w-64 pt-3 pb-4 flex flex-col',
          'lg:sticky lg:top-0 lg:!transform-none'
        )}
        style={{
          background: 'var(--sidebar)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          borderRight: '1px solid var(--sidebar-border)',
        }}
      >
        {/* Top glow line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

        {/* Mobile close + header */}
        <div className="flex items-center justify-between px-4 mb-4 lg:hidden">
          <div className="flex items-center gap-2.5">
            <div
              className="h-8 w-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', boxShadow: '0 0 15px rgba(59,130,246,0.4)' }}
            >
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold text-foreground">AskTechSolutions</span>
          </div>
          <button
            onClick={() => setSidebarCollapsed(true)}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors bg-muted/40 hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Mode label */}
        <div className="px-4 mb-4 hidden lg:block">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400"
          >
            <Building2 className="h-3.5 w-3.5" />
            <span className="text-xs font-semibold uppercase tracking-widest">
              {mode === 'website' ? 'HR & Operations' : 'Business Control'}
            </span>
          </motion.div>
        </div>

        <ScrollArea className="flex-1 h-[calc(100vh-10rem)] px-3">
          <motion.nav
            key={mode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            {Object.entries(groups).map(([groupName, items], gi) => (
              <motion.div
                key={groupName}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: gi * 0.06 }}
              >
                <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-bold px-3 mb-2 flex items-center gap-1.5">
                  <span className="h-px flex-1" style={{ background: 'var(--sidebar-border)' }} />
                  {groupName}
                  <span className="h-px flex-1" style={{ background: 'var(--sidebar-border)' }} />
                </p>

                <div className="space-y-0.5">
                  {items.map((item, idx) => {
                    const isActive = currentPath === item.href;
                    return (
                      <motion.button
                        key={item.href}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: gi * 0.06 + idx * 0.04 }}
                        whileHover={{ x: 3 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleNavigation(item.href)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left relative overflow-hidden group transition-all"
                        style={{
                          background: isActive ? `${item.color}18` : 'transparent',
                          border: isActive ? `1px solid ${item.color}30` : '1px solid transparent',
                        }}
                      >
                        {/* Active glow */}
                        {isActive && (
                          <motion.div
                            layoutId="sidebar-active"
                            className="absolute inset-0 rounded-xl"
                            style={{ boxShadow: `0 0 15px ${item.color}20`, background: `${item.color}08` }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          />
                        )}

                        {/* Left indicator */}
                        {isActive && (
                          <div
                            className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full"
                            style={{ background: item.color, boxShadow: `0 0 8px ${item.color}` }}
                          />
                        )}

                        {/* Icon */}
                        <motion.div
                          animate={{ scale: isActive ? 1.05 : 1 }}
                          className="relative z-10 shrink-0"
                        >
                          <item.icon
                            className="h-4 w-4 transition-all"
                            style={{ color: isActive ? item.color : 'var(--muted-foreground)' }}
                          />
                        </motion.div>

                        {/* Label */}
                        <span
                          className="relative z-10 text-sm font-medium flex-1 transition-colors"
                          style={{ color: isActive ? 'var(--foreground)' : 'var(--muted-foreground)' }}
                        >
                          {item.title}
                        </span>

                        {/* Badge */}
                        {item.badge && !isActive && (
                          <span
                            className="relative z-10 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                            style={{ background: `${item.color}20`, color: item.color }}
                          >
                            {item.badge}
                          </span>
                        )}

                        {/* Active chevron */}
                        {isActive && (
                          <ChevronRight
                            className="h-3 w-3 relative z-10 shrink-0"
                            style={{ color: item.color }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </motion.nav>
        </ScrollArea>

        {/* Footer status */}
        <div className="px-4 pt-3" style={{ borderTop: '1px solid var(--sidebar-border)' }}>
          <div className="flex items-center gap-2">
            <div className="relative h-2 w-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
              <div className="absolute inset-0 h-2 w-2 rounded-full bg-emerald-400 animate-ping opacity-50" />
            </div>
            <span className="text-xs text-muted-foreground">All systems operational</span>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

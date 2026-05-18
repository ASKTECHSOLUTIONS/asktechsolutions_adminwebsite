import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  Briefcase,
  FolderKanban,
  GraduationCap,
  CreditCard,
  Video,
  Bell,
  TrendingUp,
  X,
  Clock,
  LayoutDashboard,
  Building2,
  ChevronRight,
} from 'lucide-react';
import { useDashboardStore } from '../../store/dashboardStore';
import { cn } from '../ui/utils';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';

interface NavItem {
  title: string;
  icon: any;
  href: string;
  badge?: string;
  group?: string;
}

const websiteNavItems: NavItem[] = [
  { title: 'Dashboard', icon: LayoutDashboard, href: '/', group: 'Overview' },
  { title: 'Employee Management', icon: Users, href: '/employees', group: 'HR' },
  { title: 'Attendance', icon: Clock, href: '/attendance', group: 'HR' },
  { title: 'Leave Management', icon: Calendar, href: '/leaves', group: 'HR' },
  { title: 'Reports & Analytics', icon: BarChart3, href: '/reports', group: 'Reports' },
  { title: 'Settings', icon: Settings, href: '/settings', group: 'System' },
];

const applicationNavItems: NavItem[] = [
  { title: 'Dashboard', icon: LayoutDashboard, href: '/', group: 'Overview' },
  { title: 'Client Management', icon: Briefcase, href: '/clients', badge: '6', group: 'Business' },
  { title: 'Projects', icon: FolderKanban, href: '/projects', badge: '5', group: 'Business' },
  { title: 'Meetings', icon: Video, href: '/meetings', group: 'Operations' },
  { title: 'Internship Management', icon: GraduationCap, href: '/internships', group: 'Operations' },
  { title: 'Payments', icon: CreditCard, href: '/payments', group: 'Finance' },
  { title: 'Notifications', icon: Bell, href: '/notifications', badge: '3', group: 'System' },
  { title: 'Analytics', icon: TrendingUp, href: '/analytics', group: 'Reports' },
  { title: 'Settings', icon: Settings, href: '/app-settings', group: 'System' },
];

interface SidebarProps {
  onNavigate?: (path: string) => void;
  currentPath?: string;
}

export function Sidebar({ onNavigate, currentPath = '/' }: SidebarProps) {
  const { mode, sidebarCollapsed, setSidebarCollapsed } = useDashboardStore();

  const navItems = mode === 'website' ? websiteNavItems : applicationNavItems;

  // Group items
  const groups = navItems.reduce((acc, item) => {
    const group = item.group || 'General';
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {} as Record<string, NavItem[]>);

  const handleNavigation = (href: string) => {
    if (window.innerWidth < 1024) {
      setSidebarCollapsed(true);
    }
    if (onNavigate) {
      onNavigate(href);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarCollapsed(true)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          x: sidebarCollapsed ? '-100%' : 0,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className={cn(
          'fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r border-border bg-card',
          'lg:sticky lg:top-16 lg:!transform-none'
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4 lg:hidden">
            <h2 className="text-lg font-semibold">
              {mode === 'website' ? 'Website Admin' : 'Application Admin'}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(true)}
              className="rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="hidden lg:block p-4">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold text-foreground">
                {mode === 'website' ? 'Website Admin' : 'Application Admin'}
              </h2>
            </div>
            <p className="text-xs text-muted-foreground pl-6">
              {mode === 'website' ? 'Manage website operations' : 'Manage client applications'}
            </p>
          </div>

          <Separator />

          <ScrollArea className="flex-1 px-3 py-3">
            <motion.nav
              key={mode}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {Object.entries(groups).map(([groupName, items]) => (
                <div key={groupName}>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold px-3 mb-1.5">
                    {groupName}
                  </p>
                  <div className="space-y-0.5">
                    {items.map((item) => {
                      const isActive = currentPath === item.href;
                      return (
                        <motion.button
                          key={item.href}
                          whileHover={{ x: 2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleNavigation(item.href)}
                          className={cn(
                            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group',
                            isActive
                              ? 'bg-primary text-primary-foreground shadow-sm'
                              : 'hover:bg-accent text-foreground'
                          )}
                        >
                          <item.icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground')} />
                          <span className="flex-1 text-sm font-medium">{item.title}</span>
                          {item.badge && !isActive && (
                            <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground font-bold">
                              {item.badge}
                            </span>
                          )}
                          {isActive && (
                            <ChevronRight className="h-3.5 w-3.5 text-primary-foreground opacity-70" />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </motion.nav>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>System Status: Online</span>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

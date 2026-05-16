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
}

const websiteNavItems: NavItem[] = [
  { title: 'Employee Management', icon: Users, href: '/employees' },
  { title: 'Attendance', icon: Clock, href: '/attendance' },
  { title: 'Leave Management', icon: Calendar, href: '/leaves' },
  { title: 'Website Content', icon: FileText, href: '/content' },
  { title: 'Reports & Analytics', icon: BarChart3, href: '/reports' },
  { title: 'Settings', icon: Settings, href: '/settings' },
];

const applicationNavItems: NavItem[] = [
  { title: 'Client Management', icon: Briefcase, href: '/clients', badge: '12' },
  { title: 'Projects', icon: FolderKanban, href: '/projects', badge: '8' },
  { title: 'Internship Management', icon: GraduationCap, href: '/internships' },
  { title: 'Payments', icon: CreditCard, href: '/payments' },
  { title: 'Meetings', icon: Video, href: '/meetings' },
  { title: 'Notifications', icon: Bell, href: '/notifications', badge: '5' },
  { title: 'Analytics', icon: TrendingUp, href: '/analytics' },
  { title: 'Settings', icon: Settings, href: '/app-settings' },
];

interface SidebarProps {
  onNavigate?: (path: string) => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const { mode, sidebarCollapsed, setSidebarCollapsed } = useDashboardStore();

  const navItems = mode === 'website' ? websiteNavItems : applicationNavItems;

  const handleNavigation = (href: string) => {
    setSidebarCollapsed(true);
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
          'lg:sticky lg:top-16 lg:translate-x-0'
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
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="hidden lg:block p-4">
            <h2 className="text-lg font-semibold">
              {mode === 'website' ? 'Website Admin' : 'Application Admin'}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              {mode === 'website' ? 'Manage website operations' : 'Manage client applications'}
            </p>
          </div>

          <Separator />

          <ScrollArea className="flex-1 px-3 py-4">
            <motion.nav
              key={mode}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-1"
            >
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  className="w-full justify-start gap-3 text-left hover:bg-accent"
                  onClick={() => handleNavigation(item.href)}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span className="flex-1">{item.title}</span>
                  {item.badge && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                      {item.badge}
                    </span>
                  )}
                </Button>
              ))}
            </motion.nav>
          </ScrollArea>
        </div>
      </motion.aside>
    </>
  );
}

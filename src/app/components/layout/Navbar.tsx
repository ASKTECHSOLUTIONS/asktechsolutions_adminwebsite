import { Bell, LogOut, Menu, Settings, User, Search } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { useDashboardStore } from '../../store/dashboardStore';
import { useAuthStore } from '../../store/authStore';
import { motion } from 'motion/react';
import { ThemeToggle } from './ThemeToggle';
import { toast } from 'sonner';

export function Navbar() {
  const { mode, setMode, toggleSidebar } = useDashboardStore();
  const { user, logout } = useAuthStore();

  return (
    <div className="sticky top-0 z-50 w-full px-4 pt-3 pb-2 bg-background/80 backdrop-blur-md">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between h-16 px-4 mx-auto border border-border/80 bg-card/90 backdrop-blur-md shadow-sm rounded-[32px] max-w-[1920px]"
      >
        {/* Left Section: Mobile Menu + Circular Logo + Brand Name */}
        <div className="flex items-center gap-3 md:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden rounded-full hover:bg-accent"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-3">
            {/* Circular Logo exactly as requested */}
            <div className="flex h-11 w-11 items-center justify-center rounded-full overflow-hidden border border-border/80 bg-background shadow-inner shrink-0">
              <img
                src="/logo.png"
                alt="AskTechSolutions Logo"
                className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  // Fallback if image fails to load
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="font-bold text-primary text-sm absolute -z-10">AT</span>
            </div>

            <div className="hidden md:flex flex-col border-r border-border/60 pr-4 py-1">
              <h1 className="text-base font-bold tracking-tight leading-none text-foreground">
                AskTechSolutions
              </h1>
              <p className="text-[10px] text-muted-foreground font-medium pt-1 uppercase tracking-wider">
                Admin Panel
              </p>
            </div>
          </div>

          {/* Middle Section: Welcome Greeting & Subtitle (like Image 1) */}
          <div className="hidden sm:flex flex-col pl-1">
            <h2 className="text-sm md:text-base font-bold text-foreground leading-tight tracking-tight">
              Welcome back, {user?.name ? user.name.split(' ')[0] : 'Admin'}!
            </h2>
            <p className="text-xs text-muted-foreground line-clamp-1">
              It is the best time to manage your business operations
            </p>
          </div>
        </div>

        {/* Right Section: Mode Toggles + Search + Notifications + User Profile Pill */}
        <div className="flex items-center gap-2 md:gap-3 pl-2">
          {/* Mode Toggles */}
          <div className="hidden lg:flex items-center gap-1.5 p-1 bg-secondary/50 border border-border/50 rounded-full">
            <Button
              variant={mode === 'website' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setMode('website')}
              className="rounded-full px-3.5 py-1.5 h-8 text-xs font-semibold transition-all shadow-none"
            >
              Website
            </Button>
            <Button
              variant={mode === 'application' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setMode('application')}
              className="rounded-full px-3.5 py-1.5 h-8 text-xs font-semibold transition-all shadow-none"
            >
              Application
            </Button>
          </div>

          {/* Theme Toggle */}
          <div className="scale-90 md:scale-100">
            <ThemeToggle />
          </div>

          {/* Search Button */}
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-9 w-9 md:h-10 md:w-10 border-border/80 bg-background hover:bg-accent/80 transition-colors shadow-sm"
            onClick={() => toast.info('Global Search', { description: 'Search functionality will be integrated with backend API.' })}
            title="Search"
          >
            <Search className="h-4 w-4 text-foreground" />
          </Button>

          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-9 w-9 md:h-10 md:w-10 relative border-border/80 bg-background hover:bg-accent/80 transition-colors shadow-sm"
              >
                <Bell className="h-4 w-4 text-foreground" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px] bg-rose-500 text-white border border-background animate-pulse font-bold">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 rounded-2xl border-border/80 shadow-lg p-2">
              <DropdownMenuLabel className="font-bold text-sm px-2 py-1.5">Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded-xl p-2.5 cursor-pointer hover:bg-accent">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold">New employee registered</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl p-2.5 cursor-pointer hover:bg-accent">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold">Leave request pending</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl p-2.5 cursor-pointer hover:bg-accent">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold">Project milestone completed</p>
                  <p className="text-xs text-muted-foreground">3 hours ago</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile Pill (Exactly like Image 1) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2.5 pl-1.5 pr-3 md:pr-4 py-1 rounded-full border border-border/80 bg-background hover:bg-accent/60 transition-all cursor-pointer shadow-sm group">
                <Avatar className="h-7 w-7 md:h-8 md:w-8 rounded-full border border-primary/20 shadow-inner group-hover:scale-105 transition-transform">
                  <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xs md:text-sm">
                    {user?.name?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden xl:flex flex-col text-left py-0.5">
                  <span className="text-xs md:text-sm font-bold leading-none text-foreground tracking-tight">
                    {user?.name || 'Admin User'}
                  </span>
                  <span className="text-[10px] text-muted-foreground pt-1 leading-none truncate max-w-[120px]">
                    {user?.email || 'admin@asktech.com'}
                  </span>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-2xl border-border/80 shadow-lg p-2">
              <DropdownMenuLabel className="p-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-bold leading-none text-foreground">{user?.name || 'Admin User'}</p>
                  <p className="text-xs leading-none text-muted-foreground pt-1">
                    {user?.email || 'admin@asktech.com'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded-xl p-2 cursor-pointer hover:bg-accent">
                <User className="mr-2 h-4 w-4 text-primary" />
                <span className="font-medium">Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl p-2 cursor-pointer hover:bg-accent">
                <Settings className="mr-2 h-4 w-4 text-primary" />
                <span className="font-medium">Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="rounded-xl p-2 cursor-pointer hover:bg-rose-500/10 text-rose-500 font-medium">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.nav>

      {/* Mobile Mode Toggles */}
      <div className="lg:hidden px-2 pt-2 flex gap-2">
        <Button
          variant={mode === 'website' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('website')}
          className="flex-1 rounded-full text-xs font-semibold transition-all"
        >
          Website
        </Button>
        <Button
          variant={mode === 'application' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('application')}
          className="flex-1 rounded-full text-xs font-semibold transition-all"
        >
          Application
        </Button>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell, CheckCheck, Info, CheckCircle, AlertTriangle, XCircle,
  Cpu, ArrowLeft, Trash2, Search, Filter, MailOpen, Mail
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { mockNotifications } from '../lib/mock-data';
import { Notification } from '../lib/types';
import { toast } from 'sonner';
import { cn } from '../components/ui/utils';

interface NotificationsPageProps {
  onBack?: () => void;
}

const typeConfig: Record<Notification['type'], { icon: any; color: string; bg: string; border: string }> = {
  'info': { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  'success': { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  'warning': { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  'error': { icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
  'system': { icon: Cpu, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
};

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function NotificationsPage({ onBack }: NotificationsPageProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [readFilter, setReadFilter] = useState<string>('all');

  const filtered = notifications.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.message.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || n.type === typeFilter;
    const matchesRead = readFilter === 'all' || (readFilter === 'unread' && !n.read) || (readFilter === 'read' && n.read);
    return matchesSearch && matchesType && matchesRead;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success('All notifications cleared');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.6 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          {onBack && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="h-9 w-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground border border-white/10 bg-white/5 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </motion.button>
          )}
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2.5 text-foreground">
              <Bell className="h-7 w-7 text-blue-400" />
              Notifications
              {unreadCount > 0 && (
                <Badge className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs rounded-full font-bold px-2.5 py-0.5">{unreadCount}</Badge>
              )}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage all system and activity notifications</p>
          </div>
        </div>
        <div className="flex gap-3">
          {unreadCount > 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={markAllRead}
              className="gap-2 rounded-xl h-11 px-4 text-white border border-white/10 bg-white/5 hover:bg-white/10 transition-colors font-semibold flex items-center justify-center cursor-pointer"
            >
              <CheckCheck className="h-4 w-4 text-emerald-400" /> Mark All Read
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={clearAll}
            className="gap-2 rounded-xl h-11 px-4 text-muted-foreground hover:text-rose-400 border border-white/06 bg-white/02 hover:bg-rose-500/10 transition-colors font-semibold flex items-center justify-center cursor-pointer"
          >
            <Trash2 className="h-4 w-4" /> Clear All
          </motion.button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        {[
          { label: 'Total', value: notifications.length, color: 'text-foreground', bg: 'bg-white/5', border: 'border-white/06' },
          { label: 'Unread', value: notifications.filter(n => !n.read).length, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
          { label: 'Info', value: notifications.filter(n => n.type === 'info').length, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
          { label: 'Success', value: notifications.filter(n => n.type === 'success').length, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
          { label: 'Errors', value: notifications.filter(n => n.type === 'error').length, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15, filter: 'blur(5px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: i * 0.04, duration: 0.4 }}
            whileHover={{ y: -3 }}
            className={`glass-card p-4 text-center border ${stat.border} ${stat.bg} relative overflow-hidden`}
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase mt-1 tracking-wider">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1 rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notifications..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 rounded-xl bg-white/5 border-0 text-white placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0 h-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[140px] rounded-xl bg-white/5 border-white/10 text-white h-10 focus:ring-0 focus:ring-offset-0">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10 rounded-xl text-white">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="error">Error</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
        <Select value={readFilter} onValueChange={setReadFilter}>
          <SelectTrigger className="w-[140px] rounded-xl bg-white/5 border-white/10 text-white h-10 focus:ring-0 focus:ring-offset-0">
            <MailOpen className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Read Status" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10 rounded-xl text-white">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="unread">Unread</SelectItem>
            <SelectItem value="read">Read</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Notifications List */}
      <motion.div
        initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="glass-card overflow-hidden relative p-1.5"
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Bell className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No notifications found</p>
            </div>
          ) : (
            <div className="divide-y divide-white/06">
              {filtered.map((notif, i) => {
                const type = typeConfig[notif.type];
                const TypeIcon = type.icon;

                return (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.03 }}
                    className={cn(
                      'group flex items-start gap-4 p-4 hover:bg-white/02 transition-colors cursor-pointer relative rounded-xl my-1 border border-transparent hover:border-white/04',
                      !notif.read && 'bg-blue-500/03'
                    )}
                    onClick={() => markRead(notif.id)}
                  >
                    {/* Unread Indicator Pill */}
                    {!notif.read && (
                      <div className="absolute left-0 top-0 bottom-0 w-0.75 bg-blue-500 rounded-r-md" />
                    )}

                    {/* Icon Container */}
                    <div className={`flex-shrink-0 p-2.5 rounded-xl ${type.bg} ${type.color} border ${type.border} mt-0.5`}>
                      <TypeIcon className="h-4 w-4" />
                    </div>

                    {/* Content Block */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2.5">
                        <div>
                          <h4 className={cn('text-sm font-bold text-slate-300', !notif.read && 'text-white font-extrabold')}>
                            {notif.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed font-semibold">{notif.message}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-2 flex-shrink-0 font-semibold">
                          <span className="text-xs text-muted-foreground whitespace-nowrap">{timeAgo(notif.timestamp)}</span>
                          {!notif.read && (
                            <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${type.bg} ${type.color} ${type.border}`}>
                          {notif.type}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons (revealed on hover) */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-3">
                      {!notif.read && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-white/10 text-muted-foreground hover:text-foreground cursor-pointer"
                          onClick={e => { e.stopPropagation(); markRead(notif.id); }}
                          title="Mark as read"
                        >
                          <Mail className="h-4 w-4 text-blue-400" />
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-rose-500/10 text-muted-foreground hover:text-rose-400 cursor-pointer"
                        onClick={e => { e.stopPropagation(); deleteNotification(notif.id); }}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-rose-400" />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell, CheckCheck, Info, CheckCircle, AlertTriangle, XCircle,
  Cpu, ArrowLeft, Trash2, Search, Filter, MailOpen, Mail
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Separator } from '../components/ui/separator';
import { mockNotifications } from '../lib/mock-data';
import { Notification } from '../lib/types';
import { toast } from 'sonner';
import { cn } from '../components/ui/utils';

interface NotificationsPageProps {
  onBack?: () => void;
}

const typeConfig: Record<Notification['type'], { icon: any; color: string; bg: string }> = {
  'info': { icon: Info, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-950/30' },
  'success': { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-950/30' },
  'warning': { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-950/30' },
  'error': { icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-100 dark:bg-rose-950/30' },
  'system': { icon: Cpu, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-950/30' },
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
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Bell className="h-7 w-7 text-primary" />
              Notifications
              {unreadCount > 0 && (
                <Badge className="bg-rose-500 text-white text-xs rounded-full">{unreadCount}</Badge>
              )}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage all system and activity notifications</p>
          </div>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllRead} className="gap-2 rounded-xl text-sm">
              <CheckCheck className="h-4 w-4" /> Mark All Read
            </Button>
          )}
          <Button variant="ghost" onClick={clearAll} className="gap-2 rounded-xl text-sm text-muted-foreground hover:text-rose-600">
            <Trash2 className="h-4 w-4" /> Clear All
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total', value: notifications.length, color: 'text-foreground' },
          { label: 'Unread', value: notifications.filter(n => !n.read).length, color: 'text-blue-600' },
          { label: 'Info', value: notifications.filter(n => n.type === 'info').length, color: 'text-blue-600' },
          { label: 'Success', value: notifications.filter(n => n.type === 'success').length, color: 'text-emerald-600' },
          { label: 'Errors', value: notifications.filter(n => n.type === 'error').length, color: 'text-rose-600' },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-3 text-center">
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search notifications..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 rounded-xl" />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[140px] rounded-xl">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="error">Error</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
        <Select value={readFilter} onValueChange={setReadFilter}>
          <SelectTrigger className="w-[140px] rounded-xl">
            <MailOpen className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Read Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="unread">Unread</SelectItem>
            <SelectItem value="read">Read</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Notifications List */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardContent className="p-0">
            <AnimatePresence>
              {filtered.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <Bell className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No notifications found</p>
                </div>
              ) : (
                filtered.map((notif, i) => {
                  const type = typeConfig[notif.type];
                  const TypeIcon = type.icon;

                  return (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <div
                        className={cn(
                          'group flex items-start gap-4 p-4 hover:bg-secondary/30 transition-colors cursor-pointer relative',
                          !notif.read && 'bg-blue-50/30 dark:bg-blue-950/10'
                        )}
                        onClick={() => markRead(notif.id)}
                      >
                        {/* Unread Indicator */}
                        {!notif.read && (
                          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500 rounded-r" />
                        )}

                        {/* Icon */}
                        <div className={`flex-shrink-0 p-2.5 rounded-xl ${type.bg} mt-0.5`}>
                          <TypeIcon className={`h-4 w-4 ${type.color}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className={cn('text-sm font-semibold', !notif.read && 'text-foreground')}>
                                {notif.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.message}</p>
                            </div>
                            <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                              <span className="text-xs text-muted-foreground whitespace-nowrap">{timeAgo(notif.timestamp)}</span>
                              {!notif.read && (
                                <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${type.bg} ${type.color}`}>
                              {notif.type.charAt(0).toUpperCase() + notif.type.slice(1)}
                            </span>
                          </div>
                        </div>

                        {/* Actions (on hover) */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notif.read && (
                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full"
                              onClick={e => { e.stopPropagation(); markRead(notif.id); }}
                              title="Mark as read">
                              <Mail className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                            onClick={e => { e.stopPropagation(); deleteNotification(notif.id); }}
                            title="Delete">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                      {i < filtered.length - 1 && <Separator />}
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

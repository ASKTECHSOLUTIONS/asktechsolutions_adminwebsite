import { motion } from 'motion/react';
import { Plus, UserPlus, FileText, Calendar, DollarSign, Video } from 'lucide-react';
import { useDashboardStore } from '../../store/dashboardStore';
import { toast } from 'sonner';

export function QuickActions() {
  const { mode } = useDashboardStore();

  const websiteActions = [
    { icon: UserPlus, label: 'Add Employee', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { icon: Calendar, label: 'Mark Attendance', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { icon: FileText, label: 'Leave Request', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { icon: Plus, label: 'New Content', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  ];

  const applicationActions = [
    { icon: UserPlus, label: 'Add Client', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { icon: Plus, label: 'New Project', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { icon: DollarSign, label: 'Record Payment', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { icon: Video, label: 'Schedule Meeting', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  ];

  const actions = mode === 'website' ? websiteActions : applicationActions;

  const handleAction = (label: string) => {
    toast.success(`${label} action triggered`, {
      description: 'Action execution will be integrated with the backend API.',
      icon: '⚡',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
      className="glass-card p-6 relative overflow-hidden h-full flex flex-col justify-between"
    >
      {/* Top light reflection */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Header */}
      <div className="mb-6">
        <h3 className="text-base font-semibold text-foreground">Quick Actions</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Common tasks at your fingertips</p>
      </div>

      <div className="grid grid-cols-2 gap-3 flex-1">
        {actions.map((action, index) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 + index * 0.05, type: 'spring', stiffness: 200 }}
            whileHover={{
              y: -3,
              scale: 1.03,
              boxShadow: '0 8px 25px rgba(59,130,246,0.15)',
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleAction(action.label)}
            className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl text-center border bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group relative overflow-hidden`}
            style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}
          >
            {/* Ambient hover color glow inside card */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${action.bg}`} />
            
            <div className={`p-2.5 rounded-xl ${action.bg} ${action.color} border ${action.border} transition-transform duration-300 group-hover:scale-110`}>
              <action.icon className="h-5 w-5" />
            </div>
            
            <span className="text-xs font-semibold text-foreground">{action.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

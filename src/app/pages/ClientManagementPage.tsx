import { motion } from 'motion/react';
import { ArrowLeft, Mail, Phone, Building } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { DataTable } from '../components/ui/data-table';
import { mockClients } from '../lib/mock-data';
import { Client } from '../lib/types';

export function ClientManagementPage({ onBack }: { onBack: () => void }) {
  const columns = [
    {
      header: 'Client',
      cell: (row: Client) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-white/10">
            <AvatarFallback className="bg-blue-500/10 text-blue-400 font-bold">
              {row.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold text-white text-xs hover:text-blue-400 transition-colors">{row.name}</p>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-semibold mt-0.5">
              <Building className="h-3 w-3" />
              {row.company}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Contact',
      cell: (row: Client) => (
        <div className="space-y-1 font-semibold">
          <div className="flex items-center gap-2 text-[11px] text-slate-300">
            <Mail className="h-3 w-3 text-blue-400" />
            <span>{row.email}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-300">
            <Phone className="h-3 w-3 text-blue-400" />
            <span>{row.phone}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Projects',
      cell: (row: Client) => <span className="font-bold text-white text-xs">{row.projectsCount}</span>,
    },
    {
      header: 'Total Value',
      cell: (row: Client) => <span className="font-extrabold text-blue-400 text-xs">${row.totalValue.toLocaleString()}</span>,
    },
    {
      header: 'Status',
      cell: (row: Client) => (
        <Badge
          className={
            row.status === 'active'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold'
              : row.status === 'pending'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold'
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold'
          }
        >
          {row.status}
        </Badge>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="h-9 w-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground border border-white/10 bg-white/5 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
        </motion.button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-foreground">
            <Building className="h-7 w-7 text-blue-400" /> Client Management
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your client relationships</p>
        </div>
      </div>

      <div className="glass-card p-5 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <DataTable
          data={mockClients}
          columns={columns}
          searchPlaceholder="Search clients..."
        />
      </div>
    </motion.div>
  );
}

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
          <Avatar>
            <AvatarFallback>{row.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{row.name}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
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
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-3 w-3 text-muted-foreground" />
            <span>{row.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-3 w-3 text-muted-foreground" />
            <span>{row.phone}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Projects',
      accessorKey: 'projectsCount' as keyof Client,
    },
    {
      header: 'Total Value',
      cell: (row: Client) => <span>${row.totalValue.toLocaleString()}</span>,
    },
    {
      header: 'Status',
      cell: (row: Client) => (
        <Badge
          variant={
            row.status === 'active'
              ? 'default'
              : row.status === 'pending'
              ? 'secondary'
              : 'outline'
          }
        >
          {row.status}
        </Badge>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Client Management</h1>
          <p className="text-muted-foreground">Manage your client relationships</p>
        </div>
      </div>

      <DataTable
        data={mockClients}
        columns={columns}
        searchPlaceholder="Search clients..."
      />
    </motion.div>
  );
}

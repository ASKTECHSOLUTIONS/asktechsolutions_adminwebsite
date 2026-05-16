import { motion } from 'motion/react';
import { ArrowLeft, Mail, Briefcase } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { DataTable } from '../components/ui/data-table';
import { mockEmployees } from '../lib/mock-data';
import { Employee } from '../lib/types';

export function EmployeeManagementPage({ onBack }: { onBack: () => void }) {
  const columns = [
    {
      header: 'Employee',
      cell: (row: Employee) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{row.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{row.name}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Department',
      cell: (row: Employee) => (
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-muted-foreground" />
          <span>{row.department}</span>
        </div>
      ),
    },
    {
      header: 'Position',
      accessorKey: 'position' as keyof Employee,
    },
    {
      header: 'Status',
      cell: (row: Employee) => (
        <Badge
          variant={
            row.status === 'active'
              ? 'default'
              : row.status === 'on-leave'
              ? 'secondary'
              : 'outline'
          }
        >
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'Join Date',
      accessorKey: 'joinDate' as keyof Employee,
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
          <h1 className="text-3xl font-bold">Employee Management</h1>
          <p className="text-muted-foreground">Manage your team members</p>
        </div>
      </div>

      <DataTable
        data={mockEmployees}
        columns={columns}
        searchPlaceholder="Search employees..."
      />
    </motion.div>
  );
}

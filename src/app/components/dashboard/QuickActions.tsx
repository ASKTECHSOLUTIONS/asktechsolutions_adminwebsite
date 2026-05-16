import { motion } from 'motion/react';
import { Plus, UserPlus, FileText, Calendar, DollarSign } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useDashboardStore } from '../../store/dashboardStore';

export function QuickActions() {
  const { mode } = useDashboardStore();

  const websiteActions = [
    { icon: UserPlus, label: 'Add Employee', color: 'text-blue-600' },
    { icon: Calendar, label: 'Mark Attendance', color: 'text-green-600' },
    { icon: FileText, label: 'Leave Request', color: 'text-orange-600' },
    { icon: Plus, label: 'New Content', color: 'text-purple-600' },
  ];

  const applicationActions = [
    { icon: UserPlus, label: 'Add Client', color: 'text-blue-600' },
    { icon: Plus, label: 'New Project', color: 'text-green-600' },
    { icon: DollarSign, label: 'Record Payment', color: 'text-orange-600' },
    { icon: Calendar, label: 'Schedule Meeting', color: 'text-purple-600' },
  ];

  const actions = mode === 'website' ? websiteActions : applicationActions;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks at your fingertips</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                variant="outline"
                className="w-full h-auto flex-col gap-2 py-4 hover:shadow-md transition-all"
              >
                <action.icon className={`h-6 w-6 ${action.color}`} />
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

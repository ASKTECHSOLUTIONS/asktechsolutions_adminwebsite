import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  Briefcase,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { StatCard } from '../components/dashboard/StatCard';
import { DashboardChart } from '../components/dashboard/DashboardChart';
import { QuickActions } from '../components/dashboard/QuickActions';
import { useDashboardStore } from '../store/dashboardStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { ScrollArea } from '../components/ui/scroll-area';
import { EmployeeManagementPage } from './EmployeeManagementPage';
import { ClientManagementPage } from './ClientManagementPage';

const websiteData = [
  { name: 'Jan', value: 45 },
  { name: 'Feb', value: 52 },
  { name: 'Mar', value: 48 },
  { name: 'Apr', value: 61 },
  { name: 'May', value: 55 },
  { name: 'Jun', value: 67 },
];

const applicationData = [
  { name: 'Jan', value: 120 },
  { name: 'Feb', value: 145 },
  { name: 'Mar', value: 138 },
  { name: 'Apr', value: 167 },
  { name: 'May', value: 189 },
  { name: 'Jun', value: 203 },
];

type PageView = 'dashboard' | 'employees' | 'clients';

export function DashboardPage() {
  const { mode } = useDashboardStore();
  const [currentPage, setCurrentPage] = useState<PageView>('dashboard');

  const handleNavigation = (path: string) => {
    if (path === '/employees') {
      setCurrentPage('employees');
    } else if (path === '/clients') {
      setCurrentPage('clients');
    } else {
      setCurrentPage('dashboard');
    }
  };

  if (currentPage === 'employees') {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex">
          <Sidebar onNavigate={handleNavigation} />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <EmployeeManagementPage onBack={() => setCurrentPage('dashboard')} />
          </main>
        </div>
      </div>
    );
  }

  if (currentPage === 'clients') {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex">
          <Sidebar onNavigate={handleNavigation} />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <ClientManagementPage onBack={() => setCurrentPage('dashboard')} />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar onNavigate={handleNavigation} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">
                {mode === 'website' ? 'Website Dashboard' : 'Application Dashboard'}
              </h1>
              <p className="text-muted-foreground">
                {mode === 'website'
                  ? 'Overview of website operations and employee management'
                  : 'Overview of client applications and project management'}
              </p>
            </div>

            {mode === 'website' ? (
              <>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                  <StatCard
                    title="Total Employees"
                    value="67"
                    icon={Users}
                    trend={{ value: 12, isPositive: true }}
                    description="Active employees"
                  />
                  <StatCard
                    title="Present Today"
                    value="54"
                    icon={CheckCircle}
                    trend={{ value: 5, isPositive: true }}
                    description="80% attendance"
                  />
                  <StatCard
                    title="On Leave"
                    value="8"
                    icon={Clock}
                    description="Approved leaves"
                  />
                  <StatCard
                    title="Pending Requests"
                    value="5"
                    icon={FileText}
                    description="Require attention"
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                  <div className="lg:col-span-2">
                    <DashboardChart
                      title="Employee Attendance Trend"
                      description="Monthly attendance overview"
                      data={websiteData}
                      dataKey="value"
                    />
                  </div>
                  <QuickActions />
                </div>

                <div className="grid gap-6 md:grid-cols-2 mb-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activities</CardTitle>
                      <CardDescription>Latest employee activities</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[300px]">
                        <div className="space-y-4">
                          {[
                            {
                              name: 'John Doe',
                              action: 'Submitted leave request',
                              time: '2 mins ago',
                              status: 'pending',
                            },
                            {
                              name: 'Sarah Smith',
                              action: 'Marked attendance',
                              time: '15 mins ago',
                              status: 'success',
                            },
                            {
                              name: 'Mike Johnson',
                              action: 'Updated profile',
                              time: '1 hour ago',
                              status: 'success',
                            },
                            {
                              name: 'Emily Brown',
                              action: 'Leave approved',
                              time: '2 hours ago',
                              status: 'success',
                            },
                            {
                              name: 'David Wilson',
                              action: 'Submitted timesheet',
                              time: '3 hours ago',
                              status: 'success',
                            },
                          ].map((activity, index) => (
                            <div key={index} className="flex items-start gap-4">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback>{activity.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium">{activity.name}</p>
                                <p className="text-xs text-muted-foreground">{activity.action}</p>
                                <p className="text-xs text-muted-foreground">{activity.time}</p>
                              </div>
                              <Badge
                                variant={activity.status === 'pending' ? 'outline' : 'secondary'}
                              >
                                {activity.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                  <StatCard
                    title="Total Clients"
                    value="42"
                    icon={Briefcase}
                    trend={{ value: 18, isPositive: true }}
                    description="Active clients"
                  />
                  <StatCard
                    title="Active Projects"
                    value="28"
                    icon={TrendingUp}
                    trend={{ value: 8, isPositive: true }}
                    description="In progress"
                  />
                  <StatCard
                    title="Total Revenue"
                    value="$124,580"
                    icon={DollarSign}
                    trend={{ value: 23, isPositive: true }}
                    description="This month"
                  />
                  <StatCard
                    title="Interns"
                    value="15"
                    icon={Users}
                    description="Currently active"
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                  <div className="lg:col-span-2">
                    <DashboardChart
                      title="Project Revenue Trend"
                      description="Monthly revenue overview"
                      data={applicationData}
                      dataKey="value"
                    />
                  </div>
                  <QuickActions />
                </div>

                <div className="grid gap-6 md:grid-cols-2 mb-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Projects</CardTitle>
                      <CardDescription>Latest project updates</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[300px]">
                        <div className="space-y-4">
                          {[
                            {
                              name: 'E-commerce Platform',
                              client: 'Tech Corp',
                              progress: 85,
                              status: 'In Progress',
                            },
                            {
                              name: 'Mobile App Development',
                              client: 'StartUp Inc',
                              progress: 60,
                              status: 'In Progress',
                            },
                            {
                              name: 'Website Redesign',
                              client: 'Design Studio',
                              progress: 100,
                              status: 'Completed',
                            },
                            {
                              name: 'CRM System',
                              client: 'Enterprise Co',
                              progress: 45,
                              status: 'In Progress',
                            },
                            {
                              name: 'Data Analytics Dashboard',
                              client: 'Analytics Ltd',
                              progress: 30,
                              status: 'Planning',
                            },
                          ].map((project, index) => (
                            <div key={index} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium">{project.name}</p>
                                  <p className="text-xs text-muted-foreground">{project.client}</p>
                                </div>
                                <Badge
                                  variant={
                                    project.status === 'Completed' ? 'default' : 'secondary'
                                  }
                                >
                                  {project.status}
                                </Badge>
                              </div>
                              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${project.progress}%` }}
                                  transition={{ duration: 1, delay: index * 0.1 }}
                                  className="h-full bg-primary"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

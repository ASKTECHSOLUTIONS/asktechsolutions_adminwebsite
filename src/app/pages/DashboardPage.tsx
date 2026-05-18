import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  Briefcase,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  FileText,
  FolderKanban,
  Video,
  GraduationCap,
  CreditCard,
  Bell,
  Calendar,
  AlertCircle,
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
import { Progress } from '../components/ui/progress';

// Pages
import { EmployeeManagementPage } from './EmployeeManagementPage';
import { ClientManagementPage } from './ClientManagementPage';
import { AttendancePage } from './AttendancePage';
import { LeaveManagementPage } from './LeaveManagementPage';
import { ReportsAnalyticsPage } from './ReportsAnalyticsPage';
import { ProjectManagementPage } from './ProjectManagementPage';
import { MeetingManagementPage } from './MeetingManagementPage';
import { PaymentPage } from './PaymentPage';
import { InternshipPage } from './InternshipPage';
import { NotificationsPage } from './NotificationsPage';
import { SettingsPage } from './SettingsPage';
import { mockProjects, revenueChartData, attendanceTrendData } from '../lib/mock-data';

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

type PageView =
  | 'dashboard'
  | 'employees'
  | 'clients'
  | 'attendance'
  | 'leaves'
  | 'reports'
  | 'projects'
  | 'meetings'
  | 'payments'
  | 'internships'
  | 'notifications'
  | 'settings';

const pathToPage: Record<string, PageView> = {
  '/': 'dashboard',
  '/employees': 'employees',
  '/clients': 'clients',
  '/attendance': 'attendance',
  '/leaves': 'leaves',
  '/reports': 'reports',
  '/projects': 'projects',
  '/meetings': 'meetings',
  '/payments': 'payments',
  '/internships': 'internships',
  '/notifications': 'notifications',
  '/settings': 'settings',
  '/app-settings': 'settings',
  '/analytics': 'reports',
  '/content': 'dashboard',
};

const recentActivities = [
  { name: 'John Anderson', action: 'Submitted leave request', time: '2 mins ago', status: 'pending', type: 'leave' },
  { name: 'Sarah Mitchell', action: 'Marked attendance', time: '15 mins ago', status: 'success', type: 'attendance' },
  { name: 'Arjun Verma', action: 'Interview scheduled', time: '1 hour ago', status: 'success', type: 'internship' },
  { name: 'Infinity Corp', action: 'Payment overdue alert', time: '2 hours ago', status: 'error', type: 'payment' },
  { name: 'David Thompson', action: 'Project milestone completed', time: '3 hours ago', status: 'success', type: 'project' },
  { name: 'Priya Sharma', action: 'New employee onboarded', time: '5 hours ago', status: 'success', type: 'hr' },
];

export function DashboardPage() {
  const { mode } = useDashboardStore();
  const [currentPage, setCurrentPage] = useState<PageView>('dashboard');

  const handleNavigation = (path: string) => {
    const page = pathToPage[path];
    if (page) {
      setCurrentPage(page);
    } else {
      setCurrentPage('dashboard');
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'employees':
        return <EmployeeManagementPage onBack={() => setCurrentPage('dashboard')} />;
      case 'clients':
        return <ClientManagementPage onBack={() => setCurrentPage('dashboard')} />;
      case 'attendance':
        return <AttendancePage onBack={() => setCurrentPage('dashboard')} />;
      case 'leaves':
        return <LeaveManagementPage onBack={() => setCurrentPage('dashboard')} />;
      case 'reports':
        return <ReportsAnalyticsPage onBack={() => setCurrentPage('dashboard')} />;
      case 'projects':
        return <ProjectManagementPage onBack={() => setCurrentPage('dashboard')} />;
      case 'meetings':
        return <MeetingManagementPage onBack={() => setCurrentPage('dashboard')} />;
      case 'payments':
        return <PaymentPage onBack={() => setCurrentPage('dashboard')} />;
      case 'internships':
        return <InternshipPage onBack={() => setCurrentPage('dashboard')} />;
      case 'notifications':
        return <NotificationsPage onBack={() => setCurrentPage('dashboard')} />;
      case 'settings':
        return <SettingsPage onBack={() => setCurrentPage('dashboard')} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar
          onNavigate={handleNavigation}
          currentPath={currentPage === 'dashboard' ? '/' : `/${currentPage}`}
        />
        <main className="flex-1 p-4 md:p-6 lg:p-8 min-w-0">
          {currentPage !== 'dashboard' ? (
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderPage()}
            </motion.div>
          ) : (
            <motion.div
              key={`${mode}-dashboard`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Dashboard Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">
                  {mode === 'website' ? 'HR & Operations Dashboard' : 'Business Dashboard'}
                </h1>
                <p className="text-muted-foreground">
                  {mode === 'website'
                    ? 'Monitor employee operations, attendance and HR metrics'
                    : 'Track clients, projects, revenue and business growth'}
                </p>
              </div>

              {/* Stats Cards */}
              {mode === 'website' ? (
                <>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    <StatCard title="Total Employees" value="67" icon={Users}
                      trend={{ value: 12, isPositive: true }} description="Active employees" />
                    <StatCard title="Present Today" value="54" icon={CheckCircle}
                      trend={{ value: 5, isPositive: true }} description="80% attendance rate" />
                    <StatCard title="On Leave" value="8" icon={Clock} description="Approved leaves" />
                    <StatCard title="Pending Requests" value="5" icon={FileText} description="Require attention" />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                    <div className="lg:col-span-2">
                      <DashboardChart title="Employee Attendance Trend" description="Monthly attendance overview"
                        data={websiteData} dataKey="value" />
                    </div>
                    <QuickActions />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2 mb-8">
                    {/* Recent Activities */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Activities</CardTitle>
                        <CardDescription>Latest employee activities</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[300px]">
                          <div className="space-y-4">
                            {recentActivities.map((activity, index) => (
                              <div key={index} className="flex items-start gap-4">
                                <Avatar className="h-9 w-9">
                                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                                    {activity.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-1">
                                  <p className="text-sm font-medium">{activity.name}</p>
                                  <p className="text-xs text-muted-foreground">{activity.action}</p>
                                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                                </div>
                                <Badge variant={activity.status === 'pending' ? 'outline' : activity.status === 'error' ? 'destructive' : 'secondary'}>
                                  {activity.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>

                    {/* Attendance Summary */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Today's Attendance</CardTitle>
                        <CardDescription>Real-time attendance overview</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {[
                          { label: 'Present', count: 54, total: 67, color: 'bg-emerald-500' },
                          { label: 'On Leave', count: 8, total: 67, color: 'bg-amber-500' },
                          { label: 'Absent', count: 3, total: 67, color: 'bg-rose-500' },
                          { label: 'Late', count: 2, total: 67, color: 'bg-blue-500' },
                        ].map((item) => (
                          <div key={item.label}>
                            <div className="flex justify-between text-sm mb-1.5">
                              <span>{item.label}</span>
                              <span className="font-semibold">{item.count} / {item.total}</span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(item.count / item.total) * 100}%` }}
                                transition={{ duration: 1 }}
                                className={`h-full rounded-full ${item.color}`}
                              />
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    <StatCard title="Total Clients" value="42" icon={Briefcase}
                      trend={{ value: 18, isPositive: true }} description="Active clients" />
                    <StatCard title="Active Projects" value="28" icon={FolderKanban}
                      trend={{ value: 8, isPositive: true }} description="In progress" />
                    <StatCard title="Total Revenue" value="$186,580" icon={DollarSign}
                      trend={{ value: 23, isPositive: true }} description="This year" />
                    <StatCard title="Pending Payments" value="$64,000" icon={CreditCard}
                      description="2 overdue invoices" />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    <StatCard title="Upcoming Meetings" value="4" icon={Video} description="This week" />
                    <StatCard title="Internship Apps" value="6" icon={GraduationCap}
                      trend={{ value: 3, isPositive: true }} description="New this month" />
                    <StatCard title="Notifications" value="3" icon={Bell} description="Unread alerts" />
                    <StatCard title="Delayed Projects" value="2" icon={AlertCircle}
                      trend={{ value: 1, isPositive: false }} description="Need attention" />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                    <div className="lg:col-span-2">
                      <DashboardChart title="Revenue Overview" description="Monthly revenue vs expenses"
                        data={applicationData} dataKey="value" />
                    </div>
                    <QuickActions />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2 mb-8">
                    {/* Recent Projects */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Active Projects</CardTitle>
                        <CardDescription>Latest project progress</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[280px]">
                          <div className="space-y-4">
                            {mockProjects.filter(p => p.status !== 'completed').map((project, index) => (
                              <div key={index} className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium">{project.name}</p>
                                    <p className="text-xs text-muted-foreground">{project.client}</p>
                                  </div>
                                  <Badge variant={project.status === 'delayed' ? 'destructive' : 'secondary'}>
                                    {project.status === 'in-progress' ? 'In Progress'
                                      : project.status === 'planning' ? 'Planning'
                                        : project.status === 'delayed' ? 'Delayed'
                                          : project.status}
                                  </Badge>
                                </div>
                                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${project.progress}%` }}
                                    transition={{ duration: 1, delay: index * 0.1 }}
                                    className={`h-full ${project.progress >= 75 ? 'bg-emerald-500' : project.progress >= 50 ? 'bg-blue-500' : 'bg-amber-500'}`}
                                  />
                                </div>
                                <p className="text-xs text-muted-foreground text-right">{project.progress}%</p>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>

                    {/* Recent Activities */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Activities</CardTitle>
                        <CardDescription>System-wide activity log</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[280px]">
                          <div className="space-y-4">
                            {recentActivities.map((activity, index) => (
                              <div key={index} className="flex items-start gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                    {activity.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-0.5">
                                  <p className="text-sm font-medium">{activity.name}</p>
                                  <p className="text-xs text-muted-foreground">{activity.action}</p>
                                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                                </div>
                                <Badge variant={activity.status === 'pending' ? 'outline' : activity.status === 'error' ? 'destructive' : 'secondary'} className="text-xs">
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
              )}
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}

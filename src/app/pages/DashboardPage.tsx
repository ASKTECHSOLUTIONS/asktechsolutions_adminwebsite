import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Users, Briefcase, DollarSign, TrendingUp, Clock, CheckCircle,
  FileText, FolderKanban, Video, GraduationCap, CreditCard, Bell,
  Calendar, AlertCircle,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { StatCard } from '../components/dashboard/StatCard';
import { DashboardChart } from '../components/dashboard/DashboardChart';
import { QuickActions } from '../components/dashboard/QuickActions';
import { useDashboardStore } from '../store/dashboardStore';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { ScrollArea } from '../components/ui/scroll-area';

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
    <div className="h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Ambient orbs */}
      <div className="orb orb-blue" />
      <div className="orb orb-purple" />
      <div className="orb orb-cyan" />
      {/* Dot grid overlay */}
      <div className="fixed inset-0 dot-grid pointer-events-none" style={{ zIndex: 0 }} />

      <div className="relative flex flex-col h-full min-h-0" style={{ zIndex: 1 }}>
        <Navbar />
        <div className="flex flex-1 min-h-0">
          <Sidebar
            onNavigate={handleNavigation}
            currentPath={currentPage === 'dashboard' ? '/' : `/${currentPage}`}
          />
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto min-w-0">
          {currentPage !== 'dashboard' ? (
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {renderPage()}
            </motion.div>
          ) : (
            <motion.div
              key={`${mode}-dashboard`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
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
                      trend={{ value: 12, isPositive: true }} description="Active employees" color="blue" delay={0} />
                    <StatCard title="Present Today" value="54" icon={CheckCircle}
                      trend={{ value: 5, isPositive: true }} description="80% attendance rate" color="emerald" delay={0.08} />
                    <StatCard title="On Leave" value="8" icon={Clock} description="Approved leaves" color="amber" delay={0.16} />
                    <StatCard title="Pending Requests" value="5" icon={FileText} description="Require attention" color="rose" delay={0.24} />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                    <div className="lg:col-span-2">
                      <DashboardChart title="Employee Attendance Trend" description="Monthly attendance overview"
                        data={websiteData} dataKey="value" color="#3b82f6" />
                    </div>
                    <QuickActions />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2 mb-8">
                    {/* Recent Activities */}
                    <div className="glass-card p-5">
                      <p className="font-semibold text-foreground mb-1">Recent Activities</p>
                      <p className="text-xs text-muted-foreground mb-4">Latest employee activities</p>
                      <ScrollArea className="h-[300px]">
                        <div className="space-y-4">
                          {recentActivities.map((activity, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <Avatar className="h-8 w-8 rounded-xl">
                                <AvatarFallback className="rounded-xl text-xs font-bold text-white"
                                  style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
                                  {activity.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-foreground">{activity.name}</p>
                                <p className="text-xs text-muted-foreground">{activity.action}</p>
                                <p className="text-xs text-muted-foreground">{activity.time}</p>
                              </div>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                                activity.status === 'pending' ? 'bg-amber-500/15 text-amber-400' :
                                activity.status === 'error' ? 'bg-rose-500/15 text-rose-400' :
                                'bg-emerald-500/15 text-emerald-400'
                              }`}>{activity.status}</span>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>

                    {/* Attendance Summary */}
                    <div className="glass-card p-5">
                      <p className="font-semibold text-foreground mb-1">Today's Attendance</p>
                      <p className="text-xs text-muted-foreground mb-4">Real-time attendance overview</p>
                      <div className="space-y-4">
                        {[
                          { label: 'Present', count: 54, total: 67, color: '#10b981', glow: 'rgba(16,185,129,0.3)' },
                          { label: 'On Leave', count: 8, total: 67, color: '#f59e0b', glow: 'rgba(245,158,11,0.3)' },
                          { label: 'Absent', count: 3, total: 67, color: '#f43f5e', glow: 'rgba(244,63,94,0.3)' },
                          { label: 'Late', count: 2, total: 67, color: '#3b82f6', glow: 'rgba(59,130,246,0.3)' },
                        ].map((item) => (
                          <div key={item.label}>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-muted-foreground">{item.label}</span>
                              <span className="font-semibold text-foreground">{item.count}/{item.total}</span>
                            </div>
                            <div className="h-1.5 bg-white/06 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(item.count / item.total) * 100}%` }}
                                transition={{ duration: 1.2, ease: 'easeOut' }}
                                className="h-full rounded-full"
                                style={{ background: item.color, boxShadow: `0 0 8px ${item.glow}` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    <StatCard title="Total Clients" value="42" icon={Briefcase}
                      trend={{ value: 18, isPositive: true }} description="Active clients" color="cyan" delay={0} />
                    <StatCard title="Active Projects" value="28" icon={FolderKanban}
                      trend={{ value: 8, isPositive: true }} description="In progress" color="purple" delay={0.08} />
                    <StatCard title="Total Revenue" value="$186,580" icon={DollarSign}
                      trend={{ value: 23, isPositive: true }} description="This year" color="emerald" delay={0.16} />
                    <StatCard title="Pending Payments" value="$64,000" icon={CreditCard}
                      description="2 overdue invoices" color="amber" delay={0.24} />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    <StatCard title="Upcoming Meetings" value="4" icon={Video} description="This week" color="blue" delay={0.32} />
                    <StatCard title="Internship Apps" value="6" icon={GraduationCap}
                      trend={{ value: 3, isPositive: true }} description="New this month" color="cyan" delay={0.4} />
                    <StatCard title="Notifications" value="3" icon={Bell} description="Unread alerts" color="rose" delay={0.48} />
                    <StatCard title="Delayed Projects" value="2" icon={AlertCircle}
                      trend={{ value: 1, isPositive: false }} description="Need attention" color="rose" delay={0.56} />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                    <div className="lg:col-span-2">
                      <DashboardChart title="Revenue Overview" description="Monthly revenue vs expenses"
                        data={applicationData} dataKey="value" color="#06b6d4" />
                    </div>
                    <QuickActions />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2 mb-8">
                    {/* Recent Projects */}
                    <div className="glass-card p-5">
                      <p className="font-semibold text-foreground mb-1">Active Projects</p>
                      <p className="text-xs text-muted-foreground mb-4">Latest project progress</p>
                      <ScrollArea className="h-[280px]">
                        <div className="space-y-4">
                          {mockProjects.filter(p => p.status !== 'completed').map((project, index) => (
                            <div key={index} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-foreground">{project.name}</p>
                                  <p className="text-xs text-muted-foreground">{project.client}</p>
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                                  project.status === 'delayed' ? 'bg-rose-500/15 text-rose-400' :
                                  project.status === 'in-progress' ? 'bg-blue-500/15 text-blue-400' :
                                  'bg-amber-500/15 text-amber-400'
                                }`}>
                                  {project.status === 'in-progress' ? 'In Progress' : project.status}
                                </span>
                              </div>
                              <div className="h-1.5 bg-white/06 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${project.progress}%` }}
                                  transition={{ duration: 1.2, delay: index * 0.1, ease: 'easeOut' }}
                                  className="h-full rounded-full"
                                  style={{
                                    background: project.progress >= 75 ? '#10b981' : project.progress >= 50 ? '#3b82f6' : '#f59e0b',
                                    boxShadow: project.progress >= 75 ? '0 0 8px rgba(16,185,129,0.4)' : '0 0 8px rgba(59,130,246,0.4)',
                                  }}
                                />
                              </div>
                              <p className="text-[10px] text-muted-foreground text-right">{project.progress}%</p>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>

                    {/* Recent Activities */}
                    <div className="glass-card p-5">
                      <p className="font-semibold text-foreground mb-1">Recent Activities</p>
                      <p className="text-xs text-muted-foreground mb-4">System-wide activity log</p>
                      <ScrollArea className="h-[280px]">
                        <div className="space-y-4">
                          {recentActivities.map((activity, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <Avatar className="h-8 w-8 rounded-xl">
                                <AvatarFallback className="rounded-xl text-xs font-bold text-white"
                                  style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)' }}>
                                  {activity.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-foreground">{activity.name}</p>
                                <p className="text-xs text-muted-foreground">{activity.action}</p>
                                <p className="text-xs text-muted-foreground">{activity.time}</p>
                              </div>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                                activity.status === 'pending' ? 'bg-amber-500/15 text-amber-400' :
                                activity.status === 'error' ? 'bg-rose-500/15 text-rose-400' :
                                'bg-emerald-500/15 text-emerald-400'
                              }`}>{activity.status}</span>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </main>
      </div>
      </div>
    </div>
  );
}

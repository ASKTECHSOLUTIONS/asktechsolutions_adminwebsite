import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Search,
  Filter,
  Download,
  Users,
  TrendingUp,
  Clock,
  FileText,
  BarChart3,
  Award,
  Calendar as CalendarIcon,
  PieChart as PieChartIcon,
  CheckCircle2,
  DollarSign,
  Briefcase,
  Activity,
  FileSpreadsheet,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { StatCard } from '../components/dashboard/StatCard';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { toast } from 'sonner';

const monthlyAttendanceData = [
  { name: 'Jan', present: 88, absent: 12 },
  { name: 'Feb', present: 90, absent: 10 },
  { name: 'Mar', present: 85, absent: 15 },
  { name: 'Apr', present: 92, absent: 8 },
  { name: 'May', present: 94, absent: 6 },
  { name: 'Jun', present: 91, absent: 9 },
  { name: 'Jul', present: 89, absent: 11 },
  { name: 'Aug', present: 95, absent: 5 },
];

const leaveTypeData = [
  { name: 'Sick Leave', value: 35, color: '#ef4444' },
  { name: 'Casual Leave', value: 40, color: '#f59e0b' },
  { name: 'Paid Leave', value: 20, color: '#10b981' },
  { name: 'Emergency', value: 5, color: '#6366f1' },
];

const productivityData = [
  { name: 'Week 1', score: 82 },
  { name: 'Week 2', score: 88 },
  { name: 'Week 3', score: 85 },
  { name: 'Week 4', score: 94 },
];

const revenueData = [
  { name: 'Q1', revenue: 145000 },
  { name: 'Q2', revenue: 185000 },
  { name: 'Q3', revenue: 230000 },
  { name: 'Q4 (Est.)', revenue: 290000 },
];

const recentReports = [
  { id: 'REP-101', name: 'Q2 Financial Audit & Revenue Breakdown', dept: 'Finance', author: 'Robert Williams', date: '15 Aug 2026', status: 'Completed' },
  { id: 'REP-102', name: 'Monthly Engineering Productivity Metrics', dept: 'Engineering', author: 'John Anderson', date: '14 Aug 2026', status: 'Completed' },
  { id: 'REP-103', name: 'August Leave Distribution & Overtime Log', dept: 'HR', author: 'Sarah Mitchell', date: '12 Aug 2026', status: 'Completed' },
  { id: 'REP-104', name: 'Client Onboarding & Project Success Rate', dept: 'Sales', author: 'Jessica Brown', date: '10 Aug 2026', status: 'Completed' },
  { id: 'REP-105', name: 'Annual Performance Appraisal Overview', dept: 'HR', author: 'David Thompson', date: '08 Aug 2026', status: 'Generating' },
];

const topEmployees = [
  { name: 'Emily Rodriguez', dept: 'Marketing', score: '4.95 / 5', attendance: '100%', projects: 12 },
  { name: 'John Anderson', dept: 'Engineering', score: '4.88 / 5', attendance: '95%', projects: 8 },
  { name: 'Sarah Mitchell', dept: 'Design', score: '4.82 / 5', attendance: '88%', projects: 10 },
  { name: 'David Thompson', dept: 'Engineering', score: '4.79 / 5', attendance: '91%', projects: 9 },
  { name: 'Michael Chen', dept: 'Engineering', score: '4.75 / 5', attendance: '75%', projects: 7 },
];

export function ReportsAnalyticsPage({ onBack }: { onBack: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [reportType, setReportType] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

  const handleGenerate = () => {
    toast.success('Custom report generation initiated successfully!', {
      description: `Filtering by: Department (${deptFilter}) | Type (${reportType})`
    });
  };

  const handleExportPDF = () => {
    toast.success('Exporting Report as PDF...', { description: 'Your PDF download will begin shortly.' });
  };

  const handleExportExcel = () => {
    toast.success('Exporting Report as Excel Spreadsheet...', { description: 'XLSX file generated successfully.' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Reports & Analytics</h1>
            <p className="text-muted-foreground">Monitor business performance, employee insights, and enterprise productivity</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Button variant="outline" className="gap-2" onClick={handleExportPDF}>
            <Download className="h-4 w-4" />
            <span>Export PDF</span>
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleExportExcel}>
            <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
            <span>Export Excel</span>
          </Button>
          <Button className="gap-2" onClick={handleGenerate}>
            <BarChart3 className="h-4 w-4" />
            <span>Generate Report</span>
          </Button>
        </div>
      </div>

      {/* Top Control Section */}
      <Card className="bg-card">
        <CardContent className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-input-background"
            />
          </div>
          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Department Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="HR">HR</SelectItem>
            </SelectContent>
          </Select>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger>
              <SelectValue placeholder="Report Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Report Types</SelectItem>
              <SelectItem value="financial">Financial & Revenue</SelectItem>
              <SelectItem value="productivity">Employee Productivity</SelectItem>
              <SelectItem value="attendance">Attendance & Leaves</SelectItem>
              <SelectItem value="projects">Project Progress</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="w-full gap-2" onClick={() => toast.info('Date picker range selected: Aug 1 - Aug 31, 2026')}>
            <CalendarIcon className="h-4 w-4" /> Aug 1 - Aug 31, 2026
          </Button>
        </CardContent>
      </Card>

      {/* Dashboard Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          title="Total Employees"
          value="67"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
          description="Active workforce"
        />
        <StatCard
          title="Active Projects"
          value="28"
          icon={Briefcase}
          trend={{ value: 8, isPositive: true }}
          description="Ongoing client work"
        />
        <StatCard
          title="Attendance Rate"
          value="95.4%"
          icon={Clock}
          trend={{ value: 3.2, isPositive: true }}
          description="Monthly average"
        />
        <StatCard
          title="Leave Requests"
          value="24"
          icon={FileText}
          trend={{ value: 5, isPositive: false }}
          description="Pending & Approved"
        />
        <StatCard
          title="Performance Score"
          value="4.85"
          icon={Award}
          trend={{ value: 4.1, isPositive: true }}
          description="Out of 5.0 rating"
        />
        <StatCard
          title="Monthly Productivity"
          value="94%"
          icon={Activity}
          trend={{ value: 6.5, isPositive: true }}
          description="Task completion rate"
        />
      </div>

      {/* Navigation Tabs for Analytics Categories */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex flex-wrap h-auto py-1">
          <TabsTrigger value="overview" className="gap-2 py-2">
            <BarChart3 className="h-4 w-4" /> Executive Overview
          </TabsTrigger>
          <TabsTrigger value="attendance" className="gap-2 py-2">
            <Clock className="h-4 w-4" /> Attendance Analytics
          </TabsTrigger>
          <TabsTrigger value="performance" className="gap-2 py-2">
            <Award className="h-4 w-4" /> Employee Performance
          </TabsTrigger>
          <TabsTrigger value="leaves" className="gap-2 py-2">
            <PieChartIcon className="h-4 w-4" /> Leave Analytics
          </TabsTrigger>
          <TabsTrigger value="projects" className="gap-2 py-2">
            <Briefcase className="h-4 w-4" /> Project Progress
          </TabsTrigger>
          <TabsTrigger value="revenue" className="gap-2 py-2">
            <DollarSign className="h-4 w-4" /> Revenue & Business
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Executive Overview */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Chart 1: Monthly Attendance Trend */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Monthly Attendance & Presence Trend</CardTitle>
                <CardDescription>Comparative analysis of present vs absent percentages across 2026</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={monthlyAttendanceData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                        color: 'hsl(var(--popover-foreground))',
                      }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="present" name="Present %" stroke="#10b981" fillOpacity={0.2} fill="#10b981" />
                    <Area type="monotone" dataKey="absent" name="Absent %" stroke="#ef4444" fillOpacity={0.2} fill="#ef4444" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Chart 2: Leave Distribution Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Leave Type Distribution</CardTitle>
                <CardDescription>Breakdown of requested leave categories</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={leaveTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                      {leaveTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Tables Section */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Table 1: Recent Reports */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Generated Reports</CardTitle>
                <CardDescription>Historical log of business intelligence documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Report Name</TableHead>
                        <TableHead>Dept</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentReports.map((rep) => (
                        <TableRow key={rep.id}>
                          <TableCell className="font-medium max-w-[200px] truncate" title={rep.name}>{rep.name}</TableCell>
                          <TableCell className="text-muted-foreground">{rep.dept}</TableCell>
                          <TableCell>
                            <Badge variant={rep.status === 'Completed' ? 'default' : 'secondary'}>
                              {rep.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="gap-1" onClick={() => toast.success(`Downloading ${rep.name}...`)}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Table 2: Top Employees */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Employees</CardTitle>
                <CardDescription>Ranked by productivity score, attendance rate, and project success</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Dept</TableHead>
                        <TableHead className="text-center">Score</TableHead>
                        <TableHead className="text-right">Attendance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topEmployees.map((emp, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{emp.name}</TableCell>
                          <TableCell className="text-muted-foreground">{emp.dept}</TableCell>
                          <TableCell className="text-center font-bold text-primary">{emp.score}</TableCell>
                          <TableCell className="text-right font-semibold text-emerald-500">{emp.attendance}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Attendance Analytics */}
        <TabsContent value="attendance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Department-Wise Attendance Statistics</CardTitle>
              <CardDescription>Present vs Absent metrics across organizational divisions</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={[
                    { dept: 'Engineering', present: 95, absent: 5 },
                    { dept: 'Design', present: 88, absent: 12 },
                    { dept: 'Marketing', present: 96, absent: 4 },
                    { dept: 'Finance', present: 92, absent: 8 },
                    { dept: 'Sales', present: 89, absent: 11 },
                    { dept: 'HR', present: 98, absent: 2 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="dept" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="present" name="Present %" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="absent" name="Absent %" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Employee Performance */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Productivity & Task Completion</CardTitle>
              <CardDescription>Aggregate performance tracking over the last 4 weeks</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={productivityData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis domain={[70, 100]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="score" name="Productivity Score" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Leave Analytics */}
        <TabsContent value="leaves" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Approved vs Rejected Leaves & Monthly Trends</CardTitle>
              <CardDescription>Detailed statistical overview of leave management outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={[
                    { month: 'May', approved: 14, rejected: 2 },
                    { month: 'Jun', approved: 18, rejected: 4 },
                    { month: 'Jul', approved: 15, rejected: 3 },
                    { month: 'Aug', approved: 22, rejected: 5 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="approved" name="Approved Leaves" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="rejected" name="Rejected Leaves" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: Project Progress */}
        <TabsContent value="projects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Projects & Deadline Tracking</CardTitle>
              <CardDescription>Real-time progress bars for major enterprise initiatives</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { name: 'E-commerce Platform Redesign', client: 'TechCorp Industries', progress: 85, deadline: '30 Aug 2026' },
                { name: 'Mobile App Development', client: 'Digital Innovations', progress: 60, deadline: '15 Sep 2026' },
                { name: 'CRM System Integration', client: 'Enterprise Solutions', progress: 45, deadline: '30 Sep 2026' },
                { name: 'Cloud Infrastructure Migration', client: 'Cloud Systems', progress: 90, deadline: '25 Aug 2026' },
              ].map((proj, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <div>
                      <span>{proj.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">({proj.client})</span>
                    </div>
                    <span>{proj.progress}% • <span className="text-muted-foreground">Due {proj.deadline}</span></span>
                  </div>
                  <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${proj.progress}%` }}
                      transition={{ duration: 1 }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 6: Revenue & Business */}
        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quarterly Revenue Growth & Business Performance</CardTitle>
              <CardDescription>Financial trajectory and client growth analytics for 2026</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    formatter={(value) => [`$${(value as number).toLocaleString()}`, 'Revenue']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" name="Total Revenue ($)" stroke="#10b981" strokeWidth={3} dot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

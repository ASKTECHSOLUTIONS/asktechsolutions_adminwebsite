import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Search,
  Download,
  Users,
  TrendingUp,
  Clock,
  FileText,
  BarChart3,
  Award,
  Calendar as CalendarIcon,
  PieChart as PieChartIcon,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
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
      initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
              <BarChart3 className="h-7 w-7 text-blue-400" /> Reports & Analytics
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">Monitor business performance, employee insights, and enterprise productivity</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExportPDF}
            className="gap-2 rounded-xl h-11 px-4 text-white border border-white/10 bg-white/5 hover:bg-white/10 transition-colors font-semibold flex items-center justify-center cursor-pointer"
          >
            <Download className="h-4 w-4 text-muted-foreground" />
            <span>Export PDF</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExportExcel}
            className="gap-2 rounded-xl h-11 px-4 text-white border border-white/10 bg-white/5 hover:bg-white/10 transition-colors font-semibold flex items-center justify-center cursor-pointer"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
            <span>Export Excel</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(59,130,246,0.4)' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            className="gap-2 rounded-xl h-11 px-5 text-white font-semibold flex items-center justify-center cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Generate Report</span>
          </motion.button>
        </div>
      </div>

      {/* Top Control Section */}
      <div className="glass-card p-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-center">
          <div className="relative rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 rounded-xl bg-white/5 border-0 text-white placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0 h-10"
            />
          </div>
          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="rounded-xl bg-white/5 border-white/10 text-white h-10 focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="Department Filter" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10 text-white rounded-xl">
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="HR">HR</SelectItem>
            </SelectContent>
          </Select>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="rounded-xl bg-white/5 border-white/10 text-white h-10 focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="Report Type" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10 text-white rounded-xl">
              <SelectItem value="all">All Report Types</SelectItem>
              <SelectItem value="financial">Financial & Revenue</SelectItem>
              <SelectItem value="productivity">Employee Productivity</SelectItem>
              <SelectItem value="attendance">Attendance & Leaves</SelectItem>
              <SelectItem value="projects">Project Progress</SelectItem>
            </SelectContent>
          </Select>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full gap-2 rounded-xl bg-white/5 border border-white/10 text-white h-10 text-xs font-semibold flex items-center justify-center cursor-pointer hover:bg-white/10"
            onClick={() => toast.info('Date picker range selected: Aug 1 - Aug 31, 2026')}
          >
            <CalendarIcon className="h-4 w-4 text-blue-400" /> Aug 1 - Aug 31, 2026
          </motion.button>
        </div>
      </div>

      {/* Dashboard Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[
          { title: 'Total Employees', value: '67', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', desc: 'Active workforce' },
          { title: 'Active Projects', value: '28', icon: Briefcase, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', desc: 'Ongoing client work' },
          { title: 'Attendance Rate', value: '95.4%', icon: Clock, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', desc: 'Monthly average' },
          { title: 'Leave Requests', value: '24', icon: FileText, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', desc: 'Pending & Approved' },
          { title: 'Performance', value: '4.85', icon: Award, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', desc: 'Out of 5.0 rating' },
          { title: 'Productivity', value: '94%', icon: Activity, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', desc: 'Task completion' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15, filter: 'blur(5px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: i * 0.04, duration: 0.4 }}
            whileHover={{ y: -3 }}
            className={`glass-card p-4 relative overflow-hidden border ${stat.border}`}
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{stat.title}</p>
                <p className="text-xl font-bold text-white mt-1.5">{stat.value}</p>
              </div>
              <div className={`p-2 rounded-xl ${stat.bg} ${stat.color} border ${stat.border}`}>
                <stat.icon className="h-4.5 w-4.5" />
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 font-semibold">{stat.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Navigation Tabs for Analytics Categories */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white/5 border border-white/10 rounded-2xl p-1 h-auto flex-wrap gap-1 text-white">
          <TabsTrigger value="overview" className="rounded-xl gap-2 text-xs font-bold py-2.5 px-4 data-[state=active]:bg-blue-600 data-[state=active]:text-white cursor-pointer">
            <BarChart3 className="h-4 w-4" /> Executive Overview
          </TabsTrigger>
          <TabsTrigger value="attendance" className="rounded-xl gap-2 text-xs font-bold py-2.5 px-4 data-[state=active]:bg-blue-600 data-[state=active]:text-white cursor-pointer">
            <Clock className="h-4 w-4" /> Attendance Analytics
          </TabsTrigger>
          <TabsTrigger value="performance" className="rounded-xl gap-2 text-xs font-bold py-2.5 px-4 data-[state=active]:bg-blue-600 data-[state=active]:text-white cursor-pointer">
            <Award className="h-4 w-4" /> Employee Performance
          </TabsTrigger>
          <TabsTrigger value="leaves" className="rounded-xl gap-2 text-xs font-bold py-2.5 px-4 data-[state=active]:bg-blue-600 data-[state=active]:text-white cursor-pointer">
            <PieChartIcon className="h-4 w-4" /> Leave Analytics
          </TabsTrigger>
          <TabsTrigger value="projects" className="rounded-xl gap-2 text-xs font-bold py-2.5 px-4 data-[state=active]:bg-blue-600 data-[state=active]:text-white cursor-pointer">
            <Briefcase className="h-4 w-4" /> Project Progress
          </TabsTrigger>
          <TabsTrigger value="revenue" className="rounded-xl gap-2 text-xs font-bold py-2.5 px-4 data-[state=active]:bg-blue-600 data-[state=active]:text-white cursor-pointer">
            <DollarSign className="h-4 w-4" /> Revenue & Business
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Executive Overview */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Chart 1: Monthly Attendance Trend */}
            <div className="lg:col-span-2 glass-card p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="mb-4">
                <h3 className="text-sm font-bold text-white">Monthly Attendance & Presence Trend</h3>
                <p className="text-xs text-muted-foreground mt-0.5 font-semibold">Comparative analysis of present vs absent percentages across 2026</p>
              </div>
              <div>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={monthlyAttendanceData}>
                    <defs>
                      <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '600' }} />
                    <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '600' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '16px',
                        color: '#fff',
                        fontSize: '11px',
                        fontWeight: '600',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11, fontWeight: '600', color: '#fff' }} />
                    <Area type="monotone" dataKey="present" name="Present %" stroke="#10b981" fillOpacity={1} fill="url(#colorPresent)" strokeWidth={2} />
                    <Area type="monotone" dataKey="absent" name="Absent %" stroke="#ef4444" fillOpacity={1} fill="url(#colorAbsent)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Leave Distribution Pie Chart */}
            <div className="glass-card p-5 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="mb-4">
                <h3 className="text-sm font-bold text-white">Leave Type Distribution</h3>
                <p className="text-xs text-muted-foreground mt-0.5 font-semibold">Breakdown of requested leave categories</p>
              </div>
              <div className="flex flex-col items-center justify-center flex-1">
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={leaveTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} innerRadius={50} paddingAngle={4} label={{ fill: '#fff', fontSize: 10, fontWeight: '600' }}>
                      {leaveTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        fontSize: '11px',
                        color: '#fff',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 10, fontWeight: '600' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Tables Section */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Table 1: Recent Reports */}
            <div className="glass-card overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="p-5">
                <h3 className="text-sm font-bold text-white">Recent Generated Reports</h3>
                <p className="text-xs text-muted-foreground mt-0.5 font-semibold">Historical log of business intelligence documents</p>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="border-b border-white/06 bg-white/02">
                    <TableRow className="hover:bg-transparent border-b-0">
                      <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-3">Report Name</TableHead>
                      <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-3">Dept</TableHead>
                      <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-3">Status</TableHead>
                      <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-3 text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentReports.map((rep) => (
                      <TableRow key={rep.id} className="border-b border-white/04 hover:bg-white/02 transition-colors duration-200">
                        <TableCell className="font-bold text-white text-xs max-w-[200px] truncate" title={rep.name}>{rep.name}</TableCell>
                        <TableCell className="text-slate-300 font-semibold text-xs">{rep.dept}</TableCell>
                        <TableCell>
                          <Badge className={rep.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}>
                            {rep.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-white/10 text-muted-foreground hover:text-foreground cursor-pointer"
                            onClick={() => toast.success(`Downloading ${rep.name}...`)}
                          >
                            <Download className="h-4 w-4 text-blue-400" />
                          </motion.button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Table 2: Top Employees */}
            <div className="glass-card overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="p-5">
                <h3 className="text-sm font-bold text-white">Top Performing Employees</h3>
                <p className="text-xs text-muted-foreground mt-0.5 font-semibold">Ranked by productivity score, attendance rate, and project success</p>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="border-b border-white/06 bg-white/02">
                    <TableRow className="hover:bg-transparent border-b-0">
                      <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-3">Employee</TableHead>
                      <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-3">Dept</TableHead>
                      <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-3 text-center">Score</TableHead>
                      <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-3 text-right">Attendance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topEmployees.map((emp, idx) => (
                      <TableRow key={idx} className="border-b border-white/04 hover:bg-white/02 transition-colors duration-200">
                        <TableCell className="font-bold text-white text-xs">{emp.name}</TableCell>
                        <TableCell className="text-slate-300 font-semibold text-xs">{emp.dept}</TableCell>
                        <TableCell className="text-center font-extrabold text-blue-400 text-xs">{emp.score}</TableCell>
                        <TableCell className="text-right font-extrabold text-emerald-400 text-xs">{emp.attendance}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Attendance Analytics */}
        <TabsContent value="attendance" className="space-y-6">
          <div className="glass-card p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="mb-4">
              <h3 className="text-sm font-bold text-white">Department-Wise Attendance Statistics</h3>
              <p className="text-xs text-muted-foreground mt-0.5 font-semibold">Present vs Absent metrics across organizational divisions</p>
            </div>
            <div>
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
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="dept" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '600' }} />
                  <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '600' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      fontSize: '11px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, fontWeight: '600' }} />
                  <Bar dataKey="present" name="Present %" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="absent" name="Absent %" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: Employee Performance */}
        <TabsContent value="performance" className="space-y-6">
          <div className="glass-card p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="mb-4">
              <h3 className="text-sm font-bold text-white">Weekly Productivity & Task Completion</h3>
              <p className="text-xs text-muted-foreground mt-0.5 font-semibold">Aggregate performance tracking over the last 4 weeks</p>
            </div>
            <div>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={productivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '600' }} />
                  <YAxis domain={[70, 100]} stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '600' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      fontSize: '11px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, fontWeight: '600' }} />
                  <Line type="monotone" dataKey="score" name="Productivity Score" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        {/* Tab 4: Leave Analytics */}
        <TabsContent value="leaves" className="space-y-6">
          <div className="glass-card p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="mb-4">
              <h3 className="text-sm font-bold text-white">Approved vs Rejected Leaves & Monthly Trends</h3>
              <p className="text-xs text-muted-foreground mt-0.5 font-semibold">Detailed statistical overview of leave management outcomes</p>
            </div>
            <div>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={[
                    { month: 'May', approved: 14, rejected: 2 },
                    { month: 'Jun', approved: 18, rejected: 4 },
                    { month: 'Jul', approved: 15, rejected: 3 },
                    { month: 'Aug', approved: 22, rejected: 5 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '600' }} />
                  <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '600' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      fontSize: '11px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, fontWeight: '600' }} />
                  <Bar dataKey="approved" name="Approved Leaves" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="rejected" name="Rejected Leaves" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        {/* Tab 5: Project Progress */}
        <TabsContent value="projects" className="space-y-6">
          <div className="glass-card p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="mb-6">
              <h3 className="text-sm font-bold text-white">Active Projects & Deadline Tracking</h3>
              <p className="text-xs text-muted-foreground mt-0.5 font-semibold">Real-time progress bars for major enterprise initiatives</p>
            </div>
            <div className="space-y-6">
              {[
                { name: 'E-commerce Platform Redesign', client: 'TechCorp Industries', progress: 85, deadline: '30 Aug 2026', color: 'from-blue-500 to-cyan-400' },
                { name: 'Mobile App Development', client: 'Digital Innovations', progress: 60, deadline: '15 Sep 2026', color: 'from-purple-500 to-pink-500' },
                { name: 'CRM System Integration', client: 'Enterprise Solutions', progress: 45, deadline: '30 Sep 2026', color: 'from-amber-500 to-orange-500' },
                { name: 'Cloud Infrastructure Migration', client: 'Cloud Systems', progress: 90, deadline: '25 Aug 2026', color: 'from-emerald-500 to-teal-450' },
              ].map((proj, idx) => (
                <div key={idx} className="space-y-2 font-semibold">
                  <div className="flex justify-between text-xs">
                    <div>
                      <span className="text-white text-sm font-bold">{proj.name}</span>
                      <span className="text-[11px] text-muted-foreground ml-2">({proj.client})</span>
                    </div>
                    <span className="text-slate-300 text-xs font-bold">{proj.progress}% • <span className="text-muted-foreground font-semibold">Due {proj.deadline}</span></span>
                  </div>
                  <div className="h-2.5 w-full bg-white/5 border border-white/06 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${proj.progress}%` }}
                      transition={{ duration: 1 }}
                      className={`h-full bg-gradient-to-r ${proj.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Tab 6: Revenue & Business */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="glass-card p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="mb-4">
              <h3 className="text-sm font-bold text-white">Quarterly Revenue Growth & Business Performance</h3>
              <p className="text-xs text-muted-foreground mt-0.5 font-semibold">Financial trajectory and client growth analytics for 2026</p>
            </div>
            <div>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '600' }} />
                  <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '600' }} />
                  <Tooltip
                    formatter={(value) => [`$${(value as number).toLocaleString()}`, 'Revenue']}
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      fontSize: '11px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, fontWeight: '600' }} />
                  <Line type="monotone" dataKey="revenue" name="Total Revenue ($)" stroke="#10b981" strokeWidth={3} dot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

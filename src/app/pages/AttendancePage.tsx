import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Download,
  BarChart3,
  Calendar as CalendarIcon,
  UserCheck,
  FileText,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
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
import { toast } from 'sonner';

interface AttendanceRecord {
  id: string;
  name: string;
  email: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'Present' | 'Absent' | 'Late';
  workHours: string;
}

const initialAttendanceData: AttendanceRecord[] = [
  { id: '1', name: 'John Anderson', email: 'john.anderson@asktech.com', date: '16 Aug 2026', checkIn: '9:05 AM', checkOut: '6:10 PM', status: 'Present', workHours: '9h 5m' },
  { id: '2', name: 'Sarah Mitchell', email: 'sarah.mitchell@asktech.com', date: '16 Aug 2026', checkIn: '9:35 AM', checkOut: '6:30 PM', status: 'Late', workHours: '8h 55m' },
  { id: '3', name: 'Michael Chen', email: 'michael.chen@asktech.com', date: '16 Aug 2026', checkIn: '-', checkOut: '-', status: 'Absent', workHours: '-' },
  { id: '4', name: 'Emily Rodriguez', email: 'emily.rodriguez@asktech.com', date: '16 Aug 2026', checkIn: '8:55 AM', checkOut: '5:55 PM', status: 'Present', workHours: '9h 0m' },
  { id: '5', name: 'David Thompson', email: 'david.thompson@asktech.com', date: '16 Aug 2026', checkIn: '9:15 AM', checkOut: '6:20 PM', status: 'Late', workHours: '9h 5m' },
  { id: '6', name: 'Jessica Brown', email: 'jessica.b@asktech.com', date: '16 Aug 2026', checkIn: '8:50 AM', checkOut: '6:00 PM', status: 'Present', workHours: '9h 10m' },
  { id: '7', name: 'Robert Williams', email: 'robert.w@asktech.com', date: '16 Aug 2026', checkIn: '9:02 AM', checkOut: '6:05 PM', status: 'Present', workHours: '9h 3m' },
  { id: '8', name: 'William Davis', email: 'william.d@asktech.com', date: '16 Aug 2026', checkIn: '-', checkOut: '-', status: 'Absent', workHours: '-' },
];

const monthlyRecords = [
  { name: 'John Anderson', presentDays: 21, absentDays: 1, lateDays: 1, attendanceRate: '95%', avgHours: '9.2 hrs' },
  { name: 'Sarah Mitchell', presentDays: 19, absentDays: 1, lateDays: 3, attendanceRate: '88%', avgHours: '8.8 hrs' },
  { name: 'Michael Chen', presentDays: 15, absentDays: 5, lateDays: 2, attendanceRate: '75%', avgHours: '8.5 hrs' },
  { name: 'Emily Rodriguez', presentDays: 22, absentDays: 0, lateDays: 0, attendanceRate: '100%', avgHours: '9.1 hrs' },
  { name: 'David Thompson', presentDays: 20, absentDays: 1, lateDays: 2, attendanceRate: '91%', avgHours: '9.0 hrs' },
];

export function AttendancePage({ onBack }: { onBack: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('daily');

  const filteredData = initialAttendanceData.filter((record) => {
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          record.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'Present':
        return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 border font-bold">Present</Badge>;
      case 'Late':
        return <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 border font-bold">Late</Badge>;
      case 'Absent':
        return <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20 border font-bold">Absent</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
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
              <Clock className="h-7 w-7 text-blue-400" /> Attendance Management
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">Monitor daily check-ins, check-outs, and monthly records</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="gap-2 rounded-xl h-10 px-4 text-white border border-white/10 bg-white/5 hover:bg-white/10 transition-colors font-semibold flex items-center justify-center cursor-pointer text-xs"
            onClick={() => toast.info('Selected date: 16 Aug 2026')}
          >
            <CalendarIcon className="h-4 w-4 text-blue-400" />
            <span>16 Aug 2026</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(59,130,246,0.4)' }}
            whileTap={{ scale: 0.98 }}
            className="gap-2 rounded-xl h-10 px-4 text-white font-semibold flex items-center justify-center cursor-pointer text-xs"
            style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}
            onClick={() => toast.success('Attendance report exported successfully.')}
          >
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </motion.button>
        </div>
      </div>

      {/* Today's Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { title: 'Total Employees', value: '67', icon: UserCheck, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', desc: 'Active workforce' },
          { title: 'Present Today', value: '54', icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', desc: '80.6% on-time attendance' },
          { title: 'Late Arrivals', value: '5', icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', desc: 'Checked in after 9:15 AM' },
          { title: 'Absent / On Leave', value: '8', icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', desc: 'Currently unavailable' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15, }}
            animate={{ opacity: 1, y: 0, }}
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
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} border ${stat.border}`}>
                <stat.icon className="h-4.5 w-4.5" />
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 font-semibold">{stat.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabs & Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="bg-white/5 border border-white/10 rounded-2xl p-1 h-auto flex-wrap gap-1 text-white">
            <TabsTrigger value="daily" className="rounded-xl gap-2 text-xs font-bold py-2.5 px-4 data-[state=active]:bg-blue-600 data-[state=active]:text-white cursor-pointer">
              <Clock className="h-4 w-4" /> Daily Attendance
            </TabsTrigger>
            <TabsTrigger value="monthly" className="rounded-xl gap-2 text-xs font-bold py-2.5 px-4 data-[state=active]:bg-blue-600 data-[state=active]:text-white cursor-pointer">
              <CalendarIcon className="h-4 w-4" /> Monthly Records
            </TabsTrigger>
            <TabsTrigger value="reports" className="rounded-xl gap-2 text-xs font-bold py-2.5 px-4 data-[state=active]:bg-blue-600 data-[state=active]:text-white cursor-pointer">
              <BarChart3 className="h-4 w-4" /> Analytics & Reports
            </TabsTrigger>
          </TabsList>

          {activeTab === 'daily' && (
            <div className="flex items-center gap-3">
              <div className="relative w-64 rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employee..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 rounded-xl bg-white/5 border-0 text-white placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0 h-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] rounded-xl bg-white/5 border-white/10 text-white h-10 focus:ring-0 focus:ring-offset-0">
                  <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10 text-white rounded-xl">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Present">Present</SelectItem>
                  <SelectItem value="Late">Late</SelectItem>
                  <SelectItem value="Absent">Absent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Tab 1: Daily Attendance List */}
        <TabsContent value="daily" className="space-y-4">
          <div className="glass-card overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="p-5">
              <h3 className="text-sm font-bold text-white">Employee Check-In & Check-Out Timings</h3>
              <p className="text-xs text-muted-foreground mt-0.5 font-semibold">Real-time attendance tracking for 16 Aug 2026</p>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="border-b border-white/06 bg-white/02">
                  <TableRow className="hover:bg-transparent border-b-0">
                    <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-3">Employee</TableHead>
                    <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-3">Date</TableHead>
                    <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-3">Check In</TableHead>
                    <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-3">Check Out</TableHead>
                    <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-3">Work Hours</TableHead>
                    <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-3">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence mode="popLayout">
                    {filteredData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12 text-muted-foreground font-semibold">
                          No attendance records found matching your criteria.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredData.map((record) => (
                        <TableRow key={record.id} className="group border-b border-white/04 hover:bg-white/02 transition-colors duration-200">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9 border border-white/10">
                                <AvatarFallback className="bg-blue-500/10 text-blue-400 font-bold">
                                  {record.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-bold text-white text-xs group-hover:text-blue-400 transition-colors">{record.name}</p>
                                <p className="text-[10px] text-muted-foreground mt-0.5 font-semibold">{record.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-300 font-semibold text-xs">{record.date}</TableCell>
                          <TableCell className="font-bold text-white text-xs">{record.checkIn}</TableCell>
                          <TableCell className="font-bold text-white text-xs">{record.checkOut}</TableCell>
                          <TableCell className="text-slate-300 font-semibold text-xs">{record.workHours}</TableCell>
                          <TableCell>{getStatusBadge(record.status)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Monthly Records */}
        <TabsContent value="monthly" className="space-y-6">
          <div className="glass-card overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="p-5">
              <h3 className="text-sm font-bold text-white">Monthly Attendance Records</h3>
              <p className="text-xs text-muted-foreground mt-0.5 font-semibold">Summary of employee attendance for August 2026</p>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="border-b border-white/06 bg-white/02">
                  <TableRow className="hover:bg-transparent border-b-0">
                    <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-3">Employee</TableHead>
                    <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-3 text-center">Present Days</TableHead>
                    <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-3 text-center">Late Days</TableHead>
                    <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-3 text-center">Absent Days</TableHead>
                    <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-3 text-center">Avg. Daily Hours</TableHead>
                    <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-3 text-right">Attendance Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlyRecords.map((record, index) => (
                    <TableRow key={index} className="border-b border-white/04 hover:bg-white/02 transition-colors duration-200">
                      <TableCell className="font-bold text-white text-xs">{record.name}</TableCell>
                      <TableCell className="text-center text-emerald-400 font-bold text-xs">{record.presentDays}</TableCell>
                      <TableCell className="text-center text-amber-400 font-bold text-xs">{record.lateDays}</TableCell>
                      <TableCell className="text-center text-rose-400 font-bold text-xs">{record.absentDays}</TableCell>
                      <TableCell className="text-center text-slate-300 font-semibold text-xs">{record.avgHours}</TableCell>
                      <TableCell className="text-right font-extrabold text-blue-400 text-xs">{record.attendanceRate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: Analytics & Reports */}
        <TabsContent value="reports" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="glass-card p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="mb-6">
                <h3 className="text-sm font-bold text-white">Attendance Percentage Overview</h3>
                <p className="text-xs text-muted-foreground mt-0.5 font-semibold">Monthly target vs actual attendance percentage</p>
              </div>
              <div className="space-y-6 font-semibold">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white">Engineering Department</span>
                    <span className="text-blue-400 font-bold">92%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 border border-white/06 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 w-[92%]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white">Design Department</span>
                    <span className="text-purple-400 font-bold">88%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 border border-white/06 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 w-[88%]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white">Marketing Department</span>
                    <span className="text-emerald-400 font-bold">95%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 border border-white/06 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-450 w-[95%]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="mb-6">
                <h3 className="text-sm font-bold text-white">Report Generation</h3>
                <p className="text-xs text-muted-foreground mt-0.5 font-semibold">Download detailed attendance logs and payroll summaries</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 bg-white/5 border border-white/04 rounded-2xl hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="text-xs font-bold text-white">August 2026 Complete Attendance Log</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 font-semibold">PDF • 2.4 MB</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="gap-2 rounded-xl h-9 px-3.5 text-white border border-white/10 bg-white/5 hover:bg-white/10 transition-colors font-semibold flex items-center justify-center cursor-pointer text-xs"
                    onClick={() => toast.success('Downloaded August Complete Attendance Log')}
                  >
                    <Download className="h-4 w-4 text-blue-450" /> Download
                  </motion.button>
                </div>
                <div className="flex items-center justify-between p-3.5 bg-white/5 border border-white/04 rounded-2xl hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="text-xs font-bold text-white">Late Arrival & Overtime Summary</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 font-semibold">CSV • 1.1 MB</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="gap-2 rounded-xl h-9 px-3.5 text-white border border-white/10 bg-white/5 hover:bg-white/10 transition-colors font-semibold flex items-center justify-center cursor-pointer text-xs"
                    onClick={() => toast.success('Downloaded Late Arrival & Overtime Summary')}
                  >
                    <Download className="h-4 w-4 text-blue-450" /> Download
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

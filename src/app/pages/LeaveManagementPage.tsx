import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Search,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar as CalendarIcon,
  UserCheck,
  FileText,
  Eye,
  Check,
  X,
  Briefcase,
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

interface LeaveRequestItem {
  id: string;
  name: string;
  email: string;
  department: string;
  leaveType: 'Sick Leave' | 'Casual Leave' | 'Paid Leave' | 'Emergency Leave';
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const initialLeaveRequests: LeaveRequestItem[] = [
  {
    id: 'REQ-001',
    name: 'Michael Chen',
    email: 'michael.chen@asktech.com',
    department: 'Engineering',
    leaveType: 'Sick Leave',
    startDate: '2026-08-20',
    endDate: '2026-08-22',
    totalDays: 3,
    reason: 'Viral fever and doctor consultation',
    status: 'Pending',
  },
  {
    id: 'REQ-002',
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@asktech.com',
    department: 'Design',
    leaveType: 'Casual Leave',
    startDate: '2026-08-25',
    endDate: '2026-08-26',
    totalDays: 2,
    reason: 'Family function out of station',
    status: 'Approved',
  },
  {
    id: 'REQ-003',
    name: 'David Thompson',
    email: 'david.thompson@asktech.com',
    department: 'Engineering',
    leaveType: 'Paid Leave',
    startDate: '2026-09-01',
    endDate: '2026-09-05',
    totalDays: 5,
    reason: 'Annual family vacation',
    status: 'Pending',
  },
  {
    id: 'REQ-004',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@asktech.com',
    department: 'Marketing',
    leaveType: 'Emergency Leave',
    startDate: '2026-08-16',
    endDate: '2026-08-16',
    totalDays: 1,
    reason: 'Urgent personal medical emergency',
    status: 'Approved',
  },
  {
    id: 'REQ-005',
    name: 'John Anderson',
    email: 'john.anderson@asktech.com',
    department: 'Engineering',
    leaveType: 'Casual Leave',
    startDate: '2026-08-12',
    endDate: '2026-08-14',
    totalDays: 3,
    reason: 'Personal work',
    status: 'Rejected',
  },
  {
    id: 'REQ-006',
    name: 'Jessica Brown',
    email: 'jessica.b@asktech.com',
    department: 'Sales',
    leaveType: 'Sick Leave',
    startDate: '2026-08-28',
    endDate: '2026-08-29',
    totalDays: 2,
    reason: 'Dental surgery',
    status: 'Pending',
  },
  {
    id: 'REQ-007',
    name: 'Robert Williams',
    email: 'robert.w@asktech.com',
    department: 'HR',
    leaveType: 'Paid Leave',
    startDate: '2026-09-10',
    endDate: '2026-09-15',
    totalDays: 6,
    reason: 'Trip to hometown',
    status: 'Approved',
  },
];

const leaveBalances = [
  { name: 'Michael Chen', dept: 'Engineering', sick: 8, casual: 5, paid: 15, emergency: 3 },
  { name: 'Sarah Mitchell', dept: 'Design', sick: 10, casual: 4, paid: 18, emergency: 4 },
  { name: 'David Thompson', dept: 'Engineering', sick: 5, casual: 6, paid: 12, emergency: 2 },
  { name: 'Emily Rodriguez', dept: 'Marketing', sick: 12, casual: 8, paid: 20, emergency: 4 },
  { name: 'John Anderson', dept: 'Engineering', sick: 7, casual: 3, paid: 14, emergency: 3 },
];

export function LeaveManagementPage({ onBack }: { onBack: () => void }) {
  const [requests, setRequests] = useState<LeaveRequestItem[]>(initialLeaveRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('requests');

  const filteredRequests = requests.filter((req) => {
    const matchesSearch = req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || req.leaveType === typeFilter;
    const matchesDept = deptFilter === 'all' || req.department === deptFilter;
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    return matchesSearch && matchesType && matchesDept && matchesStatus;
  });

  const handleApprove = (id: string, name: string) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status: 'Approved' } : req));
    toast.success(`Leave request for ${name} approved successfully!`);
  };

  const handleReject = (id: string, name: string) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status: 'Rejected' } : req));
    toast.error(`Leave request for ${name} rejected.`);
  };

  const handleViewDetails = (req: LeaveRequestItem) => {
    toast.info(`Details for ${req.name}`, {
      description: `Type: ${req.leaveType} | Duration: ${req.totalDays} Days | Reason: ${req.reason}`
    });
  };

  return (
    <div className="space-y-6">
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
              <CalendarIcon className="h-7 w-7 text-blue-400" /> Leave Management
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage employee leave requests and approvals</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toast.success('Filter criteria applied.')}
            className="gap-2 rounded-xl h-11 px-4 text-white border border-white/10 bg-white/5 hover:bg-white/10 transition-colors font-semibold flex items-center justify-center cursor-pointer"
          >
            <Search className="h-4 w-4 text-muted-foreground" />
            <span>Apply Filter</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(59,130,246,0.4)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toast.success('Leave report exported successfully.')}
            className="gap-2 rounded-xl h-11 px-5 text-white font-semibold flex items-center justify-center cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}
          >
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </motion.button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { title: 'Total Requests', value: requests.length.toString(), icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', desc: 'All time requests' },
          { title: 'Pending Approvals', value: requests.filter(r => r.status === 'Pending').length.toString(), icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', desc: 'Requires attention' },
          { title: 'Approved Leaves', value: requests.filter(r => r.status === 'Approved').length.toString(), icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', desc: 'Granted leaves' },
          { title: 'Out of Office Today', value: '8', icon: UserCheck, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', desc: 'Currently active' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15, }}
            animate={{ opacity: 1, y: 0, }}
            transition={{ delay: i * 0.04, duration: 0.4 }}
            whileHover={{ y: -3 }}
            className={`glass-card p-4.5 relative overflow-hidden border ${stat.border}`}
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

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white/5 border border-white/10 rounded-2xl p-1 h-auto flex-wrap gap-1 text-white">
          <TabsTrigger value="requests" className="rounded-xl gap-2 text-xs font-bold py-2.5 px-4 data-[state=active]:bg-blue-600 data-[state=active]:text-white cursor-pointer">
            <FileText className="h-4 w-4" /> Leave Requests
          </TabsTrigger>
          <TabsTrigger value="balances" className="rounded-xl gap-2 text-xs font-bold py-2.5 px-4 data-[state=active]:bg-blue-600 data-[state=active]:text-white cursor-pointer">
            <Briefcase className="h-4 w-4" /> Leave Balance Overview
          </TabsTrigger>
          <TabsTrigger value="calendar" className="rounded-xl gap-2 text-xs font-bold py-2.5 px-4 data-[state=active]:bg-blue-600 data-[state=active]:text-white cursor-pointer">
            <CalendarIcon className="h-4 w-4" /> Leave Calendar
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-xl gap-2 text-xs font-bold py-2.5 px-4 data-[state=active]:bg-blue-600 data-[state=active]:text-white cursor-pointer">
            <Clock className="h-4 w-4" /> Employee Leave History
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Leave Requests */}
        <TabsContent value="requests" className="space-y-6">
          {/* Top Filter Section */}
          <div className="glass-card p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 items-center">
              <div className="relative rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 rounded-xl bg-white/5 border-0 text-white placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0 h-10"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="rounded-xl bg-white/5 border-white/10 text-white h-10 focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="Leave Type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10 text-white rounded-xl">
                  <SelectItem value="all">All Leave Types</SelectItem>
                  <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                  <SelectItem value="Casual Leave">Casual Leave</SelectItem>
                  <SelectItem value="Paid Leave">Paid Leave</SelectItem>
                  <SelectItem value="Emergency Leave">Emergency Leave</SelectItem>
                </SelectContent>
              </Select>
              <Select value={deptFilter} onValueChange={setDeptFilter}>
                <SelectTrigger className="rounded-xl bg-white/5 border-white/10 text-white h-10 focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10 text-white rounded-xl">
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="rounded-xl bg-white/5 border-white/10 text-white h-10 focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10 text-white rounded-xl">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full gap-2 rounded-xl bg-white/5 border border-white/10 text-white h-10 text-xs font-semibold flex items-center justify-center cursor-pointer hover:bg-white/10"
                  onClick={() => { setSearchTerm(''); setTypeFilter('all'); setDeptFilter('all'); setStatusFilter('all'); toast.info('Filters reset.'); }}
                >
                  <X className="h-4 w-4 text-rose-450" /> Reset Filters
                </motion.button>
              </div>
            </div>
          </div>

          {/* Main Table */}
          <div className="glass-card overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="p-5">
              <h3 className="text-sm font-bold text-white">Employee Leave Requests</h3>
              <p className="text-xs text-muted-foreground mt-0.5 font-semibold">Comprehensive list of submitted leave applications</p>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="border-b border-white/06 bg-white/02">
                  <TableRow className="hover:bg-transparent border-b-0">
                    <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-3">Employee</TableHead>
                    <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-3">Department</TableHead>
                    <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-3">Leave Type</TableHead>
                    <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-3">Start Date</TableHead>
                    <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-3">End Date</TableHead>
                    <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-3 text-center">Total Days</TableHead>
                    <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-3">Reason</TableHead>
                    <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-3">Status</TableHead>
                    <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-3 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence mode="popLayout">
                    {filteredRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-12 text-muted-foreground font-semibold">
                          No leave requests matching your search or filter criteria.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRequests.map((req, i) => (
                        <TableRow key={req.id} className="group border-b border-white/04 hover:bg-white/02 transition-colors duration-200">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9 border border-white/10">
                                <AvatarFallback className="bg-blue-500/10 text-blue-400 font-bold">
                                  {req.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-bold text-white text-xs group-hover:text-blue-400 transition-colors">{req.name}</p>
                                <p className="text-[10px] text-muted-foreground mt-0.5 font-semibold">{req.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-300 font-semibold text-xs">{req.department}</TableCell>
                          <TableCell>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border border-white/10 bg-white/5 text-slate-300 uppercase tracking-wider">
                              {req.leaveType}
                            </span>
                          </TableCell>
                          <TableCell className="font-semibold text-white text-xs">{req.startDate}</TableCell>
                          <TableCell className="font-semibold text-white text-xs">{req.endDate}</TableCell>
                          <TableCell className="text-center font-bold text-xs text-white">{req.totalDays}</TableCell>
                          <TableCell className="max-w-[185px] truncate text-slate-400 font-semibold text-xs" title={req.reason}>
                            {req.reason}
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              req.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                              req.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                              'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }>
                              {req.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              {req.status === 'Pending' && (
                                <>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-emerald-500/10 text-muted-foreground hover:text-emerald-400 cursor-pointer"
                                    onClick={() => handleApprove(req.id, req.name)}
                                    title="Approve"
                                  >
                                    <Check className="h-4.5 w-4.5" />
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-rose-500/10 text-muted-foreground hover:text-rose-400 cursor-pointer"
                                    onClick={() => handleReject(req.id, req.name)}
                                    title="Reject"
                                  >
                                    <X className="h-4.5 w-4.5" />
                                  </motion.button>
                                </>
                              )}
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-white/10 text-muted-foreground hover:text-foreground cursor-pointer"
                                onClick={() => handleViewDetails(req)}
                                title="View Details"
                              >
                                <Eye className="h-4.5 w-4.5 text-blue-400" />
                              </motion.button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between p-5 text-xs text-muted-foreground font-semibold border-t border-white/06">
              <p>Showing {filteredRequests.length} of {requests.length} leave requests</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="rounded-lg bg-white/5 border-white/10 hover:bg-white/10" disabled>Previous</Button>
                <Button variant="outline" size="sm" className="rounded-lg bg-blue-600 border-0 text-white font-bold">1</Button>
                <Button variant="outline" size="sm" className="rounded-lg bg-white/5 border-white/10 hover:bg-white/10" disabled>Next</Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Leave Balance Overview */}
        <TabsContent value="balances" className="space-y-6">
          <div className="glass-card overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="p-5">
              <h3 className="text-sm font-bold text-white">Employee Leave Balances</h3>
              <p className="text-xs text-muted-foreground mt-0.5 font-semibold">Remaining allocated leave quotas per employee</p>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="border-b border-white/06 bg-white/02">
                  <TableRow className="hover:bg-transparent border-b-0">
                    <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-3">Employee</TableHead>
                    <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-3">Department</TableHead>
                    <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-3 text-center">Sick Leave (Remaining)</TableHead>
                    <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-3 text-center">Casual Leave (Remaining)</TableHead>
                    <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-3 text-center">Paid Leave (Remaining)</TableHead>
                    <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-3 text-center">Emergency Leave (Remaining)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveBalances.map((bal, index) => (
                    <TableRow key={index} className="border-b border-white/04 hover:bg-white/02 transition-colors duration-200">
                      <TableCell className="font-bold text-white text-xs">{bal.name}</TableCell>
                      <TableCell className="text-slate-300 font-semibold text-xs">{bal.dept}</TableCell>
                      <TableCell className="text-center font-extrabold text-blue-400 text-xs">{bal.sick} days</TableCell>
                      <TableCell className="text-center font-extrabold text-amber-400 text-xs">{bal.casual} days</TableCell>
                      <TableCell className="text-center font-extrabold text-emerald-400 text-xs">{bal.paid} days</TableCell>
                      <TableCell className="text-center font-extrabold text-rose-400 text-xs">{bal.emergency} days</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: Leave Calendar */}
        <TabsContent value="calendar" className="space-y-6">
          <div className="glass-card p-6 relative overflow-hidden text-center space-y-4">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <CalendarIcon className="h-14 w-14 mx-auto text-blue-400 opacity-80 animate-pulse" />
            <h3 className="text-lg font-bold text-white">Enterprise Calendar Sync Active</h3>
            <p className="text-slate-400 max-w-md mx-auto text-xs font-semibold leading-relaxed">
              The interactive multi-month enterprise leave schedule is currently synchronized with Google Workspace & Microsoft Outlook calendars.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="gap-2 rounded-xl h-10 px-4 text-white border border-white/10 bg-white/5 hover:bg-white/10 transition-colors font-semibold flex items-center justify-center cursor-pointer text-xs"
                onClick={() => toast.info('Calendar monthly perspective toggled.')}
              >
                <CalendarIcon className="h-4 w-4 text-blue-400" /> Month View
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="gap-2 rounded-xl h-10 px-4 text-white border border-white/10 bg-white/5 hover:bg-white/10 transition-colors font-semibold flex items-center justify-center cursor-pointer text-xs"
                onClick={() => toast.success('Calendar ICS Feed file generated successfully.')}
              >
                <Download className="h-4 w-4 text-emerald-400" /> Export ICS Feed
              </motion.button>
            </div>
          </div>
        </TabsContent>

        {/* Tab 4: Employee Leave History */}
        <TabsContent value="history" className="space-y-6">
          <div className="glass-card p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="mb-4">
              <h3 className="text-sm font-bold text-white">Recent Leave Activities & Historical Archives</h3>
              <p className="text-xs text-muted-foreground mt-0.5 font-semibold">Log of past approved leaves and system actions</p>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Michael Chen', action: 'Approved 3 days Sick Leave', time: 'Yesterday, 4:30 PM', approver: 'Admin (System)' },
                { name: 'Emily Rodriguez', action: 'Approved 1 day Emergency Leave', time: '16 Aug 2026', approver: 'HR Manager' },
                { name: 'John Anderson', action: 'Rejected 3 days Casual Leave', time: '12 Aug 2026', approver: 'Engineering Lead' },
                { name: 'Sarah Mitchell', action: 'Approved 2 days Casual Leave', time: '10 Aug 2026', approver: 'Design Director' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-white/5 border border-white/04 rounded-2xl hover:bg-white/10 transition-all duration-200">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-9 w-9 border border-white/10">
                      <AvatarFallback className="bg-blue-500/10 text-blue-400 font-bold">
                        {item.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-white text-xs">{item.name}</p>
                      <p className="text-[11px] text-muted-foreground mt-1 font-semibold">
                        {item.action} • Approved by <span className="text-slate-300 font-bold">{item.approver}</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-semibold">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Search,
  Filter,
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
  Building2,
  User,
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { StatCard } from '../components/dashboard/StatCard';
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

  const getStatusBadge = (status: LeaveRequestItem['status']) => {
    switch (status) {
      case 'Pending':
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 border">Pending</Badge>;
      case 'Approved':
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 border">Approved</Badge>;
      case 'Rejected':
        return <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 border">Rejected</Badge>;
    }
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
            <h1 className="text-3xl font-bold">Leave Management</h1>
            <p className="text-muted-foreground">Manage employee leave requests and approvals</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2" onClick={() => toast.success('Filter criteria applied.')}>
            <Filter className="h-4 w-4" />
            <span>Apply Filter</span>
          </Button>
          <Button className="gap-2" onClick={() => toast.success('Leave report exported successfully.')}>
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Leave Requests"
          value={requests.length.toString()}
          icon={FileText}
          description="All time requests"
        />
        <StatCard
          title="Pending Approvals"
          value={requests.filter(r => r.status === 'Pending').length.toString()}
          icon={Clock}
          description="Require attention"
        />
        <StatCard
          title="Approved Leaves"
          value={requests.filter(r => r.status === 'Approved').length.toString()}
          icon={CheckCircle2}
          trend={{ value: 12, isPositive: true }}
          description="Successfully granted"
        />
        <StatCard
          title="Employees On Leave Today"
          value="8"
          icon={UserCheck}
          description="Currently out of office"
        />
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="requests" className="gap-2">
            <FileText className="h-4 w-4" />
            Leave Requests
          </TabsTrigger>
          <TabsTrigger value="balances" className="gap-2">
            <Briefcase className="h-4 w-4" />
            Leave Balance Overview
          </TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            Leave Calendar
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <Clock className="h-4 w-4" />
            Employee Leave History
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Leave Requests Table & Filters */}
        <TabsContent value="requests" className="space-y-6">
          {/* Top Filter Section */}
          <Card className="bg-card">
            <CardContent className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-5 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-input-background"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Leave Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Leave Types</SelectItem>
                  <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                  <SelectItem value="Casual Leave">Casual Leave</SelectItem>
                  <SelectItem value="Paid Leave">Paid Leave</SelectItem>
                  <SelectItem value="Emergency Leave">Emergency Leave</SelectItem>
                </SelectContent>
              </Select>
              <Select value={deptFilter} onValueChange={setDeptFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="w-full gap-2" onClick={() => { setSearchTerm(''); setTypeFilter('all'); setDeptFilter('all'); setStatusFilter('all'); toast.info('Filters reset.'); }}>
                  <X className="h-4 w-4" /> Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Main Table */}
          <Card>
            <CardHeader>
              <CardTitle>Employee Leave Requests</CardTitle>
              <CardDescription>Comprehensive list of submitted leave applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Leave Type</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead className="text-center">Total Days</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                          No leave requests matching your search or filter criteria.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRequests.map((req) => (
                        <TableRow key={req.id} className="group hover:bg-accent/50 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                  {req.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium group-hover:text-primary transition-colors">{req.name}</p>
                                <p className="text-xs text-muted-foreground">{req.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground font-medium">{req.department}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-normal">
                              {req.leaveType}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">{req.startDate}</TableCell>
                          <TableCell className="font-medium">{req.endDate}</TableCell>
                          <TableCell className="text-center font-semibold">{req.totalDays}</TableCell>
                          <TableCell className="max-w-[180px] truncate text-muted-foreground" title={req.reason}>
                            {req.reason}
                          </TableCell>
                          <TableCell>{getStatusBadge(req.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              {req.status === 'Pending' && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-500"
                                    onClick={() => handleApprove(req.id, req.name)}
                                    title="Approve"
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-rose-500 hover:bg-rose-500/10 hover:text-rose-500"
                                    onClick={() => handleReject(req.id, req.name)}
                                    title="Reject"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-accent"
                                onClick={() => handleViewDetails(req)}
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between pt-4 text-sm text-muted-foreground">
                <p>Showing {filteredRequests.length} of {requests.length} leave requests</p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>Previous</Button>
                  <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">1</Button>
                  <Button variant="outline" size="sm" disabled>Next</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Leave Balance Overview */}
        <TabsContent value="balances" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Employee Leave Balances</CardTitle>
              <CardDescription>Remaining allocated leave quotas per employee</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead className="text-center">Sick Leave (Remaining)</TableHead>
                      <TableHead className="text-center">Casual Leave (Remaining)</TableHead>
                      <TableHead className="text-center">Paid Leave (Remaining)</TableHead>
                      <TableHead className="text-center">Emergency Leave (Remaining)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaveBalances.map((bal, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{bal.name}</TableCell>
                        <TableCell className="text-muted-foreground">{bal.dept}</TableCell>
                        <TableCell className="text-center font-semibold text-primary">{bal.sick} days</TableCell>
                        <TableCell className="text-center font-semibold text-amber-500">{bal.casual} days</TableCell>
                        <TableCell className="text-center font-semibold text-emerald-500">{bal.paid} days</TableCell>
                        <TableCell className="text-center font-semibold text-rose-500">{bal.emergency} days</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Leave Calendar View */}
        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Leave Calendar Schedule</CardTitle>
              <CardDescription>Visual representation of upcoming and ongoing employee leaves</CardDescription>
            </CardHeader>
            <CardContent className="py-8 text-center space-y-4">
              <CalendarIcon className="h-16 w-16 mx-auto text-muted-foreground opacity-50 animate-pulse" />
              <h3 className="text-lg font-semibold">Enterprise Calendar Sync Active</h3>
              <p className="text-muted-foreground max-w-md mx-auto text-sm">
                The interactive multi-month enterprise leave schedule is currently synchronized with Google Workspace & Microsoft Outlook calendars.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <Button variant="outline" className="gap-2">
                  <CalendarIcon className="h-4 w-4" /> Month View
                </Button>
                <Button className="gap-2">
                  <Download className="h-4 w-4" /> Export ICS Feed
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Employee Leave History */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Leave Activities & Historical Archives</CardTitle>
              <CardDescription>Log of past approved leaves and system actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Michael Chen', action: 'Approved 3 days Sick Leave', time: 'Yesterday, 4:30 PM', approver: 'Admin (System)' },
                  { name: 'Emily Rodriguez', action: 'Approved 1 day Emergency Leave', time: '16 Aug 2026', approver: 'HR Manager' },
                  { name: 'John Anderson', action: 'Rejected 3 days Casual Leave', time: '12 Aug 2026', approver: 'Engineering Lead' },
                  { name: 'Sarah Mitchell', action: 'Approved 2 days Casual Leave', time: '10 Aug 2026', approver: 'Design Director' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                        {item.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.action} • <span className="font-medium text-foreground">{item.approver}</span></p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

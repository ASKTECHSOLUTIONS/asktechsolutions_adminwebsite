import { useState } from 'react';
import { motion } from 'motion/react';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { StatCard } from '../components/dashboard/StatCard';

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
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 border">Present</Badge>;
      case 'Late':
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 border">Late</Badge>;
      case 'Absent':
        return <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 border">Absent</Badge>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Attendance Management</h1>
            <p className="text-muted-foreground">Monitor daily check-ins, check-outs, and monthly records</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            <span>16 Aug 2026</span>
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

      {/* Today's Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Employees"
          value="67"
          icon={UserCheck}
          description="Active workforce"
        />
        <StatCard
          title="Present Today"
          value="54"
          icon={CheckCircle}
          trend={{ value: 4, isPositive: true }}
          description="80.6% on-time attendance"
        />
        <StatCard
          title="Late Arrivals"
          value="5"
          icon={AlertTriangle}
          description="Checked in after 9:15 AM"
        />
        <StatCard
          title="Absent / On Leave"
          value="8"
          icon={XCircle}
          description="Currently unavailable"
        />
      </div>

      {/* Tabs & Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="daily" className="gap-2">
              <Clock className="h-4 w-4" />
              Daily Attendance
            </TabsTrigger>
            <TabsTrigger value="monthly" className="gap-2">
              <CalendarIcon className="h-4 w-4" />
              Monthly Records
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics & Reports
            </TabsTrigger>
          </TabsList>

          {activeTab === 'daily' && (
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employee..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-input-background"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
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
          <Card>
            <CardHeader>
              <CardTitle>Employee Check-In & Check-Out Timings</CardTitle>
              <CardDescription>Real-time attendance tracking for 16 Aug 2026</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Work Hours</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No attendance records found matching your criteria.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredData.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                  {record.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{record.name}</p>
                                <p className="text-xs text-muted-foreground">{record.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{record.date}</TableCell>
                          <TableCell className="font-medium">{record.checkIn}</TableCell>
                          <TableCell className="font-medium">{record.checkOut}</TableCell>
                          <TableCell className="text-muted-foreground">{record.workHours}</TableCell>
                          <TableCell>{getStatusBadge(record.status)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Monthly Records / Calendar View */}
        <TabsContent value="monthly" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Attendance Records</CardTitle>
              <CardDescription>Summary of employee attendance for August 2026</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead className="text-center">Present Days</TableHead>
                      <TableHead className="text-center">Late Days</TableHead>
                      <TableHead className="text-center">Absent Days</TableHead>
                      <TableHead className="text-center">Avg. Daily Hours</TableHead>
                      <TableHead className="text-right">Attendance Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlyRecords.map((record, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{record.name}</TableCell>
                        <TableCell className="text-center text-emerald-500 font-medium">{record.presentDays}</TableCell>
                        <TableCell className="text-center text-amber-500 font-medium">{record.lateDays}</TableCell>
                        <TableCell className="text-center text-rose-500 font-medium">{record.absentDays}</TableCell>
                        <TableCell className="text-center text-muted-foreground">{record.avgHours}</TableCell>
                        <TableCell className="text-right font-bold text-primary">{record.attendanceRate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Analytics & Reports */}
        <TabsContent value="reports" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Percentage Overview</CardTitle>
                <CardDescription>Monthly target vs actual attendance percentage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Engineering Department</span>
                    <span>92%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[92%]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Design Department</span>
                    <span>88%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[88%]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Marketing Department</span>
                    <span>95%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[95%]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Report Generation</CardTitle>
                <CardDescription>Download detailed attendance logs and payroll summaries</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">August 2026 Complete Attendance Log</p>
                      <p className="text-xs text-muted-foreground">PDF • 2.4 MB</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" /> Download
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Late Arrival & Overtime Summary</p>
                      <p className="text-xs text-muted-foreground">CSV • 1.1 MB</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" /> Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'super-admin' | 'hr-admin' | 'project-manager' | 'finance-admin' | 'support-admin';
  avatar?: string;
  department?: string;
  permissions?: string[];
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department: string;
  position: string;
  status: 'active' | 'on-leave' | 'inactive' | 'suspended';
  joinDate: string;
  avatar?: string;
  salary?: number;
  workingHours?: number;
  performance?: number;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending';
  projectsCount: number;
  totalValue: number;
  avatar?: string;
  country?: string;
  joinedDate?: string;
  communicationLog?: CommunicationLog[];
}

export interface CommunicationLog {
  id: string;
  message: string;
  timestamp: string;
  type: 'email' | 'call' | 'meeting' | 'chat';
}

export interface Project {
  id: string;
  name: string;
  client: string;
  clientId?: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold' | 'delayed';
  progress: number;
  startDate: string;
  endDate: string;
  budget: number;
  spent?: number;
  team: string[];
  description?: string;
  milestones?: Milestone[];
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

export interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

export interface Attendance {
  id: string;
  employeeId: string;
  employeeName?: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'present' | 'absent' | 'late' | 'half-day';
  workingHours?: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'sick' | 'casual' | 'annual' | 'unpaid' | 'maternity' | 'paternity';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate?: string;
  approvedBy?: string;
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  duration: string; // e.g., "1h 30m"
  type: 'internal' | 'client' | 'interview' | 'team';
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  attendees: string[];
  location?: string;
  meetingLink?: string;
  organizer: string;
}

export interface Payment {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  projectName: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  dueDate: string;
  paidDate?: string;
  paymentMethod?: 'bank-transfer' | 'card' | 'upi' | 'cash';
  description?: string;
}

export interface InternshipApplication {
  id: string;
  candidateName: string;
  email: string;
  phone?: string;
  domain: string; // e.g., "Frontend Development"
  status: 'applied' | 'under-review' | 'interview-scheduled' | 'selected' | 'rejected' | 'withdrawn';
  appliedDate: string;
  interviewDate?: string;
  resumeUrl?: string;
  college?: string;
  skills?: string[];
  experience?: string; // "fresher" | "6 months" etc.
  notes?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
  read: boolean;
  timestamp: string;
  targetRole?: string;
  link?: string;
}

export interface DashboardStats {
  label: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease';
  icon: any;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  timestamp: string;
  ipAddress?: string;
  device?: string;
}

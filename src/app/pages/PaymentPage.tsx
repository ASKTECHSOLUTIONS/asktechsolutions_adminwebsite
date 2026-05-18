import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CreditCard, DollarSign, TrendingUp, AlertCircle, CheckCircle,
  Clock, Plus, Search, Filter, MoreVertical, Eye, Download,
  ArrowLeft, Receipt, ArrowUpRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '../components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '../components/ui/dropdown-menu';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '../components/ui/table';
import { Label } from '../components/ui/label';
import { mockPayments } from '../lib/mock-data';
import { Payment } from '../lib/types';
import { toast } from 'sonner';

interface PaymentPageProps {
  onBack?: () => void;
}

const statusConfig: Record<Payment['status'], { label: string; color: string; bg: string; icon: any }> = {
  'paid': { label: 'Paid', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30', icon: CheckCircle },
  'pending': { label: 'Pending', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30', icon: Clock },
  'overdue': { label: 'Overdue', color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-950/30', icon: AlertCircle },
  'cancelled': { label: 'Cancelled', color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-800', icon: AlertCircle },
};

export function PaymentPage({ onBack }: PaymentPageProps) {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const filtered = payments.filter(p => {
    const matchesSearch =
      p.clientName.toLowerCase().includes(search.toLowerCase()) ||
      p.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.projectName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalRevenue: payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0),
    pending: payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0),
    overdue: payments.filter(p => p.status === 'overdue').reduce((s, p) => s + p.amount, 0),
    paidCount: payments.filter(p => p.status === 'paid').length,
    overdueCount: payments.filter(p => p.status === 'overdue').length,
  };

  const handleMarkPaid = (id: string) => {
    setPayments(prev => prev.map(p =>
      p.id === id ? { ...p, status: 'paid' as const, paidDate: new Date().toISOString().split('T')[0] } : p
    ));
    toast.success('Payment marked as paid!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <CreditCard className="h-7 w-7 text-primary" /> Payment & Invoices
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">Track payments, invoices and billing</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 rounded-xl">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button onClick={() => setShowAddDialog(true)} className="gap-2 rounded-xl shadow-sm">
            <Plus className="h-4 w-4" /> New Invoice
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Collected', value: `$${stats.totalRevenue.toLocaleString()}`,
            icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-950/30',
            sub: `${stats.paidCount} invoices paid`
          },
          {
            label: 'Pending Amount', value: `$${stats.pending.toLocaleString()}`,
            icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-950/30',
            sub: `${payments.filter(p => p.status === 'pending').length} invoices pending`
          },
          {
            label: 'Overdue', value: `$${stats.overdue.toLocaleString()}`,
            icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-100 dark:bg-rose-950/30',
            sub: `${stats.overdueCount} overdue invoices`
          },
          {
            label: 'Total Invoiced', value: `$${payments.reduce((s, p) => s + p.amount, 0).toLocaleString()}`,
            icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10',
            sub: `${payments.length} total invoices`
          },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.05 }}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-xl font-bold mt-1">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
                  </div>
                  <div className={`p-2 rounded-xl ${stat.bg}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by client, invoice, or project..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-9 rounded-xl" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px] rounded-xl">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Payments Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filtered.map((payment, i) => {
                      const status = statusConfig[payment.status];
                      const StatusIcon = status.icon;
                      return (
                        <motion.tr
                          key={payment.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="group hover:bg-secondary/30 transition-colors"
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Receipt className="h-4 w-4 text-muted-foreground" />
                              <span className="font-mono text-sm font-medium">{payment.invoiceNumber}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">{payment.clientName}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground max-w-[160px]">
                            <span className="truncate block">{payment.projectName}</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="font-bold">${payment.amount.toLocaleString()}</span>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(payment.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                              <StatusIcon className="h-3 w-3" /> {status.label}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"
                                onClick={() => { setSelectedPayment(payment); setShowDetailDialog(true); }}>
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                              {payment.status !== 'paid' && (
                                <Button variant="ghost" size="sm" className="h-8 rounded-full text-xs gap-1 text-emerald-600 hover:text-emerald-600 hover:bg-emerald-50"
                                  onClick={() => handleMarkPaid(payment.id)}>
                                  <CheckCircle className="h-3.5 w-3.5" /> Mark Paid
                                </Button>
                              )}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                    <MoreVertical className="h-3.5 w-3.5" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="rounded-xl w-40">
                                  <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer text-sm">
                                    <Download className="h-3.5 w-3.5" /> Download PDF
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer text-sm">
                                    <ArrowUpRight className="h-3.5 w-3.5" /> Send Reminder
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <CreditCard className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No payments found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Add Invoice Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" /> Create Invoice
            </DialogTitle>
            <DialogDescription>Generate a new invoice for a client</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Client *</Label>
                <Select>
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select client" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">TechCorp Industries</SelectItem>
                    <SelectItem value="2">Digital Innovations</SelectItem>
                    <SelectItem value="4">Enterprise Solutions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Project *</Label>
                <Select>
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select project" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">E-commerce Redesign</SelectItem>
                    <SelectItem value="2">Mobile App Dev</SelectItem>
                    <SelectItem value="3">CRM Integration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Amount ($) *</Label>
                <Input type="number" placeholder="e.g. 25000" className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label>Due Date *</Label>
                <Input type="date" className="rounded-xl" />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>Description</Label>
                <Input placeholder="Invoice description..." className="rounded-xl" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={() => { setShowAddDialog(false); toast.success('Invoice created successfully!'); }} className="rounded-xl">Create Invoice</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-md rounded-2xl">
          {selectedPayment && (() => {
            const status = statusConfig[selectedPayment.status];
            const StatusIcon = status.icon;
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="font-mono">{selectedPayment.invoiceNumber}</DialogTitle>
                  <DialogDescription>{selectedPayment.clientName} · {selectedPayment.projectName}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="text-center py-4">
                    <p className="text-4xl font-bold">${selectedPayment.amount.toLocaleString()}</p>
                    <span className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.color}`}>
                      <StatusIcon className="h-3.5 w-3.5" /> {status.label}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Due Date</span>
                      <span className="font-medium">{new Date(selectedPayment.dueDate).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    {selectedPayment.paidDate && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Paid On</span>
                        <span className="font-medium text-emerald-600">{new Date(selectedPayment.paidDate).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    )}
                    {selectedPayment.paymentMethod && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment Method</span>
                        <span className="font-medium capitalize">{selectedPayment.paymentMethod.replace('-', ' ')}</span>
                      </div>
                    )}
                    {selectedPayment.description && (
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Description</span>
                        <span className="text-right">{selectedPayment.description}</span>
                      </div>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" className="rounded-xl gap-2">
                    <Download className="h-4 w-4" /> Download PDF
                  </Button>
                  {selectedPayment.status !== 'paid' && (
                    <Button onClick={() => { handleMarkPaid(selectedPayment.id); setShowDetailDialog(false); }} className="rounded-xl gap-2">
                      <CheckCircle className="h-4 w-4" /> Mark as Paid
                    </Button>
                  )}
                </DialogFooter>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}

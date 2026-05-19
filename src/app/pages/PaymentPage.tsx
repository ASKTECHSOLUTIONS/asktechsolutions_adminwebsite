import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CreditCard, DollarSign, TrendingUp, AlertCircle, CheckCircle,
  Clock, Plus, Search, Filter, MoreVertical, Eye, Download,
  ArrowLeft, Receipt, ArrowUpRight
} from 'lucide-react';
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

const statusConfig: Record<Payment['status'], { label: string; color: string; bg: string; border: string; icon: any }> = {
  'paid': { label: 'Paid', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle },
  'pending': { label: 'Pending', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Clock },
  'overdue': { label: 'Overdue', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: AlertCircle },
  'cancelled': { label: 'Cancelled', color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', icon: AlertCircle },
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
      <motion.div
        initial={{ opacity: 0, y: -20, }}
        animate={{ opacity: 1, y: 0, }}
        transition={{ duration: 0.25 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          {onBack && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="h-9 w-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground border border-white/10 bg-white/5 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </motion.button>
          )}
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 text-foreground">
              <CreditCard className="h-7 w-7 text-blue-400" /> Payment & Invoices
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">Track payments, invoices and billing</p>
          </div>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="gap-2 rounded-xl h-11 px-4 text-white border border-white/10 bg-white/5 hover:bg-white/10 transition-colors font-semibold flex items-center justify-center cursor-pointer"
          >
            <Download className="h-4 w-4 text-muted-foreground" /> Export
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(59,130,246,0.4)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddDialog(true)}
            className="gap-2 rounded-xl h-11 px-5 text-white font-semibold flex items-center justify-center cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}
          >
            <Plus className="h-4 w-4" /> New Invoice
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Collected', value: `$${stats.totalRevenue.toLocaleString()}`,
            icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20',
            sub: `${stats.paidCount} invoices paid`
          },
          {
            label: 'Pending Amount', value: `$${stats.pending.toLocaleString()}`,
            icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20',
            sub: `${payments.filter(p => p.status === 'pending').length} invoices pending`
          },
          {
            label: 'Overdue', value: `$${stats.overdue.toLocaleString()}`,
            icon: AlertCircle, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20',
            sub: `${stats.overdueCount} overdue invoices`
          },
          {
            label: 'Total Invoiced', value: `$${payments.reduce((s, p) => s + p.amount, 0).toLocaleString()}`,
            icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20',
            sub: `${payments.length} total invoices`
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20, }}
            animate={{ opacity: 1, y: 0, }}
            transition={{ delay: i * 0.05, duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="glass-card p-5 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1.5">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground mt-1.5 font-medium">{stat.sub}</p>
              </div>
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} border ${stat.border}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1 rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by client, invoice, or project..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 rounded-xl bg-white/5 border-0 text-white placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0 h-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px] rounded-xl bg-white/5 border-white/10 text-white h-10 focus:ring-0 focus:ring-offset-0">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10 rounded-xl text-white">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Payments Table */}
      <motion.div
        initial={{ opacity: 0, y: 20, }}
        animate={{ opacity: 1, y: 0, }}
        transition={{ delay: 0.25, duration: 0.25 }}
        className="glass-card overflow-hidden relative"
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-white/06 bg-white/02">
              <TableRow className="hover:bg-transparent border-b-0">
                <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-4">Invoice #</TableHead>
                <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-4">Client</TableHead>
                <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-4">Project</TableHead>
                <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-4 text-right">Amount</TableHead>
                <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-4">Due Date</TableHead>
                <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-4">Status</TableHead>
                <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-4 text-right">Actions</TableHead>
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
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="group border-b border-white/04 hover:bg-white/02 transition-colors duration-200"
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <Receipt className="h-4 w-4 text-blue-400" />
                          <span className="font-mono text-sm font-semibold text-white">{payment.invoiceNumber}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="font-bold text-sm text-foreground">{payment.clientName}</span>
                      </TableCell>
                      <TableCell className="py-4 text-sm text-slate-300 max-w-[160px]">
                        <span className="truncate block font-semibold">{payment.projectName}</span>
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        <span className="font-bold text-white">${payment.amount.toLocaleString()}</span>
                      </TableCell>
                      <TableCell className="py-4 text-sm text-slate-400 font-semibold">
                        {new Date(payment.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </TableCell>
                      <TableCell className="py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${status.bg} ${status.color} ${status.border}`}>
                          <StatusIcon className="h-3 w-3" /> {status.label}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-white/10 text-muted-foreground hover:text-foreground cursor-pointer"
                            onClick={() => { setSelectedPayment(payment); setShowDetailDialog(true); }}
                          >
                            <Eye className="h-4 w-4 text-blue-400" />
                          </motion.button>
                          {payment.status !== 'paid' && (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="h-8 px-3 rounded-lg text-xs font-bold gap-1 flex items-center bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-pointer"
                              onClick={() => handleMarkPaid(payment.id)}
                            >
                              <CheckCircle className="h-3.5 w-3.5" /> Mark Paid
                            </motion.button>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-white/10 text-muted-foreground hover:text-foreground cursor-pointer"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </motion.button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-40 rounded-xl p-1 bg-slate-900 border-white/10 text-white"
                            >
                              <DropdownMenuItem className="rounded-lg gap-2.5 cursor-pointer p-2.5 hover:bg-white/5 text-xs font-semibold">
                                <Download className="h-4 w-4 text-purple-400" /> Download PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem className="rounded-lg gap-2.5 cursor-pointer p-2.5 hover:bg-white/5 text-xs font-semibold">
                                <ArrowUpRight className="h-4 w-4 text-blue-400" /> Send Reminder
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
      </motion.div>

      {/* Add Invoice Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent
          className="max-w-lg rounded-3xl text-white border-white/10"
          style={{
            background: 'rgba(11, 17, 32, 0.97)',
            backdropFilter: 'blur(30px)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-white">
              <Receipt className="h-5 w-5 text-blue-400" /> Create Invoice
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">Generate a new invoice for a client</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Client *</Label>
                <Select>
                  <SelectTrigger className="rounded-xl bg-white/5 border-white/10 text-white h-10">
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10 text-white rounded-xl">
                    <SelectItem value="1">TechCorp Industries</SelectItem>
                    <SelectItem value="2">Digital Innovations</SelectItem>
                    <SelectItem value="4">Enterprise Solutions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Project *</Label>
                <Select>
                  <SelectTrigger className="rounded-xl bg-white/5 border-white/10 text-white h-10">
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10 text-white rounded-xl">
                    <SelectItem value="1">E-commerce Redesign</SelectItem>
                    <SelectItem value="2">Mobile App Dev</SelectItem>
                    <SelectItem value="3">CRM Integration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Amount ($) *</Label>
                <Input
                  type="number"
                  placeholder="e.g. 25000"
                  className="rounded-xl bg-white/5 border-white/10 text-white h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Due Date *</Label>
                <Input type="date" className="rounded-xl bg-white/5 border-white/10 text-white h-10" />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Description</Label>
                <Input
                  placeholder="Invoice description..."
                  className="rounded-xl bg-white/5 border-white/10 text-white h-10"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2.5">
            <Button
              variant="outline"
              onClick={() => setShowAddDialog(false)}
              className="rounded-xl bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={() => { setShowAddDialog(false); toast.success('Invoice created successfully!'); }}
              className="rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white"
            >
              Create Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent
          className="max-w-md rounded-3xl text-white border-white/10"
          style={{
            background: 'rgba(11, 17, 32, 0.97)',
            backdropFilter: 'blur(30px)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          }}
        >
          {selectedPayment && (() => {
            const status = statusConfig[selectedPayment.status];
            const StatusIcon = status.icon;
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="font-mono text-lg font-bold text-white">{selectedPayment.invoiceNumber}</DialogTitle>
                  <DialogDescription className="text-slate-400 text-xs mt-0.5">{selectedPayment.clientName} · {selectedPayment.projectName}</DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-3">
                  <div className="text-center py-5 rounded-2xl bg-white/5 border border-white/06 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Invoice Total</p>
                    <p className="text-4xl font-bold text-white">${selectedPayment.amount.toLocaleString()}</p>
                    <span className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-xs font-semibold border ${status.bg} ${status.color} ${status.border}`}>
                      <StatusIcon className="h-3.5 w-3.5" /> {status.label}
                    </span>
                  </div>

                  <div className="space-y-3.5 text-xs font-semibold text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Due Date</span>
                      <span className="text-white font-bold">{new Date(selectedPayment.dueDate).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    {selectedPayment.paidDate && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Paid On</span>
                        <span className="text-emerald-400 font-bold">{new Date(selectedPayment.paidDate).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    )}
                    {selectedPayment.paymentMethod && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Payment Method</span>
                        <span className="text-white font-bold capitalize">{selectedPayment.paymentMethod.replace('-', ' ')}</span>
                      </div>
                    )}
                    {selectedPayment.description && (
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Description</span>
                        <span className="text-right text-white font-bold">{selectedPayment.description}</span>
                      </div>
                    )}
                  </div>
                </div>

                <DialogFooter className="gap-2.5">
                  <Button
                    variant="outline"
                    className="rounded-xl bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white gap-2"
                  >
                    <Download className="h-4 w-4" /> Download PDF
                  </Button>
                  {selectedPayment.status !== 'paid' && (
                    <Button
                      onClick={() => { handleMarkPaid(selectedPayment.id); setShowDetailDialog(false); }}
                      className="rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white gap-2"
                    >
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

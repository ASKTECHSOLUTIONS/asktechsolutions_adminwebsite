import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap, User, Mail, Phone, Search, Filter, Plus, ArrowLeft,
  Download, Calendar, CheckCircle, XCircle, Clock, Eye, MoreVertical,
  Edit2, Trash2, Star, BookOpen, Briefcase
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '../components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '../components/ui/dropdown-menu';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { mockInternships } from '../lib/mock-data';
import { InternshipApplication } from '../lib/types';
import { toast } from 'sonner';

interface InternshipPageProps {
  onBack?: () => void;
}

const statusConfig: Record<InternshipApplication['status'], { label: string; color: string; bg: string; icon: any }> = {
  'applied': { label: 'Applied', color: 'text-slate-600', bg: 'bg-slate-100 dark:bg-slate-800', icon: BookOpen },
  'under-review': { label: 'Under Review', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/30', icon: Eye },
  'interview-scheduled': { label: 'Interview Scheduled', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/30', icon: Calendar },
  'selected': { label: 'Selected', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30', icon: CheckCircle },
  'rejected': { label: 'Rejected', color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-950/30', icon: XCircle },
  'withdrawn': { label: 'Withdrawn', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30', icon: Clock },
};

export function InternshipPage({ onBack }: InternshipPageProps) {
  const [applications, setApplications] = useState<InternshipApplication[]>(mockInternships);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [domainFilter, setDomainFilter] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<InternshipApplication | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const domains = [...new Set(applications.map(a => a.domain))];

  const filtered = applications.filter(a => {
    const matchesSearch =
      a.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.domain.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchesDomain = domainFilter === 'all' || a.domain === domainFilter;
    return matchesSearch && matchesStatus && matchesDomain;
  });

  const stats = {
    total: applications.length,
    underReview: applications.filter(a => a.status === 'under-review').length,
    scheduled: applications.filter(a => a.status === 'interview-scheduled').length,
    selected: applications.filter(a => a.status === 'selected').length,
  };

  const updateStatus = (id: string, newStatus: InternshipApplication['status']) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    toast.success(`Status updated to ${statusConfig[newStatus].label}`);
  };

  const handleDelete = (id: string) => {
    setApplications(prev => prev.filter(a => a.id !== id));
    toast.success('Application removed');
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
              <GraduationCap className="h-7 w-7 text-primary" /> Internship Management
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">Track and manage internship applications</p>
          </div>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="gap-2 rounded-xl shadow-sm">
          <Plus className="h-4 w-4" /> Add Application
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Applications', value: stats.total, icon: BookOpen, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Under Review', value: stats.underReview, icon: Eye, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-950/30' },
          { label: 'Interviews Scheduled', value: stats.scheduled, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-950/30' },
          { label: 'Selected', value: stats.selected, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-950/30' },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.05 }}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
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
          <Input placeholder="Search candidates..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 rounded-xl" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[170px] rounded-xl">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="applied">Applied</SelectItem>
            <SelectItem value="under-review">Under Review</SelectItem>
            <SelectItem value="interview-scheduled">Interview Scheduled</SelectItem>
            <SelectItem value="selected">Selected</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select value={domainFilter} onValueChange={setDomainFilter}>
          <SelectTrigger className="w-[180px] rounded-xl">
            <Briefcase className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter Domain" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Domains</SelectItem>
            {domains.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
      </motion.div>

      {/* Application Cards */}
      <AnimatePresence mode="wait">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((app, i) => {
            const status = statusConfig[app.status];
            const StatusIcon = status.icon;

            return (
              <motion.div key={app.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }} className="group">
                <Card className="h-full hover:shadow-lg transition-all">
                  <CardContent className="p-4 space-y-4">
                    {/* Candidate Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-11 w-11">
                          <AvatarFallback className="bg-primary text-primary-foreground font-bold text-sm">
                            {app.candidateName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm">{app.candidateName}</p>
                          <p className="text-xs text-muted-foreground">{app.college}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl w-44">
                          <DropdownMenuItem onClick={() => { setSelectedApp(app); setShowDetailDialog(true); }}
                            className="rounded-lg gap-2 cursor-pointer text-sm">
                            <Eye className="h-3.5 w-3.5" /> View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer text-sm">
                            <Download className="h-3.5 w-3.5" /> Download Resume
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(app.id, 'interview-scheduled')}
                            className="rounded-lg gap-2 cursor-pointer text-sm">
                            <Calendar className="h-3.5 w-3.5" /> Schedule Interview
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(app.id, 'selected')}
                            className="rounded-lg gap-2 cursor-pointer text-emerald-600 text-sm">
                            <CheckCircle className="h-3.5 w-3.5" /> Select Candidate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(app.id, 'rejected')}
                            className="rounded-lg gap-2 cursor-pointer text-rose-600 text-sm">
                            <XCircle className="h-3.5 w-3.5" /> Reject
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Domain & Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                        <Briefcase className="h-3 w-3" /> {app.domain}
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                        <StatusIcon className="h-3 w-3" /> {status.label}
                      </span>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3 flex-shrink-0" /> <span className="truncate">{app.email}</span>
                      </div>
                      {app.phone && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3 flex-shrink-0" /> <span>{app.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Skills */}
                    {app.skills && app.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {app.skills.slice(0, 3).map(skill => (
                          <span key={skill} className="px-2 py-0.5 bg-secondary text-xs rounded-full">{skill}</span>
                        ))}
                        {app.skills.length > 3 && (
                          <span className="px-2 py-0.5 bg-secondary text-xs rounded-full">+{app.skills.length - 3}</span>
                        )}
                      </div>
                    )}

                    {/* Dates */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Applied: {new Date(app.appliedDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </span>
                      {app.interviewDate && (
                        <span className="flex items-center gap-1 text-purple-600 font-medium">
                          <Clock className="h-3 w-3" />
                          Interview: {new Date(app.interviewDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <GraduationCap className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No applications found</p>
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" /> Add Application
            </DialogTitle>
            <DialogDescription>Add a new internship application</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1.5">
                <Label>Candidate Name *</Label>
                <Input placeholder="Full name" className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label>Email *</Label>
                <Input type="email" placeholder="email@example.com" className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input placeholder="+91 ..." className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label>Domain *</Label>
                <Select>
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select domain" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="frontend">Frontend Development</SelectItem>
                    <SelectItem value="backend">Backend Development</SelectItem>
                    <SelectItem value="uiux">UI/UX Design</SelectItem>
                    <SelectItem value="mobile">Mobile Development</SelectItem>
                    <SelectItem value="data">Data Science</SelectItem>
                    <SelectItem value="marketing">Digital Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>College</Label>
                <Input placeholder="College name" className="rounded-xl" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={() => { setShowAddDialog(false); toast.success('Application added!'); }} className="rounded-xl">Add Application</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-md rounded-2xl">
          {selectedApp && (() => {
            const status = statusConfig[selectedApp.status];
            const StatusIcon = status.icon;
            return (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedApp.candidateName}</DialogTitle>
                  <DialogDescription>{selectedApp.domain} · {selectedApp.college}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.color}`}>
                    <StatusIcon className="h-3.5 w-3.5" /> {status.label}
                  </span>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" /> {selectedApp.email}
                    </div>
                    {selectedApp.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" /> {selectedApp.phone}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      Applied: {new Date(selectedApp.appliedDate).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                    {selectedApp.interviewDate && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        Interview: {new Date(selectedApp.interviewDate).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </div>
                    )}
                  </div>
                  <Separator />
                  {selectedApp.skills && (
                    <div>
                      <p className="text-sm font-semibold mb-2">Skills</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedApp.skills.map(s => (
                          <span key={s} className="px-2.5 py-1 bg-secondary rounded-full text-xs">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedApp.notes && (
                    <div>
                      <p className="text-sm font-semibold mb-1">Notes</p>
                      <p className="text-sm text-muted-foreground">{selectedApp.notes}</p>
                    </div>
                  )}
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2">
                  <Button variant="outline" className="rounded-xl gap-2 flex-1">
                    <Download className="h-4 w-4" /> Resume
                  </Button>
                  <Button onClick={() => { updateStatus(selectedApp.id, 'selected'); setShowDetailDialog(false); }}
                    className="rounded-xl gap-2 flex-1 bg-emerald-600 hover:bg-emerald-700">
                    <CheckCircle className="h-4 w-4" /> Select
                  </Button>
                  <Button variant="destructive" onClick={() => { updateStatus(selectedApp.id, 'rejected'); setShowDetailDialog(false); }}
                    className="rounded-xl gap-2 flex-1">
                    <XCircle className="h-4 w-4" /> Reject
                  </Button>
                </DialogFooter>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}

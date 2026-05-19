import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap, Mail, Phone, Search, Filter, Plus, ArrowLeft,
  Download, Calendar, CheckCircle, XCircle, Clock, Eye, MoreVertical,
  BookOpen, Briefcase
} from 'lucide-react';
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

const statusConfig: Record<InternshipApplication['status'], { label: string; color: string; bg: string; border: string; icon: any }> = {
  'applied': { label: 'Applied', color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', icon: BookOpen },
  'under-review': { label: 'Under Review', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Eye },
  'interview-scheduled': { label: 'Interview Scheduled', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: Calendar },
  'selected': { label: 'Selected', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle },
  'rejected': { label: 'Rejected', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: XCircle },
  'withdrawn': { label: 'Withdrawn', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Clock },
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
              <GraduationCap className="h-7 w-7 text-blue-400" /> Internship Management
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">Track and manage internship applications</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(59,130,246,0.4)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddDialog(true)}
          className="gap-2 rounded-xl h-11 px-5 text-white font-semibold flex items-center justify-center cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}
        >
          <Plus className="h-4 w-4" /> Add Application
        </motion.button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Applications', value: stats.total, icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
          { label: 'Under Review', value: stats.underReview, icon: Eye, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
          { label: 'Interviews', value: stats.scheduled, icon: Calendar, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
          { label: 'Selected', value: stats.selected, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
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
            <div className="flex items-center gap-4">
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} border ${stat.border}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground mt-0.5">{stat.value}</p>
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
            placeholder="Search candidates..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 rounded-xl bg-white/5 border-0 text-white placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0 h-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[170px] rounded-xl bg-white/5 border-white/10 text-white h-10 focus:ring-0 focus:ring-offset-0">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10 rounded-xl text-white">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="applied">Applied</SelectItem>
            <SelectItem value="under-review">Under Review</SelectItem>
            <SelectItem value="interview-scheduled">Interview Scheduled</SelectItem>
            <SelectItem value="selected">Selected</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select value={domainFilter} onValueChange={setDomainFilter}>
          <SelectTrigger className="w-[180px] rounded-xl bg-white/5 border-white/10 text-white h-10 focus:ring-0 focus:ring-offset-0">
            <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Filter Domain" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10 rounded-xl text-white">
            <SelectItem value="all">All Domains</SelectItem>
            {domains.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
      </motion.div>

      {/* Application Cards */}
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {filtered.map((app, i) => {
            const status = statusConfig[app.status];
            const StatusIcon = status.icon;

            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20, }}
                animate={{ opacity: 1, y: 0, }}
                transition={{ delay: i * 0.04, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="group relative cursor-default"
              >
                <div className="glass-card p-5 relative overflow-hidden h-full flex flex-col justify-between">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  
                  <div className="space-y-4">
                    {/* Candidate Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-11 w-11">
                          <AvatarFallback
                            className="text-white font-bold text-sm"
                            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
                          >
                            {app.candidateName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-sm text-white">{app.candidateName}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5 font-semibold">{app.college}</p>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-white/10 text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </motion.button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-44 rounded-xl p-1 bg-slate-900 border-white/10 text-white"
                        >
                          <DropdownMenuItem
                            onClick={() => { setSelectedApp(app); setShowDetailDialog(true); }}
                            className="rounded-lg gap-2.5 cursor-pointer p-2.5 hover:bg-white/5 text-xs font-semibold"
                          >
                            <Eye className="h-4 w-4 text-blue-400" /> View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg gap-2.5 cursor-pointer p-2.5 hover:bg-white/5 text-xs font-semibold">
                            <Download className="h-4 w-4 text-purple-400" /> Download Resume
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateStatus(app.id, 'interview-scheduled')}
                            className="rounded-lg gap-2.5 cursor-pointer p-2.5 hover:bg-white/5 text-xs font-semibold"
                          >
                            <Calendar className="h-4 w-4 text-cyan-400" /> Schedule Interview
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateStatus(app.id, 'selected')}
                            className="rounded-lg gap-2.5 cursor-pointer text-emerald-400 p-2.5 hover:bg-emerald-500/10 text-xs font-semibold"
                          >
                            <CheckCircle className="h-4 w-4" /> Select Candidate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateStatus(app.id, 'rejected')}
                            className="rounded-lg gap-2.5 cursor-pointer text-rose-400 p-2.5 hover:bg-rose-500/10 text-xs font-semibold"
                          >
                            <XCircle className="h-4 w-4" /> Reject
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Domain & Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-[10px] font-bold uppercase tracking-wide">
                        <Briefcase className="h-3 w-3" /> {app.domain}
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${status.bg} ${status.color} ${status.border}`}>
                        <StatusIcon className="h-3 w-3" /> {status.label}
                      </span>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-1.5 font-semibold">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="h-3.5 w-3.5 text-blue-400" /> <span className="truncate">{app.email}</span>
                      </div>
                      {app.phone && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Phone className="h-3.5 w-3.5 text-purple-400" /> <span>{app.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Skills */}
                    {app.skills && app.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {app.skills.slice(0, 3).map(skill => (
                          <span key={skill} className="px-2.5 py-0.5 bg-white/5 border border-white/06 text-white text-[10px] font-bold rounded-full">{skill}</span>
                        ))}
                        {app.skills.length > 3 && (
                          <span className="px-2.5 py-0.5 bg-white/5 border border-white/06 text-white text-[10px] font-bold rounded-full">+{app.skills.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Dates */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-3.5 mt-4 border-t border-white/06 font-semibold">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-blue-400" />
                      Applied: {new Date(app.appliedDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </span>
                    {app.interviewDate && (
                      <span className="flex items-center gap-1 text-purple-400 font-bold">
                        <Clock className="h-3.5 w-3.5" />
                        Interview: {new Date(app.interviewDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                </div>
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
        <DialogContent
          className="max-w-md rounded-3xl text-white border-white/10"
          style={{
            background: 'rgba(11, 17, 32, 0.97)',
            backdropFilter: 'blur(30px)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-white">
              <GraduationCap className="h-5 w-5 text-blue-400" /> Add Application
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">Add a new internship application</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="grid grid-cols-2 gap-3.5">
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Candidate Name *</Label>
                <Input placeholder="Full name" className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-10" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Email *</Label>
                <Input type="email" placeholder="email@example.com" className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-10" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Phone</Label>
                <Input placeholder="+91 ..." className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-10" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Domain *</Label>
                <Select>
                  <SelectTrigger className="rounded-xl bg-white/5 border-white/10 text-white h-10">
                    <SelectValue placeholder="Select domain" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10 text-white rounded-xl">
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
                <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">College</Label>
                <Input placeholder="College name" className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-10" />
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
              onClick={() => { setShowAddDialog(false); toast.success('Application added!'); }}
              className="rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white"
            >
              Add Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent
          className="max-w-md rounded-3xl text-white border-white/10"
          style={{
            background: 'rgba(11, 17, 32, 0.97)',
            backdropFilter: 'blur(30px)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          }}
        >
          {selectedApp && (() => {
            const status = statusConfig[selectedApp.status];
            const StatusIcon = status.icon;
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="text-lg font-bold text-white">{selectedApp.candidateName}</DialogTitle>
                  <DialogDescription className="text-slate-400 text-xs mt-0.5">{selectedApp.domain} · {selectedApp.college}</DialogDescription>
                </DialogHeader>

                <div className="space-y-5 py-3">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${status.bg} ${status.color} ${status.border}`}>
                    <StatusIcon className="h-4 w-4" /> {status.label}
                  </span>
                  
                  <div className="space-y-3 text-xs font-semibold text-slate-300">
                    <div className="flex items-center gap-2.5">
                      <Mail className="h-4 w-4 text-blue-400" /> {selectedApp.email}
                    </div>
                    {selectedApp.phone && (
                      <div className="flex items-center gap-2.5">
                        <Phone className="h-4 w-4 text-purple-400" /> {selectedApp.phone}
                      </div>
                    )}
                    <div className="flex items-center gap-2.5">
                      <Calendar className="h-4 w-4 text-cyan-400" />
                      Applied: {new Date(selectedApp.appliedDate).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                    {selectedApp.interviewDate && (
                      <div className="flex items-center gap-2.5">
                        <Clock className="h-4 w-4 text-purple-400" />
                        Interview: {new Date(selectedApp.interviewDate).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </div>
                    )}
                  </div>
                  
                  <Separator className="bg-white/06" />
                  
                  {selectedApp.skills && (
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Skills</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedApp.skills.map(s => (
                          <span key={s} className="px-2.5 py-1 bg-white/5 border border-white/06 rounded-full text-xs font-semibold">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedApp.notes && (
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Notes</p>
                      <p className="text-xs text-slate-300 leading-relaxed font-semibold">{selectedApp.notes}</p>
                    </div>
                  )}
                </div>
                
                <DialogFooter className="flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    className="rounded-xl bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white gap-2 flex-1"
                  >
                    <Download className="h-4 w-4" /> Resume
                  </Button>
                  <Button
                    onClick={() => { updateStatus(selectedApp.id, 'selected'); setShowDetailDialog(false); }}
                    className="rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-2 flex-1"
                  >
                    <CheckCircle className="h-4 w-4" /> Select
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => { updateStatus(selectedApp.id, 'rejected'); setShowDetailDialog(false); }}
                    className="rounded-xl font-bold gap-2 flex-1"
                  >
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

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, Search, Filter, FolderKanban, Calendar, Users, DollarSign,
  ChevronRight, TrendingUp, AlertCircle, CheckCircle, Clock, Pause,
  MoreVertical, Eye, Edit2, Trash2, Target, ArrowLeft
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '../components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { mockProjects } from '../lib/mock-data';
import { Project } from '../lib/types';
import { toast } from 'sonner';

interface ProjectManagementPageProps {
  onBack?: () => void;
}

const statusConfig: Record<Project['status'], { label: string; color: string; icon: any; bg: string; border: string }> = {
  'planning': { label: 'Planning', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Clock },
  'in-progress': { label: 'In Progress', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: TrendingUp },
  'completed': { label: 'Completed', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle },
  'on-hold': { label: 'On Hold', color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', icon: Pause },
  'delayed': { label: 'Delayed', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: AlertCircle },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  'low': { label: 'Low', color: 'text-slate-400' },
  'medium': { label: 'Medium', color: 'text-amber-400' },
  'high': { label: 'High', color: 'text-orange-400' },
  'critical': { label: 'Critical', color: 'text-rose-400' },
};

const progressColor = (p: number) => {
  if (p >= 80) return '#10b981';
  if (p >= 50) return '#3b82f6';
  if (p >= 25) return '#f59e0b';
  return '#f43f5e';
};

export function ProjectManagementPage({ onBack }: ProjectManagementPageProps) {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const filtered = projects.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: projects.length,
    inProgress: projects.filter(p => p.status === 'in-progress').length,
    completed: projects.filter(p => p.status === 'completed').length,
    delayed: projects.filter(p => p.status === 'delayed').length,
    totalBudget: projects.reduce((s, p) => s + p.budget, 0),
    totalSpent: projects.reduce((s, p) => s + (p.spent || 0), 0),
  };

  const handleDelete = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    toast.success('Project removed successfully');
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
              <FolderKanban className="h-7 w-7 text-blue-400" /> Project Management
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">Track, manage and deliver projects</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(59,130,246,0.4)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddDialog(true)}
          className="gap-2 rounded-xl h-11 px-5 text-white font-semibold flex items-center justify-center cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}
        >
          <Plus className="h-4 w-4" /> New Project
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Projects', value: stats.total, icon: FolderKanban, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
          { label: 'In Progress', value: stats.inProgress, icon: TrendingUp, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
          { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
          { label: 'Delayed', value: stats.delayed, icon: AlertCircle, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
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

      {/* Budget Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20, }}
        animate={{ opacity: 1, y: 0, }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Budget Allocated</p>
            <p className="text-3xl font-bold text-foreground mt-0.5">${stats.totalBudget.toLocaleString()}</p>
          </div>
          <div className="flex-1 max-w-sm">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Spent: ${stats.totalSpent.toLocaleString()}</span>
              <span className="font-semibold text-foreground">{Math.round((stats.totalSpent / stats.totalBudget) * 100)}%</span>
            </div>
            <div className="h-2 bg-white/06 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(stats.totalSpent / stats.totalBudget) * 100}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="h-full rounded-full bg-blue-500"
                style={{ boxShadow: '0 0 8px rgba(59,130,246,0.4)' }}
              />
            </div>
          </div>
          <div className="sm:text-right">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Remaining</p>
            <p className="text-2xl font-bold text-emerald-400 mt-0.5">${(stats.totalBudget - stats.totalSpent).toLocaleString()}</p>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1 rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 rounded-xl bg-white/5 border-0 text-white placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0 h-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] rounded-xl bg-white/5 border-white/10 text-white h-10 focus:ring-0 focus:ring-offset-0">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10 rounded-xl text-white">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="on-hold">On Hold</SelectItem>
            <SelectItem value="delayed">Delayed</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Project Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
        >
          {filtered.map((project, i) => {
            const status = statusConfig[project.status];
            const StatusIcon = status.icon;
            const priority = project.priority ? priorityConfig[project.priority] : null;
            const spentPercent = project.spent && project.budget ? (project.spent / project.budget) * 100 : 0;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30, }}
                animate={{ opacity: 1, y: 0, }}
                transition={{ delay: i * 0.05, duration: 0.25 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="group relative cursor-default"
              >
                {/* Neon hover glow */}
                <div
                  className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ boxShadow: '0 0 30px rgba(59,130,246,0.1)' }}
                />

                <div className="glass-card overflow-hidden h-full flex flex-col justify-between p-6 relative">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  
                  {/* Top card section */}
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 mr-2">
                        <h4 className="text-base font-bold text-foreground line-clamp-1 leading-snug">{project.name}</h4>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1 font-medium">
                          <Users className="h-3.5 w-3.5 text-blue-400" /> {project.client}
                        </p>
                      </div>
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
                          <DropdownMenuItem
                            onClick={() => { setSelectedProject(project); setShowDetailDialog(true); }}
                            className="rounded-lg gap-2.5 cursor-pointer p-2.5 hover:bg-white/5"
                          >
                            <Eye className="h-4 w-4 text-blue-400" /> <span className="text-xs font-semibold">View Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg gap-2.5 cursor-pointer p-2.5 hover:bg-white/5">
                            <Edit2 className="h-4 w-4 text-purple-400" /> <span className="text-xs font-semibold">Edit Project</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(project.id)}
                            className="rounded-lg gap-2.5 cursor-pointer text-rose-400 p-2.5 hover:bg-rose-500/10"
                          >
                            <Trash2 className="h-4 w-4" /> <span className="text-xs font-semibold">Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap mb-5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${status.bg} ${status.color} ${status.border}`}>
                        <StatusIcon className="h-3.5 w-3.5" /> {status.label}
                      </span>
                      {priority && (
                        <span className={`text-xs font-semibold ${priority.color}`}>
                          ● {priority.label} Priority
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Middle section: Progress/Budget details */}
                  <div className="space-y-4 flex-1">
                    {/* Progress */}
                    <div>
                      <div className="flex justify-between text-xs mb-1.5 font-semibold">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-foreground">{project.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-white/06 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${project.progress}%` }}
                          transition={{ duration: 1.2, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{
                            background: progressColor(project.progress),
                            boxShadow: `0 0 8px ${progressColor(project.progress)}40`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Budget */}
                    {project.spent !== undefined && (
                      <div>
                        <div className="flex justify-between text-xs mb-1.5 font-semibold">
                          <span className="text-muted-foreground">Budget Allocated</span>
                          <span className="text-foreground">${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}</span>
                        </div>
                        <div className="h-1 bg-white/06 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(spentPercent, 100)}%` }}
                            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.1 }}
                            className="h-full rounded-full animate-pulse"
                            style={{
                              background: spentPercent > 90 ? '#f43f5e' : spentPercent > 70 ? '#f59e0b' : '#10b981',
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom section: Dates & Team info */}
                  <div className="space-y-3.5 mt-5 pt-4 border-t border-white/06">
                    <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-blue-400" />
                        <span>{new Date(project.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
                      <div className="flex items-center gap-1.5">
                        <Target className="h-3.5 w-3.5 text-rose-400" />
                        <span>{new Date(project.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-1.5">
                        {project.team.slice(0, 4).map((member, mi) => (
                          <Avatar key={mi} className="h-7 w-7 border border-slate-900">
                            <AvatarFallback
                              className="text-[10px] font-bold text-white"
                              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
                            >
                              {member.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {project.team.length > 4 && (
                          <div
                            className="h-7 w-7 rounded-full border border-slate-900 flex items-center justify-center text-[10px] font-semibold text-white bg-slate-800"
                          >
                            +{project.team.length - 4}
                          </div>
                        )}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { setSelectedProject(project); setShowDetailDialog(true); }}
                        className="text-xs text-blue-400 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        View Details <ChevronRight className="h-3.5 w-3.5" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <FolderKanban className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No projects found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Add Project Dialog */}
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
              <FolderKanban className="h-5 w-5 text-blue-400" /> New Project
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">Create a new project and assign teams</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Project Name *</Label>
                <Input
                  placeholder="e.g. E-commerce Redesign"
                  className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Client</Label>
                <Select>
                  <SelectTrigger className="rounded-xl bg-white/5 border-white/10 text-white h-10">
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10 text-white rounded-xl">
                    <SelectItem value="1">TechCorp Industries</SelectItem>
                    <SelectItem value="2">Digital Innovations</SelectItem>
                    <SelectItem value="4">Enterprise Solutions</SelectItem>
                    <SelectItem value="6">Infinity Corp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Priority</Label>
                <Select>
                  <SelectTrigger className="rounded-xl bg-white/5 border-white/10 text-white h-10">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10 text-white rounded-xl">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Start Date</Label>
                <Input type="date" className="rounded-xl bg-white/5 border-white/10 text-white h-10" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">End Date</Label>
                <Input type="date" className="rounded-xl bg-white/5 border-white/10 text-white h-10" />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Budget ($)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 85000"
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
              onClick={() => { setShowAddDialog(false); toast.success('Project created successfully!'); }}
              className="rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white"
            >
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Project Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent
          className="max-w-2xl rounded-3xl text-white border-white/10 max-h-[85vh] overflow-y-auto"
          style={{
            background: 'rgba(11, 17, 32, 0.97)',
            backdropFilter: 'blur(30px)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          }}
        >
          {selectedProject && (() => {
            const status = statusConfig[selectedProject.status];
            const StatusIcon = status.icon;
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-white">{selectedProject.name}</DialogTitle>
                  <DialogDescription className="text-slate-400 text-xs mt-0.5">{selectedProject.client}</DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-3">
                  {/* Status & Priority */}
                  <div className="flex gap-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border ${status.bg} ${status.color} ${status.border}`}>
                      <StatusIcon className="h-4 w-4" /> {status.label}
                    </span>
                    {selectedProject.priority && (
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-white/5 border border-white/10 ${priorityConfig[selectedProject.priority].color}`}>
                        {priorityConfig[selectedProject.priority].label} Priority
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {selectedProject.description && (
                    <p className="text-sm text-slate-300 leading-relaxed">{selectedProject.description}</p>
                  )}

                  {/* Progress & Budget */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card p-5 relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Progress</p>
                      <p className="text-2xl font-bold text-white">{selectedProject.progress}%</p>
                      <div className="h-1.5 bg-white/06 rounded-full overflow-hidden mt-3">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${selectedProject.progress}%` }}
                          transition={{ duration: 1.2 }}
                          className="h-full rounded-full bg-blue-500"
                          style={{ boxShadow: '0 0 8px rgba(59,130,246,0.4)' }}
                        />
                      </div>
                    </div>

                    <div className="glass-card p-5 relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Budget</p>
                      <p className="text-2xl font-bold text-white">${selectedProject.budget.toLocaleString()}</p>
                      {selectedProject.spent && (
                        <p className="text-xs text-muted-foreground mt-1.5">Spent: ${selectedProject.spent.toLocaleString()}</p>
                      )}
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="flex gap-8 border-t border-white/06 pt-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Start Date</p>
                      <p className="font-bold text-foreground mt-1">{new Date(selectedProject.startDate).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Deadline</p>
                      <p className="font-bold text-foreground mt-1">{new Date(selectedProject.endDate).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>

                  {/* Team */}
                  <div>
                    <p className="text-sm font-semibold mb-3 flex items-center gap-2 text-white">
                      <Users className="h-4 w-4 text-blue-400" /> Team Members ({selectedProject.team.length})
                    </p>
                    <div className="flex flex-wrap gap-2.5">
                      {selectedProject.team.map((member, i) => (
                        <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-semibold">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="text-[10px] bg-blue-600 text-white font-bold">{member.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {member}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Milestones */}
                  {selectedProject.milestones && selectedProject.milestones.length > 0 && (
                    <div className="border-t border-white/06 pt-4">
                      <p className="text-sm font-semibold mb-3.5 flex items-center gap-2 text-white">
                        <Target className="h-4 w-4 text-purple-400" /> Milestones
                      </p>
                      <div className="space-y-2.5">
                        {selectedProject.milestones.map(ms => (
                          <div key={ms.id} className="flex items-center gap-3 p-3 bg-white/5 border border-white/08 rounded-xl">
                            <div className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 ${ms.completed ? 'bg-emerald-500' : 'bg-transparent border-2 border-white/20'}`}>
                              {ms.completed && <CheckCircle className="h-3.5 w-3.5 text-white" />}
                            </div>
                            <span className={`flex-1 text-xs font-semibold ${ms.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>{ms.title}</span>
                            <span className="text-[10px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded-md">{new Date(ms.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}

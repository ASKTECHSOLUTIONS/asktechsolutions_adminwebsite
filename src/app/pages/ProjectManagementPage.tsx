import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, Search, Filter, FolderKanban, Calendar, Users, DollarSign,
  ChevronRight, TrendingUp, AlertCircle, CheckCircle, Clock, Pause,
  MoreVertical, Eye, Edit2, Trash2, Target, ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Progress } from '../components/ui/progress';
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

const statusConfig: Record<Project['status'], { label: string; color: string; icon: any; bg: string }> = {
  'planning': { label: 'Planning', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30', icon: Clock },
  'in-progress': { label: 'In Progress', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/30', icon: TrendingUp },
  'completed': { label: 'Completed', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30', icon: CheckCircle },
  'on-hold': { label: 'On Hold', color: 'text-slate-500', bg: 'bg-slate-50 dark:bg-slate-950/30', icon: Pause },
  'delayed': { label: 'Delayed', color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-950/30', icon: AlertCircle },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  'low': { label: 'Low', color: 'text-slate-500' },
  'medium': { label: 'Medium', color: 'text-amber-600' },
  'high': { label: 'High', color: 'text-orange-600' },
  'critical': { label: 'Critical', color: 'text-rose-600' },
};

const progressColor = (p: number) => {
  if (p >= 80) return 'bg-emerald-500';
  if (p >= 50) return 'bg-blue-500';
  if (p >= 25) return 'bg-amber-500';
  return 'bg-rose-500';
};

export function ProjectManagementPage({ onBack }: ProjectManagementPageProps) {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
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
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FolderKanban className="h-7 w-7 text-primary" /> Project Management
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">Track, manage and deliver projects</p>
          </div>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="gap-2 rounded-xl shadow-sm">
          <Plus className="h-4 w-4" /> New Project
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Projects', value: stats.total, icon: FolderKanban, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'In Progress', value: stats.inProgress, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-950/30' },
          { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-950/30' },
          { label: 'Delayed', value: stats.delayed, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-100 dark:bg-rose-950/30' },
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

      {/* Budget Overview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Budget Allocated</p>
                <p className="text-2xl font-bold">${stats.totalBudget.toLocaleString()}</p>
              </div>
              <div className="flex-1 max-w-xs">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Spent: ${stats.totalSpent.toLocaleString()}</span>
                  <span className="font-semibold">{Math.round((stats.totalSpent / stats.totalBudget) * 100)}%</span>
                </div>
                <Progress value={(stats.totalSpent / stats.totalBudget) * 100} className="h-2" />
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Remaining</p>
                <p className="text-xl font-bold text-emerald-600">${(stats.totalBudget - stats.totalSpent).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-9 rounded-xl" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px] rounded-xl">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((project, i) => {
            const status = statusConfig[project.status];
            const StatusIcon = status.icon;
            const priority = project.priority ? priorityConfig[project.priority] : null;
            const spentPercent = project.spent && project.budget ? (project.spent / project.budget) * 100 : 0;

            return (
              <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
                className="group">
                <Card className="h-full transition-shadow hover:shadow-lg overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 mr-2">
                        <CardTitle className="text-base font-bold leading-snug line-clamp-1">{project.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <Users className="h-3 w-3" /> {project.client}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl w-40">
                          <DropdownMenuItem onClick={() => { setSelectedProject(project); setShowDetailDialog(true); }}
                            className="rounded-lg gap-2 cursor-pointer">
                            <Eye className="h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer">
                            <Edit2 className="h-4 w-4" /> Edit Project
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(project.id)}
                            className="rounded-lg gap-2 cursor-pointer text-rose-600">
                            <Trash2 className="h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                        <StatusIcon className="h-3 w-3" /> {status.label}
                      </span>
                      {priority && (
                        <span className={`text-xs font-medium ${priority.color}`}>
                          ● {priority.label} Priority
                        </span>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${project.progress}%` }}
                          transition={{ duration: 1, delay: i * 0.05 }}
                          className={`h-full rounded-full ${progressColor(project.progress)}`}
                        />
                      </div>
                    </div>

                    {/* Budget */}
                    {project.spent !== undefined && (
                      <div>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-muted-foreground">Budget Used</span>
                          <span className="font-semibold">${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(spentPercent, 100)}%` }}
                            transition={{ duration: 1, delay: i * 0.05 + 0.2 }}
                            className={`h-full rounded-full ${spentPercent > 90 ? 'bg-rose-500' : spentPercent > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          />
                        </div>
                      </div>
                    )}

                    {/* Dates */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(project.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                      </div>
                      <ChevronRight className="h-3 w-3" />
                      <div className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        <span>{new Date(project.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>

                    {/* Team */}
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {project.team.slice(0, 4).map((member, mi) => (
                          <Avatar key={mi} className="h-7 w-7 border-2 border-background">
                            <AvatarFallback className="text-[10px] bg-primary text-primary-foreground">
                              {member.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {project.team.length > 4 && (
                          <div className="h-7 w-7 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-[10px] font-medium">
                            +{project.team.length - 4}
                          </div>
                        )}
                      </div>
                      <button onClick={() => { setSelectedProject(project); setShowDetailDialog(true); }}
                        className="text-xs text-primary hover:underline font-medium flex items-center gap-1">
                        View Details <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
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
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-primary" /> New Project
            </DialogTitle>
            <DialogDescription>Create a new project and assign teams</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <Label>Project Name *</Label>
                <Input placeholder="e.g. E-commerce Redesign" className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label>Client</Label>
                <Select>
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select client" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">TechCorp Industries</SelectItem>
                    <SelectItem value="2">Digital Innovations</SelectItem>
                    <SelectItem value="4">Enterprise Solutions</SelectItem>
                    <SelectItem value="6">Infinity Corp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Priority</Label>
                <Select>
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select priority" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Start Date</Label>
                <Input type="date" className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label>End Date</Label>
                <Input type="date" className="rounded-xl" />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>Budget ($)</Label>
                <Input type="number" placeholder="e.g. 85000" className="rounded-xl" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={() => { setShowAddDialog(false); toast.success('Project created successfully!'); }} className="rounded-xl">Create Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Project Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl rounded-2xl max-h-[85vh] overflow-y-auto">
          {selectedProject && (() => {
            const status = statusConfig[selectedProject.status];
            const StatusIcon = status.icon;
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl">{selectedProject.name}</DialogTitle>
                  <DialogDescription>{selectedProject.client}</DialogDescription>
                </DialogHeader>
                <div className="space-y-5 py-2">
                  {/* Status & Priority */}
                  <div className="flex gap-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.color}`}>
                      <StatusIcon className="h-3.5 w-3.5" /> {status.label}
                    </span>
                    {selectedProject.priority && (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium bg-secondary ${priorityConfig[selectedProject.priority].color}`}>
                        {priorityConfig[selectedProject.priority].label} Priority
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {selectedProject.description && (
                    <p className="text-sm text-muted-foreground">{selectedProject.description}</p>
                  )}

                  {/* Progress & Budget */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground mb-1">Progress</p>
                        <p className="text-2xl font-bold">{selectedProject.progress}%</p>
                        <Progress value={selectedProject.progress} className="mt-2 h-2" />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground mb-1">Budget</p>
                        <p className="text-2xl font-bold">${selectedProject.budget.toLocaleString()}</p>
                        {selectedProject.spent && (
                          <p className="text-xs text-muted-foreground mt-1">Spent: ${selectedProject.spent.toLocaleString()}</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Dates */}
                  <div className="flex gap-6">
                    <div>
                      <p className="text-xs text-muted-foreground">Start Date</p>
                      <p className="font-medium">{new Date(selectedProject.startDate).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Deadline</p>
                      <p className="font-medium">{new Date(selectedProject.endDate).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>

                  {/* Team */}
                  <div>
                    <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4" /> Team Members ({selectedProject.team.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.team.map((member, i) => (
                        <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full text-sm">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="text-[10px] bg-primary text-primary-foreground">{member.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {member}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Milestones */}
                  {selectedProject.milestones && selectedProject.milestones.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Target className="h-4 w-4" /> Milestones
                      </p>
                      <div className="space-y-2">
                        {selectedProject.milestones.map(ms => (
                          <div key={ms.id} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
                            <div className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 ${ms.completed ? 'bg-emerald-500' : 'bg-secondary border-2 border-border'}`}>
                              {ms.completed && <CheckCircle className="h-3.5 w-3.5 text-white" />}
                            </div>
                            <span className={`flex-1 text-sm ${ms.completed ? 'line-through text-muted-foreground' : ''}`}>{ms.title}</span>
                            <span className="text-xs text-muted-foreground">{new Date(ms.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
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

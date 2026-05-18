import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar, Clock, Video, Users, Plus, Search, MapPin,
  Link2, CheckCircle, XCircle, PlayCircle,
  MoreVertical, Edit2, Trash2, ArrowLeft, Bell
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
import { mockMeetings } from '../lib/mock-data';
import { Meeting } from '../lib/types';
import { toast } from 'sonner';

interface MeetingManagementPageProps {
  onBack?: () => void;
}

const statusConfig: Record<Meeting['status'], { label: string; color: string; icon: any; bg: string; border: string }> = {
  'scheduled': { label: 'Scheduled', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Clock },
  'ongoing': { label: 'Ongoing', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: PlayCircle },
  'completed': { label: 'Completed', color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', icon: CheckCircle },
  'cancelled': { label: 'Cancelled', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: XCircle },
};

const typeConfig: Record<Meeting['type'], { label: string; color: string; bg: string }> = {
  'internal': { label: 'Internal', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  'client': { label: 'Client', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  'interview': { label: 'Interview', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  'team': { label: 'Team Sync', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
};

export function MeetingManagementPage({ onBack }: MeetingManagementPageProps) {
  const [meetings, setMeetings] = useState<Meeting[]>(mockMeetings);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const filtered = meetings.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.organizer.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    const matchesType = typeFilter === 'all' || m.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: meetings.length,
    scheduled: meetings.filter(m => m.status === 'scheduled').length,
    completed: meetings.filter(m => m.status === 'completed').length,
    today: meetings.filter(m => m.date === '2026-05-18').length,
  };

  const upcoming = meetings
    .filter(m => m.status === 'scheduled')
    .sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime())
    .slice(0, 3);

  const handleDelete = (id: string) => {
    setMeetings(prev => prev.filter(m => m.id !== id));
    toast.success('Meeting removed');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.6 }}
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
              <Video className="h-7 w-7 text-blue-400" /> Meeting Management
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">Schedule, track and manage meetings</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(59,130,246,0.4)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddDialog(true)}
          className="gap-2 rounded-xl h-11 px-5 text-white font-semibold flex items-center justify-center cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}
        >
          <Plus className="h-4 w-4" /> Schedule Meeting
        </motion.button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Meetings', value: stats.total, icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
          { label: 'Scheduled', value: stats.scheduled, icon: Clock, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
          { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
          { label: "Today's Meetings", value: stats.today, icon: Bell, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Meetings Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.2 }}
          className="glass-card p-5 h-fit relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-blue-400" /> Upcoming Meetings
          </h3>
          <div className="space-y-3.5">
            {upcoming.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">No upcoming meetings</p>
            ) : upcoming.map((meeting, i) => {
              const status = statusConfig[meeting.status];
              return (
                <motion.div
                  key={meeting.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  whileHover={{ x: 4, scale: 1.01 }}
                  className="p-3 bg-white/5 border border-white/06 rounded-2xl cursor-pointer hover:bg-white/10 transition-colors"
                  onClick={() => { setSelectedMeeting(meeting); setShowDetailDialog(true); }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-bold text-foreground line-clamp-1">{meeting.title}</p>
                      <span className={`text-[10px] px-2 py-0.5 mt-1 rounded-full font-bold inline-block ${typeConfig[meeting.type].bg} ${typeConfig[meeting.type].color}`}>
                        {typeConfig[meeting.type].label}
                      </span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${status.bg} ${status.color} border ${status.border} font-bold`}>
                      {meeting.date === '2026-05-18' ? 'Today' : new Date(meeting.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground font-semibold">
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-blue-400" /> {meeting.time}</span>
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-purple-400" /> {meeting.attendees.length}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Main Meetings List */}
        <div className="lg:col-span-2 space-y-4">
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
                placeholder="Search meetings..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 rounded-xl bg-white/5 border-0 text-white placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0 h-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] rounded-xl bg-white/5 border-white/10 text-white h-10 focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10 rounded-xl text-white">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px] rounded-xl bg-white/5 border-white/10 text-white h-10 focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10 rounded-xl text-white">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="internal">Internal</SelectItem>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="team">Team Sync</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {/* Meeting Cards */}
          <AnimatePresence>
            <div className="space-y-3.5">
              {filtered.map((meeting, i) => {
                const status = statusConfig[meeting.status];
                const StatusIcon = status.icon;
                const type = typeConfig[meeting.type];

                return (
                  <motion.div
                    key={meeting.id}
                    initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ delay: i * 0.05, duration: 0.5 }}
                    whileHover={{ y: -3 }}
                    className="group relative cursor-default"
                  >
                    <div className="glass-card p-5 relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                      
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4 flex-1">
                          {/* Date Block */}
                          <div className="flex-shrink-0 w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex flex-col items-center justify-center">
                            <span className="text-[10px] text-blue-400 font-bold tracking-wider">
                              {new Date(meeting.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                            </span>
                            <span className="text-xl font-bold text-white leading-none mt-1">
                              {new Date(meeting.date).getDate()}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-bold text-sm text-white leading-snug">{meeting.title}</h4>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${type.bg} ${type.color}`}>
                                ● {type.label}
                              </span>
                            </div>
                            {meeting.description && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{meeting.description}</p>
                            )}

                            <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground font-semibold">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5 text-blue-400" /> {meeting.time} ({meeting.duration})
                              </span>
                              {meeting.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5 text-purple-400" /> {meeting.location}
                                </span>
                              )}
                              {meeting.meetingLink && (
                                <span className="flex items-center gap-1 text-cyan-400">
                                  <Link2 className="h-3.5 w-3.5" /> Online Link
                                </span>
                              )}
                            </div>

                            {/* Attendees */}
                            <div className="flex items-center gap-2 mt-3">
                              <div className="flex -space-x-1.5">
                                {meeting.attendees.slice(0, 4).map((a, ai) => (
                                  <Avatar key={ai} className="h-5.5 w-5.5 border border-slate-900">
                                    <AvatarFallback className="text-[9px] font-bold bg-slate-800 text-white">{a.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground font-semibold">
                                {meeting.attendees.length} attendee{meeting.attendees.length !== 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5 ml-2.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${status.bg} ${status.color} ${status.border}`}>
                            <StatusIcon className="h-3.5 w-3.5" /> {status.label}
                          </span>
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
                              className="w-40 rounded-xl p-1 bg-slate-900 border-white/10 text-white"
                            >
                              <DropdownMenuItem
                                onClick={() => { setSelectedMeeting(meeting); setShowDetailDialog(true); }}
                                className="rounded-lg gap-2.5 cursor-pointer p-2.5 hover:bg-white/5 text-xs font-semibold"
                              >
                                <Video className="h-4 w-4 text-blue-400" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="rounded-lg gap-2.5 cursor-pointer p-2.5 hover:bg-white/5 text-xs font-semibold">
                                <Edit2 className="h-4 w-4 text-purple-400" /> Edit Meeting
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(meeting.id)}
                                className="rounded-lg gap-2.5 cursor-pointer text-rose-400 p-2.5 hover:bg-rose-500/10 text-xs font-semibold"
                              >
                                <Trash2 className="h-4 w-4" /> Cancel
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Video className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No meetings found</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Meeting Dialog */}
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
              <Video className="h-5 w-5 text-blue-400" /> Schedule Meeting
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">Set up a new meeting or call</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Meeting Title *</Label>
              <Input
                placeholder="e.g. Q3 Planning Session"
                className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-10"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Date</Label>
                <Input type="date" className="rounded-xl bg-white/5 border-white/10 text-white h-10" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Time</Label>
                <Input type="time" className="rounded-xl bg-white/5 border-white/10 text-white h-10" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Duration</Label>
                <Select>
                  <SelectTrigger className="rounded-xl bg-white/5 border-white/10 text-white h-10">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10 text-white rounded-xl">
                    <SelectItem value="30m">30 minutes</SelectItem>
                    <SelectItem value="1h">1 hour</SelectItem>
                    <SelectItem value="1h30m">1.5 hours</SelectItem>
                    <SelectItem value="2h">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Type</Label>
                <Select>
                  <SelectTrigger className="rounded-xl bg-white/5 border-white/10 text-white h-10">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10 text-white rounded-xl">
                    <SelectItem value="internal">Internal</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="team">Team Sync</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Location / Meeting Link</Label>
              <Input
                placeholder="Conference Room A or https://meet.google.com/..."
                className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-10"
              />
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
              onClick={() => { setShowAddDialog(false); toast.success('Meeting scheduled!'); }}
              className="rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white"
            >
              Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Meeting Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent
          className="max-w-md rounded-3xl text-white border-white/10"
          style={{
            background: 'rgba(11, 17, 32, 0.97)',
            backdropFilter: 'blur(30px)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          }}
        >
          {selectedMeeting && (() => {
            const status = statusConfig[selectedMeeting.status];
            const StatusIcon = status.icon;
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="text-lg font-bold text-white">{selectedMeeting.title}</DialogTitle>
                  <DialogDescription className="text-slate-400 text-xs mt-0.5">{typeConfig[selectedMeeting.type].label} Meeting</DialogDescription>
                </DialogHeader>

                <div className="space-y-5 py-3">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${status.bg} ${status.color} ${status.border}`}>
                    <StatusIcon className="h-4 w-4" /> {status.label}
                  </span>

                  {selectedMeeting.description && (
                    <p className="text-sm text-slate-300 leading-relaxed">{selectedMeeting.description}</p>
                  )}

                  <Separator className="bg-white/06" />

                  <div className="space-y-3.5 text-xs font-semibold text-slate-300">
                    <div className="flex items-center gap-2.5">
                      <Calendar className="h-4 w-4 text-blue-400" />
                      <span>{new Date(selectedMeeting.date).toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Clock className="h-4 w-4 text-purple-400" />
                      <span>{selectedMeeting.time} · {selectedMeeting.duration}</span>
                    </div>
                    {selectedMeeting.location && (
                      <div className="flex items-center gap-2.5">
                        <MapPin className="h-4 w-4 text-rose-400" />
                        <span>{selectedMeeting.location}</span>
                      </div>
                    )}
                    {selectedMeeting.meetingLink && (
                      <div className="flex items-center gap-2.5">
                        <Link2 className="h-4 w-4 text-cyan-400" />
                        <a href={selectedMeeting.meetingLink} target="_blank" rel="noopener noreferrer"
                          className="text-cyan-400 hover:underline truncate">{selectedMeeting.meetingLink}</a>
                      </div>
                    )}
                  </div>

                  <Separator className="bg-white/06" />

                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Attendees ({selectedMeeting.attendees.length})</p>
                    <div className="space-y-2.5">
                      {selectedMeeting.attendees.map((a, i) => (
                        <div key={i} className="flex items-center gap-2.5">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback
                              className="text-[10px] font-bold text-white"
                              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
                            >
                              {a.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-semibold text-white">{a}</span>
                          {a === selectedMeeting.organizer && (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">Organizer</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}

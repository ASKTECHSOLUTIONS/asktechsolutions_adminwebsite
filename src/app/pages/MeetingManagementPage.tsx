import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar, Clock, Video, Users, Plus, Search, MapPin,
  Link2, CheckCircle, XCircle, AlertCircle, PlayCircle,
  MoreVertical, Edit2, Trash2, ArrowLeft, Bell
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
import { mockMeetings } from '../lib/mock-data';
import { Meeting } from '../lib/types';
import { toast } from 'sonner';

interface MeetingManagementPageProps {
  onBack?: () => void;
}

const statusConfig: Record<Meeting['status'], { label: string; color: string; icon: any; bg: string }> = {
  'scheduled': { label: 'Scheduled', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/30', icon: Clock },
  'ongoing': { label: 'Ongoing', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30', icon: PlayCircle },
  'completed': { label: 'Completed', color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-800/50', icon: CheckCircle },
  'cancelled': { label: 'Cancelled', color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-950/30', icon: XCircle },
};

const typeConfig: Record<Meeting['type'], { label: string; color: string }> = {
  'internal': { label: 'Internal', color: 'text-purple-600' },
  'client': { label: 'Client', color: 'text-blue-600' },
  'interview': { label: 'Interview', color: 'text-amber-600' },
  'team': { label: 'Team Sync', color: 'text-emerald-600' },
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
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Video className="h-7 w-7 text-primary" /> Meeting Management
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">Schedule, track and manage meetings</p>
          </div>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="gap-2 rounded-xl shadow-sm">
          <Plus className="h-4 w-4" /> Schedule Meeting
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Meetings', value: stats.total, icon: Calendar, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Scheduled', value: stats.scheduled, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-950/30' },
          { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-950/30' },
          { label: "Today's Meetings", value: stats.today, icon: Bell, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-950/30' },
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Meetings Sidebar */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Card className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" /> Upcoming Meetings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcoming.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No upcoming meetings</p>
              ) : upcoming.map((meeting, i) => {
                const status = statusConfig[meeting.status];
                return (
                  <motion.div key={meeting.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="p-3 bg-secondary/50 rounded-xl cursor-pointer hover:bg-secondary transition-colors"
                    onClick={() => { setSelectedMeeting(meeting); setShowDetailDialog(true); }}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold line-clamp-1">{meeting.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{typeConfig[meeting.type].label}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${status.bg} ${status.color} font-medium`}>
                        {meeting.date === '2026-05-18' ? 'Today' : new Date(meeting.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {meeting.time}</span>
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {meeting.attendees.length}</span>
                    </div>
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Meetings List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search meetings..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 rounded-xl" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] rounded-xl">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px] rounded-xl">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="internal">Internal</SelectItem>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="team">Team</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {/* Meeting Cards */}
          <AnimatePresence>
            <div className="space-y-3">
              {filtered.map((meeting, i) => {
                const status = statusConfig[meeting.status];
                const StatusIcon = status.icon;
                const type = typeConfig[meeting.type];

                return (
                  <motion.div key={meeting.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }} className="group">
                    <Card className="hover:shadow-md transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex gap-4 flex-1">
                            {/* Date Block */}
                            <div className="flex-shrink-0 w-14 h-14 bg-primary/10 rounded-xl flex flex-col items-center justify-center">
                              <span className="text-xs text-muted-foreground font-medium">
                                {new Date(meeting.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                              </span>
                              <span className="text-xl font-bold text-primary leading-none">
                                {new Date(meeting.date).getDate()}
                              </span>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold text-sm">{meeting.title}</h3>
                                <span className={`text-xs font-medium ${type.color}`}>● {type.label}</span>
                              </div>
                              {meeting.description && (
                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{meeting.description}</p>
                              )}

                              <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" /> {meeting.time} ({meeting.duration})
                                </span>
                                {meeting.location && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" /> {meeting.location}
                                  </span>
                                )}
                                {meeting.meetingLink && (
                                  <span className="flex items-center gap-1 text-blue-500">
                                    <Link2 className="h-3 w-3" /> Online
                                  </span>
                                )}
                              </div>

                              {/* Attendees */}
                              <div className="flex items-center gap-2 mt-2">
                                <div className="flex -space-x-1.5">
                                  {meeting.attendees.slice(0, 4).map((a, ai) => (
                                    <Avatar key={ai} className="h-5 w-5 border border-background">
                                      <AvatarFallback className="text-[9px] bg-secondary">{a.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                  ))}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {meeting.attendees.length} attendee{meeting.attendees.length !== 1 ? 's' : ''}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-start gap-2 ml-2">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                              <StatusIcon className="h-3 w-3" /> {status.label}
                            </span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                  <MoreVertical className="h-3.5 w-3.5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-xl w-40">
                                <DropdownMenuItem onClick={() => { setSelectedMeeting(meeting); setShowDetailDialog(true); }}
                                  className="rounded-lg gap-2 cursor-pointer text-sm">
                                  <Video className="h-3.5 w-3.5" /> View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer text-sm">
                                  <Edit2 className="h-3.5 w-3.5" /> Edit Meeting
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(meeting.id)}
                                  className="rounded-lg gap-2 cursor-pointer text-rose-600 text-sm">
                                  <Trash2 className="h-3.5 w-3.5" /> Cancel
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" /> Schedule Meeting
            </DialogTitle>
            <DialogDescription>Set up a new meeting or call</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Meeting Title *</Label>
              <Input placeholder="e.g. Q3 Planning Session" className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Date</Label>
                <Input type="date" className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label>Time</Label>
                <Input type="time" className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label>Duration</Label>
                <Select>
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30m">30 minutes</SelectItem>
                    <SelectItem value="1h">1 hour</SelectItem>
                    <SelectItem value="1h30m">1.5 hours</SelectItem>
                    <SelectItem value="2h">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select>
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internal">Internal</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="team">Team Sync</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Location / Meeting Link</Label>
              <Input placeholder="Conference Room A or https://meet.google.com/..." className="rounded-xl" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={() => { setShowAddDialog(false); toast.success('Meeting scheduled!'); }} className="rounded-xl">Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Meeting Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-md rounded-2xl">
          {selectedMeeting && (() => {
            const status = statusConfig[selectedMeeting.status];
            const StatusIcon = status.icon;
            return (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedMeeting.title}</DialogTitle>
                  <DialogDescription>{typeConfig[selectedMeeting.type].label} Meeting</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.color}`}>
                    <StatusIcon className="h-3.5 w-3.5" /> {status.label}
                  </span>

                  {selectedMeeting.description && (
                    <p className="text-sm text-muted-foreground">{selectedMeeting.description}</p>
                  )}

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(selectedMeeting.date).toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedMeeting.time} · {selectedMeeting.duration}</span>
                    </div>
                    {selectedMeeting.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedMeeting.location}</span>
                      </div>
                    )}
                    {selectedMeeting.meetingLink && (
                      <div className="flex items-center gap-2">
                        <Link2 className="h-4 w-4 text-muted-foreground" />
                        <a href={selectedMeeting.meetingLink} target="_blank" rel="noopener noreferrer"
                          className="text-blue-500 hover:underline truncate text-xs">{selectedMeeting.meetingLink}</a>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm font-semibold mb-2">Attendees ({selectedMeeting.attendees.length})</p>
                    <div className="space-y-1.5">
                      {selectedMeeting.attendees.map((a, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="text-xs bg-primary text-primary-foreground">{a.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{a}</span>
                          {a === selectedMeeting.organizer && (
                            <Badge variant="secondary" className="text-xs py-0">Organizer</Badge>
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

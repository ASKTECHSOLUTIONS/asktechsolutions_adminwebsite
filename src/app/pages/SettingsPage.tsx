import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Settings, Building2, Clock, Bell, Shield,
  Save, ArrowLeft, Globe, Mail, Phone, MapPin,
  Lock, AlertTriangle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';

interface SettingsPageProps {
  onBack?: () => void;
}

export function SettingsPage({ onBack }: SettingsPageProps) {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [leaveAlerts, setLeaveAlerts] = useState(true);
  const [paymentAlerts, setPaymentAlerts] = useState(true);
  const [meetingReminders, setMeetingReminders] = useState(true);
  const [autoLogout, setAutoLogout] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-3"
      >
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
            <Settings className="h-7 w-7 text-blue-400" /> Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage system preferences and configurations</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ delay: 0.1, duration: 0.6 }}
      >
        <Tabs defaultValue="company">
          <TabsList className="bg-white/5 border border-white/10 rounded-2xl p-1 h-auto flex-wrap gap-1 mb-6 text-white">
            <TabsTrigger
              value="company"
              className="rounded-xl gap-2 text-xs font-bold py-2.5 px-4 data-[state=active]:bg-blue-600 data-[state=active]:text-white cursor-pointer"
            >
              <Building2 className="h-4 w-4" /> Company
            </TabsTrigger>
            <TabsTrigger
              value="attendance"
              className="rounded-xl gap-2 text-xs font-bold py-2.5 px-4 data-[state=active]:bg-blue-600 data-[state=active]:text-white cursor-pointer"
            >
              <Clock className="h-4 w-4" /> Attendance
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="rounded-xl gap-2 text-xs font-bold py-2.5 px-4 data-[state=active]:bg-blue-600 data-[state=active]:text-white cursor-pointer"
            >
              <Bell className="h-4 w-4" /> Notifications
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="rounded-xl gap-2 text-xs font-bold py-2.5 px-4 data-[state=active]:bg-blue-600 data-[state=active]:text-white cursor-pointer"
            >
              <Shield className="h-4 w-4" /> Security
            </TabsTrigger>
          </TabsList>

          {/* Company Settings */}
          <TabsContent value="company" className="space-y-5">
            <div className="glass-card p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="mb-6">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-blue-400" /> Company Information
                </h3>
                <p className="text-xs text-muted-foreground mt-1 font-semibold">Update your company's basic details and contact information</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Company Name</Label>
                    <Input defaultValue="AskTechSolutions" className="rounded-xl bg-white/5 border-white/10 text-white h-10" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Website</Label>
                    <div className="relative rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input defaultValue="https://asktechsolutions.com" className="pl-9 rounded-xl bg-white/5 border-0 text-white placeholder:text-slate-500 h-10 focus-visible:ring-0 focus-visible:ring-offset-0" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Contact Email</Label>
                    <div className="relative rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input defaultValue="admin@asktechsolutions.com" className="pl-9 rounded-xl bg-white/5 border-0 text-white placeholder:text-slate-500 h-10 focus-visible:ring-0 focus-visible:ring-offset-0" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Phone Number</Label>
                    <div className="relative rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input defaultValue="+91 99887 65544" className="pl-9 rounded-xl bg-white/5 border-0 text-white placeholder:text-slate-500 h-10 focus-visible:ring-0 focus-visible:ring-offset-0" />
                    </div>
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Address</Label>
                    <div className="relative rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input defaultValue="Mumbai, Maharashtra, India" className="pl-9 rounded-xl bg-white/5 border-0 text-white placeholder:text-slate-500 h-10 focus-visible:ring-0 focus-visible:ring-offset-0" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Timezone</Label>
                    <Select defaultValue="IST">
                      <SelectTrigger className="rounded-xl bg-white/5 border-white/10 text-white h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10 text-white rounded-xl">
                        <SelectItem value="IST">IST – India Standard Time (UTC+5:30)</SelectItem>
                        <SelectItem value="UTC">UTC – Coordinated Universal Time</SelectItem>
                        <SelectItem value="EST">EST – Eastern Standard Time (UTC-5)</SelectItem>
                        <SelectItem value="PST">PST – Pacific Standard Time (UTC-8)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Currency</Label>
                    <Select defaultValue="USD">
                      <SelectTrigger className="rounded-xl bg-white/5 border-white/10 text-white h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10 text-white rounded-xl">
                        <SelectItem value="USD">USD – US Dollar</SelectItem>
                        <SelectItem value="INR">INR – Indian Rupee</SelectItem>
                        <SelectItem value="EUR">EUR – Euro</SelectItem>
                        <SelectItem value="GBP">GBP – British Pound</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(59,130,246,0.4)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="gap-2 rounded-xl h-11 px-5 text-white font-semibold flex items-center justify-center cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}
              >
                <Save className="h-4 w-4" /> Save Changes
              </motion.button>
            </div>
          </TabsContent>

          {/* Attendance Settings */}
          <TabsContent value="attendance" className="space-y-5">
            <div className="glass-card p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="mb-6">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-400" /> Attendance Rules
                </h3>
                <p className="text-xs text-muted-foreground mt-1 font-semibold">Configure attendance and working hour policies</p>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Office Start Time</Label>
                    <Input type="time" defaultValue="09:00" className="rounded-xl bg-white/5 border-white/10 text-white h-10" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Office End Time</Label>
                    <Input type="time" defaultValue="18:00" className="rounded-xl bg-white/5 border-white/10 text-white h-10" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Late Mark After (minutes)</Label>
                    <Input type="number" defaultValue="15" className="rounded-xl bg-white/5 border-white/10 text-white h-10" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Minimum Working Hours</Label>
                    <Input type="number" defaultValue="8" className="rounded-xl bg-white/5 border-white/10 text-white h-10" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Working Days</Label>
                    <Select defaultValue="mon-sat">
                      <SelectTrigger className="rounded-xl bg-white/5 border-white/10 text-white h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10 text-white rounded-xl">
                        <SelectItem value="mon-fri">Monday – Friday</SelectItem>
                        <SelectItem value="mon-sat">Monday – Saturday</SelectItem>
                        <SelectItem value="all">All 7 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Leave Quota (Annual)</Label>
                    <Input type="number" defaultValue="24" className="rounded-xl bg-white/5 border-white/10 text-white h-10" />
                  </div>
                </div>

                <Separator className="bg-white/06" />

                <div className="space-y-3">
                  {[
                    { label: 'Allow remote clock-in/out', sub: 'Employees can mark attendance from anywhere', value: true },
                    { label: 'Require geolocation for attendance', sub: 'GPS verification for office attendance', value: false },
                    { label: 'Auto-mark absent after office hours', sub: 'Automatically mark absent if not clocked in', value: true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3.5 bg-white/5 border border-white/04 rounded-2xl">
                      <div>
                        <p className="text-xs font-bold text-white">{item.label}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 font-semibold">{item.sub}</p>
                      </div>
                      <Switch defaultChecked={item.value} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(59,130,246,0.4)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="gap-2 rounded-xl h-11 px-5 text-white font-semibold flex items-center justify-center cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}
              >
                <Save className="h-4 w-4" /> Save Changes
              </motion.button>
            </div>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-5">
            <div className="glass-card p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="mb-6">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Bell className="h-4 w-4 text-blue-400" /> Notification Preferences
                </h3>
                <p className="text-xs text-muted-foreground mt-1 font-semibold">Choose how and when you want to be notified</p>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Email Notifications', sub: 'Receive notifications via email', value: emailNotifs, set: setEmailNotifs },
                  { label: 'Push Notifications', sub: 'Browser push notifications', value: pushNotifs, set: setPushNotifs },
                  { label: 'Leave Request Alerts', sub: 'New leave requests and approvals', value: leaveAlerts, set: setLeaveAlerts },
                  { label: 'Payment Due Alerts', sub: 'Payment reminders and overdue notices', value: paymentAlerts, set: setPaymentAlerts },
                  { label: 'Meeting Reminders', sub: 'Get reminded before scheduled meetings', value: meetingReminders, set: setMeetingReminders },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3.5 bg-white/5 border border-white/04 rounded-2xl">
                    <div>
                      <p className="text-xs font-bold text-white">{item.label}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 font-semibold">{item.sub}</p>
                    </div>
                    <Switch checked={item.value} onCheckedChange={item.set} />
                  </div>
                ))}

                <Separator className="bg-white/06" />

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Notification Sound</Label>
                  <Select defaultValue="default">
                    <SelectTrigger className="rounded-xl bg-white/5 border-white/10 text-white h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-white rounded-xl">
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="subtle">Subtle</SelectItem>
                      <SelectItem value="none">None (Silent)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(59,130,246,0.4)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="gap-2 rounded-xl h-11 px-5 text-white font-semibold flex items-center justify-center cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}
              >
                <Save className="h-4 w-4" /> Save Changes
              </motion.button>
            </div>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-5">
            <div className="glass-card p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="mb-6">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-400" /> Session & Security
                </h3>
                <p className="text-xs text-muted-foreground mt-1 font-semibold">Manage login security and session policies</p>
              </div>

              <div className="space-y-5">
                <div className="flex items-center justify-between p-3.5 bg-white/5 border border-white/04 rounded-2xl">
                  <div>
                    <p className="text-xs font-bold text-white">Two-Factor Authentication</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 font-semibold">Add extra security with 2FA for admin logins</p>
                  </div>
                  <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-white/5 border border-white/04 rounded-2xl">
                  <div>
                    <p className="text-xs font-bold text-white">Auto Logout on Inactivity</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 font-semibold">Automatically log out after inactivity period</p>
                  </div>
                  <Switch checked={autoLogout} onCheckedChange={setAutoLogout} />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Session Timeout (minutes)</Label>
                  <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                    <SelectTrigger className="rounded-xl bg-white/5 border-white/10 text-white h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-white rounded-xl">
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="480">8 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="bg-white/06" />

                <div className="space-y-3">
                  <p className="text-sm font-bold text-white">Password Policy</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Minimum Length</Label>
                      <Input type="number" defaultValue="8" className="rounded-xl bg-white/5 border-white/10 text-white h-10" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Password Expiry (days)</Label>
                      <Input type="number" defaultValue="90" className="rounded-xl bg-white/5 border-white/10 text-white h-10" />
                    </div>
                  </div>
                  {[
                    { label: 'Require uppercase letters', value: true },
                    { label: 'Require numbers', value: true },
                    { label: 'Require special characters', value: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3.5 bg-white/5 border border-white/04 rounded-2xl">
                      <p className="text-xs font-bold text-white">{item.label}</p>
                      <Switch defaultChecked={item.value} />
                    </div>
                  ))}
                </div>

                <Separator className="bg-white/06" />

                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-rose-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-rose-400">Danger Zone</p>
                      <p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed">These actions are irreversible. Proceed with extreme caution.</p>
                      <div className="flex gap-2.5 mt-3.5">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="h-8 px-3 rounded-lg text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 cursor-pointer"
                        >
                          Invalidate Sessions
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="h-8 px-3 rounded-lg text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 cursor-pointer"
                        >
                          Clear Activity Logs
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(59,130,246,0.4)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="gap-2 rounded-xl h-11 px-5 text-white font-semibold flex items-center justify-center cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}
              >
                <Save className="h-4 w-4" /> Save Changes
              </motion.button>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}

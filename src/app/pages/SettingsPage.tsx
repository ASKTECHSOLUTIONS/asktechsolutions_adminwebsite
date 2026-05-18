import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Settings, Building2, Clock, Bell, Shield, Moon, Sun, Monitor,
  Save, ArrowLeft, Globe, Mail, Phone, MapPin, ChevronRight,
  ToggleLeft, Lock, UserCog, AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
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
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-7 w-7 text-primary" /> Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage system preferences and configurations</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Tabs defaultValue="company">
          <TabsList className="rounded-xl p-1 h-auto flex-wrap gap-1 mb-6">
            <TabsTrigger value="company" className="rounded-lg gap-2 text-sm">
              <Building2 className="h-4 w-4" /> Company
            </TabsTrigger>
            <TabsTrigger value="attendance" className="rounded-lg gap-2 text-sm">
              <Clock className="h-4 w-4" /> Attendance
            </TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-lg gap-2 text-sm">
              <Bell className="h-4 w-4" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-lg gap-2 text-sm">
              <Shield className="h-4 w-4" /> Security
            </TabsTrigger>
          </TabsList>

          {/* Company Settings */}
          <TabsContent value="company" className="space-y-5">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" /> Company Information
                </CardTitle>
                <CardDescription>Update your company's basic details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Company Name</Label>
                    <Input defaultValue="AskTechSolutions" className="rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Website</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input defaultValue="https://asktechsolutions.com" className="pl-9 rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Contact Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input defaultValue="admin@asktechsolutions.com" className="pl-9 rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input defaultValue="+91 99887 65544" className="pl-9 rounded-xl" />
                    </div>
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <Label>Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input defaultValue="Mumbai, Maharashtra, India" className="pl-9 rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Timezone</Label>
                    <Select defaultValue="IST">
                      <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IST">IST – India Standard Time (UTC+5:30)</SelectItem>
                        <SelectItem value="UTC">UTC – Coordinated Universal Time</SelectItem>
                        <SelectItem value="EST">EST – Eastern Standard Time (UTC-5)</SelectItem>
                        <SelectItem value="PST">PST – Pacific Standard Time (UTC-8)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Currency</Label>
                    <Select defaultValue="USD">
                      <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD – US Dollar</SelectItem>
                        <SelectItem value="INR">INR – Indian Rupee</SelectItem>
                        <SelectItem value="EUR">EUR – Euro</SelectItem>
                        <SelectItem value="GBP">GBP – British Pound</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-end">
              <Button onClick={handleSave} className="rounded-xl gap-2">
                <Save className="h-4 w-4" /> Save Changes
              </Button>
            </div>
          </TabsContent>

          {/* Attendance Settings */}
          <TabsContent value="attendance" className="space-y-5">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" /> Attendance Rules
                </CardTitle>
                <CardDescription>Configure attendance and working hour policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Office Start Time</Label>
                    <Input type="time" defaultValue="09:00" className="rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Office End Time</Label>
                    <Input type="time" defaultValue="18:00" className="rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Late Mark After (minutes)</Label>
                    <Input type="number" defaultValue="15" className="rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Minimum Working Hours</Label>
                    <Input type="number" defaultValue="8" className="rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Working Days</Label>
                    <Select defaultValue="mon-sat">
                      <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mon-fri">Monday – Friday</SelectItem>
                        <SelectItem value="mon-sat">Monday – Saturday</SelectItem>
                        <SelectItem value="all">All 7 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Leave Quota (Annual)</Label>
                    <Input type="number" defaultValue="24" className="rounded-xl" />
                  </div>
                </div>
                <Separator />
                <div className="space-y-3">
                  {[
                    { label: 'Allow remote clock-in/out', sub: 'Employees can mark attendance from anywhere', value: true },
                    { label: 'Require geolocation for attendance', sub: 'GPS verification for office attendance', value: false },
                    { label: 'Auto-mark absent after office hours', sub: 'Automatically mark absent if not clocked in', value: true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.sub}</p>
                      </div>
                      <Switch defaultChecked={item.value} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-end">
              <Button onClick={handleSave} className="rounded-xl gap-2">
                <Save className="h-4 w-4" /> Save Changes
              </Button>
            </div>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-5">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Bell className="h-4 w-4 text-primary" /> Notification Preferences
                </CardTitle>
                <CardDescription>Choose how and when you want to be notified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: 'Email Notifications', sub: 'Receive notifications via email', value: emailNotifs, set: setEmailNotifs },
                  { label: 'Push Notifications', sub: 'Browser push notifications', value: pushNotifs, set: setPushNotifs },
                  { label: 'Leave Request Alerts', sub: 'New leave requests and approvals', value: leaveAlerts, set: setLeaveAlerts },
                  { label: 'Payment Due Alerts', sub: 'Payment reminders and overdue notices', value: paymentAlerts, set: setPaymentAlerts },
                  { label: 'Meeting Reminders', sub: 'Get reminded before scheduled meetings', value: meetingReminders, set: setMeetingReminders },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.sub}</p>
                    </div>
                    <Switch checked={item.value} onCheckedChange={item.set} />
                  </div>
                ))}

                <Separator className="my-2" />

                <div className="space-y-1.5">
                  <Label>Notification Sound</Label>
                  <Select defaultValue="default">
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="subtle">Subtle</SelectItem>
                      <SelectItem value="none">None (Silent)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-end">
              <Button onClick={handleSave} className="rounded-xl gap-2">
                <Save className="h-4 w-4" /> Save Changes
              </Button>
            </div>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-5">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" /> Session & Security
                </CardTitle>
                <CardDescription>Manage login security and session policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium">Two-Factor Authentication</p>
                    <p className="text-xs text-muted-foreground">Add extra security with 2FA for admin logins</p>
                  </div>
                  <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
                </div>

                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium">Auto Logout on Inactivity</p>
                    <p className="text-xs text-muted-foreground">Automatically log out after inactivity period</p>
                  </div>
                  <Switch checked={autoLogout} onCheckedChange={setAutoLogout} />
                </div>

                <div className="space-y-1.5">
                  <Label>Session Timeout (minutes)</Label>
                  <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="480">8 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-3">
                  <p className="text-sm font-semibold">Password Policy</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Minimum Length</Label>
                      <Input type="number" defaultValue="8" className="rounded-xl" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Password Expiry (days)</Label>
                      <Input type="number" defaultValue="90" className="rounded-xl" />
                    </div>
                  </div>
                  {[
                    { label: 'Require uppercase letters', value: true },
                    { label: 'Require numbers', value: true },
                    { label: 'Require special characters', value: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
                      <p className="text-sm font-medium">{item.label}</p>
                      <Switch defaultChecked={item.value} />
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-rose-700 dark:text-rose-400">Danger Zone</p>
                      <p className="text-xs text-rose-600 dark:text-rose-500 mt-0.5">These actions are irreversible. Proceed with extreme caution.</p>
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm" className="rounded-xl text-xs border-rose-300 text-rose-600 hover:bg-rose-50">
                          Invalidate All Sessions
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-xl text-xs border-rose-300 text-rose-600 hover:bg-rose-50">
                          Clear Activity Logs
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-end">
              <Button onClick={handleSave} className="rounded-xl gap-2">
                <Save className="h-4 w-4" /> Save Changes
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}

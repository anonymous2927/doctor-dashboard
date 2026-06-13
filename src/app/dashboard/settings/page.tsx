'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { DoctorConsultationApi } from '@/lib/api/doctorConsultationApi'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTheme } from 'next-themes'
import type { Doctor } from '@/types'
import { Save, Loader2, Moon, Sun, Globe, Shield } from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const { user } = useAuthStore()
  const { theme, setTheme } = useTheme()
  const doctorId = user?.id || ''

  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    mobile: '',
    specialization: '',
    qualification: '',
    experience: 0,
    hospital: '',
    clinic_address: '',
    consultation_fee: 0,
  })
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })
  const [notifications, setNotifications] = useState({
    email_notifications: true,
    sms_notifications: false,
    appointment_reminders: true,
    new_patient_alerts: true,
    marketing_emails: false,
  })
  const [language, setLanguage] = useState('en')
  const [loading, setLoading] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  useEffect(() => {
    async function fetchProfile() {
      if (!doctorId) { setLoading(false); return }
      try {
        const data = await DoctorConsultationApi.getDoctorProfile(doctorId)
        setProfile({
          full_name: data.full_name || '',
          email: data.email || '',
          mobile: data.mobile || '',
          specialization: data.specialization || '',
          qualification: data.qualification || '',
          experience: data.experience || 0,
          hospital: data.hospital || '',
          clinic_address: data.clinic_address || '',
          consultation_fee: data.consultation_fee || 0,
        })
      } catch {
        setProfile((prev) => ({ ...prev, email: user?.email || '' }))
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [doctorId, user])

  const handleSaveProfile = async () => {
    setSavingProfile(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('doctors')
        .upsert({
          doctor_id: doctorId,
          ...profile,
          updated_at: new Date().toISOString(),
        })
      if (error) throw error
      toast.success('Profile updated successfully')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setSavingProfile(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      toast.error('Passwords do not match')
      return
    }
    if (passwords.new.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setSavingPassword(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password: passwords.new })
      if (error) throw error
      toast.success('Password changed successfully')
      setPasswords({ current: '', new: '', confirm: '' })
    } catch {
      toast.error('Failed to change password')
    } finally {
      setSavingPassword(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="w-full sm:w-auto flex-nowrap overflow-x-auto">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Doctor Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input value={profile.full_name} onChange={(e) => setProfile((p) => ({ ...p, full_name: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Email</label>
                  <Input value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} type="email" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Mobile</label>
                  <Input value={profile.mobile} onChange={(e) => setProfile((p) => ({ ...p, mobile: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Specialization</label>
                  <Input value={profile.specialization} onChange={(e) => setProfile((p) => ({ ...p, specialization: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Qualification</label>
                  <Input value={profile.qualification} onChange={(e) => setProfile((p) => ({ ...p, qualification: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Experience (years)</label>
                  <Input value={profile.experience} onChange={(e) => setProfile((p) => ({ ...p, experience: parseInt(e.target.value) || 0 }))} type="number" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Hospital/Clinic</label>
                  <Input value={profile.hospital} onChange={(e) => setProfile((p) => ({ ...p, hospital: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Consultation Fee (INR)</label>
                  <Input value={profile.consultation_fee} onChange={(e) => setProfile((p) => ({ ...p, consultation_fee: parseInt(e.target.value) || 0 }))} type="number" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Clinic Address</label>
                <Textarea value={profile.clinic_address} onChange={(e) => setProfile((p) => ({ ...p, clinic_address: e.target.value }))} rows={2} />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={savingProfile} className="bg-emerald-600 hover:bg-emerald-700">
                  {savingProfile ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-w-md">
              <div className="space-y-1">
                <label className="text-sm font-medium">New Password</label>
                <Input value={passwords.new} onChange={(e) => setPasswords((p) => ({ ...p, new: e.target.value }))} type="password" placeholder="Enter new password" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Confirm New Password</label>
                <Input value={passwords.confirm} onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))} type="password" placeholder="Confirm new password" />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleChangePassword} disabled={savingPassword} className="bg-emerald-600 hover:bg-emerald-700">
                  {savingPassword ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'email_notifications', label: 'Email Notifications' },
                { key: 'sms_notifications', label: 'SMS Notifications' },
                { key: 'appointment_reminders', label: 'Appointment Reminders' },
                { key: 'new_patient_alerts', label: 'New Patient Alerts' },
                { key: 'marketing_emails', label: 'Marketing Emails' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <span className="text-sm">{item.label}</span>
                  <Switch
                    checked={notifications[item.key as keyof typeof notifications]}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({ ...prev, [item.key]: checked }))
                    }
                  />
                </div>
              ))}
              <Separator />
              <div className="flex justify-end">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Save className="h-4 w-4 mr-2" /> Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  Theme
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('light')}
                    className={theme === 'light' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                  >
                    <Sun className="h-4 w-4 mr-2" /> Light
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('dark')}
                    className={theme === 'dark' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                  >
                    <Moon className="h-4 w-4 mr-2" /> Dark
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Language
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                    <SelectItem value="bn">Bengali</SelectItem>
                    <SelectItem value="te">Telugu</SelectItem>
                    <SelectItem value="mr">Marathi</SelectItem>
                    <SelectItem value="ta">Tamil</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Session Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Manage your active sessions across devices.
                </p>
                <Button variant="outline" size="sm">
                  View Active Sessions
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Briefcase, BookOpen, UserPlus, Video, Key, Mail, Calendar, Clock, Trash2, Plus } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getAdminUsers, adminCreateUser, adminSendPasswordReset, adminUpdateUserPassword } from "@/app/actions/admin"

export default function AdminDashboardPage() {
  const supabase = createClient()
  const [role, setRole] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("users")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [users, setUsers] = useState<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [team, setTeam] = useState<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [vacancies, setVacancies] = useState<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [courses, setCourses] = useState<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [modules, setModules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Form states
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserRole, setNewUserRole] = useState("student")
  const [newUserName, setNewUserName] = useState("")
  const [newUserPassword, setNewUserPassword] = useState("")

  useEffect(() => {
    let mounted = true
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user && mounted) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
        if (profile && mounted) {
          setRole(profile.role)
        }
      }

      // Load Users
      try {
        const adminUsers = await getAdminUsers()
        if (mounted) setUsers(adminUsers)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.warn("Could not fetch admin users, falling back to profiles", err)
        const { data: profilesData } = await supabase.from('profiles').select('*')
        if (profilesData && mounted) setUsers(profilesData)
      }

      // Load Team
      const { data: teamData } = await supabase.from('team_members').select('*').order('order_index')
      if (teamData && mounted) setTeam(teamData)

      // Load Vacancies
      const { data: vacData } = await supabase.from('vacancies').select('*').order('created_at', { ascending: false })
      if (vacData && mounted) setVacancies(vacData)

      // Load Courses and Modules
      const { data: coursesData } = await supabase.from('courses').select('*')
      if (coursesData && mounted) {
        setCourses(coursesData)
        if (coursesData.length > 0) {
          const { data: modData } = await supabase.from('modules').select('*').eq('course_id', coursesData[0].id).order('order_index')
          if (modData && mounted) setModules(modData)
        }
      }

      if (mounted) setLoading(false)
    }
    loadData()
    return () => { mounted = false }
  }, [supabase])

  const handleUpdateYoutube = async (userId: string, url: string) => {
    const { error } = await supabase.from('profiles').update({ youtube_url: url }).eq('id', userId)
    if (error) {
      toast.error("Failed to update YouTube URL")
    } else {
      toast.success("YouTube URL updated")
      setUsers(users.map(u => u.id === userId ? { ...u, youtube_url: url } : u))
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await adminCreateUser(newUserEmail, newUserName, newUserRole, newUserPassword)
      toast.success("User created successfully!")
      setNewUserEmail("")
      setNewUserName("")
      setNewUserPassword("")
      // Reload users
      const adminUsers = await getAdminUsers()
      setUsers(adminUsers)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Failed to create user")
    }
  }

  const handleUpdateTeamMember = async (id: string, field: string, value: string) => {
    const { error } = await supabase.from('team_members').update({ [field]: value }).eq('id', id)
    if (error) {
      toast.error(`Failed to update ${field}`)
    } else {
      toast.success(`Updated ${field}`)
      setTeam(team.map(t => t.id === id ? { ...t, [field]: value } : t))
    }
  }

  const handleCreateModule = async () => {
    let courseId = courses[0]?.id
    if (!courseId) {
      // Create a default course if none exists
      const { data: newCourse, error: courseError } = await supabase.from('courses').insert({
        title: 'Openlead Academy - Onboarding Program',
        description: 'Default onboarding program.'
      }).select().single()
      if (courseError) {
        toast.error("Failed to create default course")
        return
      }
      courseId = newCourse.id
      setCourses([newCourse])
    }

    const newOrderIndex = modules.length > 0 ? Math.max(...modules.map(m => m.order_index)) + 1 : 0
    const { data: newModule, error } = await supabase.from('modules').insert({
      course_id: courseId,
      title: 'New Module',
      description: 'Module description...',
      order_index: newOrderIndex
    }).select().single()

    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Module created")
      setModules([...modules, newModule])
    }
  }

  const handleUpdateModule = async (id: string, field: string, value: string | number) => {
    const { error } = await supabase.from('modules').update({ [field]: value }).eq('id', id)
    if (error) {
      toast.error(`Failed to update ${field}`)
    } else {
      setModules(modules.map(m => m.id === id ? { ...m, [field]: value } : m))
      toast.success("Module updated")
    }
  }

  const handleDeleteModule = async (id: string) => {
    if (!confirm("Are you sure you want to delete this module? This will also delete all lessons in it.")) return
    const { error } = await supabase.from('modules').delete().eq('id', id)
    if (error) {
      toast.error(error.message)
    } else {
      setModules(modules.filter(m => m.id !== id))
      toast.success("Module deleted")
    }
  }

  const handleCreateVacancy = async () => {
    const { data: newVac, error } = await supabase.from('vacancies').insert({
      title: 'New Job Title',
      department: 'Sales',
      location: 'London',
      type: 'Full-time',
      remote_hybrid: 'Remote',
      description: 'Job description goes here...'
    }).select().single()

    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Vacancy created")
      setVacancies([newVac, ...vacancies])
    }
  }

  const handleUpdateVacancy = async (id: string, field: string, value: string | boolean) => {
    const { error } = await supabase.from('vacancies').update({ [field]: value }).eq('id', id)
    if (error) {
      toast.error(`Failed to update ${field}`)
    } else {
      setVacancies(vacancies.map(v => v.id === id ? { ...v, [field]: value } : v))
      toast.success("Vacancy updated")
    }
  }

  const handleDeleteVacancy = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vacancy?")) return
    const { error } = await supabase.from('vacancies').delete().eq('id', id)
    if (error) {
      toast.error(error.message)
    } else {
      setVacancies(vacancies.filter(v => v.id !== id))
      toast.success("Vacancy deleted")
    }
  }

  const [uploadingImage, setUploadingImage] = useState<string | null>(null)

  const handleImageUpload = async (id: string, file: File) => {
    try {
      setUploadingImage(id)
      const fileExt = file.name.split('.').pop()
      const fileName = `${id}-${Math.random()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      await handleUpdateTeamMember(id, 'image_url', data.publicUrl)
    } catch (error: Error | unknown) {
      const msg = error instanceof Error ? error.message : "Unknown error"
      toast.error(`Failed to upload image: ${msg}`)
    } finally {
      setUploadingImage(null)
    }
  }

  const [selectedUserForPassword, setSelectedUserForPassword] = useState<string | null>(null)
  const [newPasswordForUser, setNewPasswordForUser] = useState("")

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePasswordReset = async (email: string) => {
    if (!email) {
      toast.error("User does not have an email associated.")
      return
    }
    try {
      await adminSendPasswordReset(email)
      toast.success(`Password reset email sent to ${email}`)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset email")
    }
  }

  const handleChangePassword = async (userId: string) => {
    if (!newPasswordForUser || newPasswordForUser.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }
    try {
      await adminUpdateUserPassword(userId, newPasswordForUser)
      toast.success("Password updated successfully!")
      setSelectedUserForPassword(null)
      setNewPasswordForUser("")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Failed to update password")
    }
  }

  if (loading) return <div className="p-8">Loading...</div>

  if (role !== 'admin' && role !== 'trainer') {
    return <div className="p-8 text-red-600">Access Denied. You must be an admin or trainer.</div>
  }

  return (
    <div className="space-y-8 pb-12 h-full overflow-y-auto pr-2">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          {role === 'admin' ? 'Admin Dashboard' : 'Trainer Dashboard'}
        </h1>
      </div>

      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'users' ? 'border-[#008080] text-[#008080]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Manage Users
        </button>
        {role === 'admin' && (
          <button
            onClick={() => setActiveTab("team")}
            className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'team' ? 'border-[#008080] text-[#008080]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Leadership Team
          </button>
        )}
        {role === 'admin' && (
          <button
            onClick={() => setActiveTab("vacancies")}
            className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'vacancies' ? 'border-[#008080] text-[#008080]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Vacancies
          </button>
        )}
        {(role === 'admin' || role === 'trainer') && (
          <button
            onClick={() => setActiveTab("modules")}
            className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'modules' ? 'border-[#008080] text-[#008080]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Manage Modules
          </button>
        )}
      </div>

      {activeTab === 'users' && (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Add New User
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={newUserName} onChange={e => setNewUserName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Temporary Password</Label>
                  <Input type="password" value={newUserPassword} onChange={e => setNewUserPassword(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <select 
                    value={newUserRole} 
                    onChange={e => setNewUserRole(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  >
                    <option value="student">Student</option>
                    <option value="trainer">Trainer</option>
                    {role === 'admin' && <option value="admin">Admin</option>}
                  </select>
                </div>
                <div className="md:col-span-2 pt-2">
                  <Button type="submit" className="bg-[#14B8A6] hover:bg-[#0D9488] text-white">Create User</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Existing Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map(u => (
                  <div key={u.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{u.full_name || 'Unknown'}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-1">
                        <span className="text-sm text-gray-500 capitalize bg-gray-200 px-2 py-0.5 rounded-md font-medium">{u.role}</span>
                        {u.email && <span className="text-sm text-gray-600 flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {u.email}</span>}
                        {u.created_at && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> Joined: {new Date(u.created_at).toLocaleDateString()}
                          </span>
                        )}
                        {u.last_sign_in_at && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> Last active: {new Date(u.last_sign_in_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-2 mr-2 w-full sm:w-auto">
                        <Video className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <Input 
                          className="h-8 text-xs w-full sm:w-48"
                          placeholder="YouTube Channel URL" 
                          defaultValue={u.youtube_url || ''}
                          onBlur={(e) => {
                            if (e.target.value !== u.youtube_url) {
                              handleUpdateYoutube(u.id, e.target.value)
                            }
                          }}
                        />
                      </div>
                      
                      {u.email && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 text-xs flex items-center gap-1"
                          onClick={() => handlePasswordReset(u.email)}
                        >
                          <Mail className="w-3.5 h-3.5" /> Send Reset
                        </Button>
                      )}

                      <Dialog open={selectedUserForPassword === u.id} onOpenChange={(open) => {
                        if (open) setSelectedUserForPassword(u.id)
                        else { setSelectedUserForPassword(null); setNewPasswordForUser("") }
                      }}>
                        <div onClick={() => setSelectedUserForPassword(u.id)}>
                          <DialogTrigger>
                            <Button variant="outline" size="sm" className="h-8 text-xs flex items-center gap-1 text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-700">
                              <Key className="w-3.5 h-3.5" /> Set Password
                            </Button>
                          </DialogTrigger>
                        </div>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Change Password for {u.full_name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>New Password</Label>
                              <Input 
                                type="password" 
                                placeholder="Enter new password"
                                value={newPasswordForUser}
                                onChange={(e) => setNewPasswordForUser(e.target.value)}
                              />
                            </div>
                            <Button 
                              className="w-full bg-[#14B8A6] hover:bg-[#0D9488]"
                              onClick={() => handleChangePassword(u.id)}
                            >
                              Update Password
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'team' && role === 'admin' && (
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle>Manage Leadership Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {team.map(member => (
                <div key={member.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input 
                      defaultValue={member.name} 
                      onBlur={(e) => handleUpdateTeamMember(member.id, 'name', e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Role Title</Label>
                    <Input 
                      defaultValue={member.role_title} 
                      onBlur={(e) => handleUpdateTeamMember(member.id, 'role_title', e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Profile Image</Label>
                    <div className="flex items-center gap-3">
                      {member.image_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={member.image_url} alt={member.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                      )}
                      <div className="flex-1">
                        <Input 
                          type="file" 
                          accept="image/*"
                          disabled={uploadingImage === member.id}
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleImageUpload(member.id, e.target.files[0])
                            }
                          }} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'vacancies' && role === 'admin' && (
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Manage Vacancies
              </div>
              <Button onClick={handleCreateVacancy} className="bg-[#14B8A6] hover:bg-[#0D9488] text-white">
                <Plus className="w-4 h-4 mr-1" /> New Vacancy
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {vacancies.length === 0 && (
                <div className="text-sm text-gray-500 text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  No vacancies found. Click &quot;New Vacancy&quot; to add one.
                </div>
              )}
              {vacancies.map((vac) => (
                <div key={vac.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50 flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2 lg:col-span-2">
                      <Label>Title</Label>
                      <Input defaultValue={vac.title} onBlur={(e) => handleUpdateVacancy(vac.id, 'title', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Input defaultValue={vac.department} onBlur={(e) => handleUpdateVacancy(vac.id, 'department', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input defaultValue={vac.location} onBlur={(e) => handleUpdateVacancy(vac.id, 'location', e.target.value)} />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <select 
                        defaultValue={vac.type} 
                        onChange={(e) => handleUpdateVacancy(vac.id, 'type', e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Remote / Hybrid</Label>
                      <select 
                        defaultValue={vac.remote_hybrid} 
                        onChange={(e) => handleUpdateVacancy(vac.id, 'remote_hybrid', e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      >
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="On-site">On-site</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <select 
                        defaultValue={vac.is_active ? "active" : "inactive"} 
                        onChange={(e) => handleUpdateVacancy(vac.id, 'is_active', e.target.value === 'active')}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <textarea 
                      defaultValue={vac.description} 
                      onBlur={(e) => handleUpdateVacancy(vac.id, 'description', e.target.value)}
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button variant="ghost" onClick={() => handleDeleteVacancy(vac.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-3 text-xs">
                      <Trash2 className="w-4 h-4 mr-1.5" /> Delete Vacancy
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'modules' && (role === 'admin' || role === 'trainer') && (
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Manage Modules
              </div>
              <Button onClick={handleCreateModule} className="bg-[#14B8A6] hover:bg-[#0D9488] text-white">
                <Plus className="w-4 h-4 mr-1" /> New Module
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {modules.length === 0 && (
                <div className="text-sm text-gray-500 text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  No modules found. Click &quot;New Module&quot; to add one.
                </div>
              )}
              {modules.map((mod) => (
                <div key={mod.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50 flex flex-col gap-4 relative group">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pr-8">
                    <div className="space-y-2 md:col-span-2">
                      <Label>Module Title</Label>
                      <Input defaultValue={mod.title} onBlur={(e) => handleUpdateModule(mod.id, 'title', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Order / Sequence</Label>
                      <Input type="number" defaultValue={mod.order_index} onBlur={(e) => handleUpdateModule(mod.id, 'order_index', parseInt(e.target.value))} />
                    </div>
                  </div>
                  <div className="space-y-2 pr-8">
                    <Label>Description</Label>
                    <textarea 
                      defaultValue={mod.description || ''} 
                      onBlur={(e) => handleUpdateModule(mod.id, 'description', e.target.value)}
                      className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleDeleteModule(mod.id)} 
                    className="absolute top-2 right-2 text-red-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
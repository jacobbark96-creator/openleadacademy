"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Briefcase, BookOpen, UserPlus, Video, Key, Mail } from "lucide-react"
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
        {role === 'trainer' && (
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
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-gray-500 capitalize bg-gray-200 px-2 py-0.5 rounded-md font-medium">{u.role}</span>
                        {u.email && <span className="text-sm text-gray-600 flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {u.email}</span>}
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
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Manage Vacancies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 mb-4">You can add and manage job vacancies here.</p>
            <Button className="bg-[#14B8A6] hover:bg-[#0D9488] text-white">Create New Vacancy</Button>
            <div className="mt-6 text-sm text-gray-500 text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              Vacancy management interface goes here...
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'modules' && role === 'trainer' && (
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Manage Modules & Lessons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 mb-4">You can add, edit, and reorganize training modules here.</p>
            <Button className="bg-[#14B8A6] hover:bg-[#0D9488] text-white">Add New Module</Button>
            <div className="mt-6 text-sm text-gray-500 text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              Module management interface goes here...
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
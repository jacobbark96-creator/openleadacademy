import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Briefcase, BookOpen, UserPlus, Video, Key, Mail, Calendar, Clock, Trash2, Plus, Settings, Phone, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  role: string;
  phone?: string;
  youtube_url?: string;
  created_at?: string;
  last_sign_in_at?: string;
  enrollments?: string[];
}

interface TeamMember {
  id: string;
  name: string;
  role_title: string;
  image_url?: string;
  order_index: number;
}

interface Vacancy {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  remote_hybrid: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

interface Module {
  id: string;
  course_id: string;
  title: string;
  description: string;
  video_url?: string;
  order_index: number;
}

interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description: string;
  video_url?: string;
  order_index: number;
  week_number: number;
}

export default function AdminPage() {
  const [role, setRole] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("users")
  const [users, setUsers] = useState<UserProfile[]>([])
  const [team, setTeam] = useState<TeamMember[]>([])
  const [vacancies, setVacancies] = useState<Vacancy[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)

  // Form states
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserRole, setNewUserRole] = useState("student")
  const [newUserName, setNewUserName] = useState("")
  const [newUserPassword, setNewUserPassword] = useState("")

  const loadUsers = async (mounted: boolean) => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-manage-users', {
        body: { action: 'list' }
      })
      
      if (mounted && !error) {
        setUsers(data)
      } else if (error) {
        console.warn("API error, falling back:", error)
        const { data: profilesData } = await supabase.from('profiles').select('*')
        if (profilesData && mounted) setUsers(profilesData)
      }
    } catch (err) {
      console.warn("Could not fetch admin users, falling back to profiles", err)
      const { data: profilesData } = await supabase.from('profiles').select('*')
      if (profilesData && mounted) setUsers(profilesData)
    }
  }

  useEffect(() => {
    let mounted = true
    async function loadData() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user && mounted) {
          const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
          if (profile && mounted) {
            setRole(profile.role)
          }
        }

        // Load Users via Edge Function
        await loadUsers(mounted)

        // Load Team
        const { data: teamData } = await supabase.from('team_members').select('*').order('order_index')
        if (teamData && mounted) setTeam(teamData)

        // Load Vacancies
        const { data: vacData } = await supabase.from('vacancies').select('*').order('created_at', { ascending: false })
        if (vacData && mounted) setVacancies(vacData)

        // Load Courses and Modules
        const { data: coursesData } = await supabase.from('courses').select('*').order('created_at', { ascending: false })
        if (coursesData && mounted) {
          setCourses(coursesData)
          if (coursesData.length > 0) {
            const firstCourseId = coursesData[0].id
            setSelectedCourseId(firstCourseId)
            const { data: modData } = await supabase.from('modules').select('*').eq('course_id', firstCourseId).order('order_index')
            if (modData && mounted) setModules(modData)
          }
        }
      } catch (err) {
        console.error("Error loading admin data:", err)
        toast.error("Failed to load some dashboard data")
      } finally {
        if (mounted) setLoading(false)
      }
    }
    loadData()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    async function loadModules() {
      if (!selectedCourseId) return
      const { data: modData } = await supabase.from('modules').select('*').eq('course_id', selectedCourseId).order('order_index')
      if (modData) setModules(modData)
    }
    loadModules()
  }, [selectedCourseId])

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
    const loadingToast = toast.loading("Creating user...")
    try {
      const { data, error } = await supabase.functions.invoke('admin-manage-users', {
        body: {
          action: 'create',
          email: newUserEmail,
          fullName: newUserName,
          role: newUserRole,
          password: newUserPassword
        }
      })
      
      toast.dismiss(loadingToast)

      if (error) {
        toast.error(error.message || "Failed to create user")
        return
      }

      toast.success("User created successfully!")
      setNewUserEmail("")
      setNewUserName("")
      setNewUserPassword("")
      
      // Reload users
      await loadUsers(true)
    } catch (error: unknown) {
      toast.dismiss(loadingToast)
      const msg = error instanceof Error ? error.message : String(error)
      console.error("Create user error:", msg)
      toast.error(`Error: ${msg}`)
    }
  }

  const handleUpdateTeamMember = async (id: string, field: string, value: string) => {
    const { error } = await supabase.from('team_members').update({ [field]: value }).eq('id', id)
    if (error) {
      toast.error(`Failed to update ${field}`)
    } else {
      setTeam(team.map(t => t.id === id ? { ...t, [field]: value } : t))
      toast.success("Team member updated")
    }
  }
  
  const handleCreateCourse = async () => {
    const { data: newCourse, error } = await supabase.from('courses').insert({
      title: 'New Course',
      description: 'Course description...'
    }).select().single()

    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Course created")
      setCourses([newCourse, ...courses])
      setSelectedCourseId(newCourse.id)
    }
  }

  const handleUpdateCourse = async (id: string, field: string, value: string) => {
    const { error } = await supabase.from('courses').update({ [field]: value }).eq('id', id)
    if (error) {
      toast.error(`Failed to update ${field}`)
    } else {
      setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c))
      toast.success("Course updated")
    }
  }

  const handleDeleteCourse = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course? This will also delete all modules and lessons in it.")) return
    const { error } = await supabase.from('courses').delete().eq('id', id)
    if (error) {
      toast.error(error.message)
    } else {
      setCourses(courses.filter(c => c.id !== id))
      if (selectedCourseId === id) {
        setSelectedCourseId(courses.length > 1 ? (courses.find(c => c.id !== id)?.id ?? null) : null)
      }
      toast.success("Course deleted")
    }
  }

  const handleCreateModule = async () => {
    if (!selectedCourseId) {
      toast.error("Please select or create a course first")
      return
    }

    const newOrderIndex = modules.length > 0 ? Math.max(...modules.map(m => m.order_index)) + 1 : 0
    const { data: newModule, error } = await supabase.from('modules').insert({
      course_id: selectedCourseId,
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

  useEffect(() => {
    async function loadLessons() {
      if (!selectedModuleId) {
        setLessons([])
        return
      }
      const { data: lessonData } = await supabase.from('lessons').select('*').eq('module_id', selectedModuleId).order('order_index')
      if (lessonData) setLessons(lessonData)
    }
    loadLessons()
  }, [selectedModuleId])

  const handleCreateLesson = async (moduleId: string) => {
    const newOrderIndex = lessons.length > 0 ? Math.max(...lessons.map(l => l.order_index)) + 1 : 0
    const { data: newLesson, error } = await supabase.from('lessons').insert({
      module_id: moduleId,
      title: 'New Lesson',
      description: 'Lesson content/notes...',
      video_url: '',
      order_index: newOrderIndex,
      week_number: 1
    }).select().single()

    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Lesson created")
      setLessons([...lessons, newLesson])
    }
  }

  const handleUpdateLesson = async (id: string, field: string, value: string | number) => {
    const { error } = await supabase.from('lessons').update({ [field]: value }).eq('id', id)
    if (error) {
      toast.error(`Failed to update ${field}`)
    } else {
      setLessons(lessons.map(l => l.id === id ? { ...l, [field]: value } : l))
      toast.success("Lesson updated")
    }
  }

  const handleDeleteLesson = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return
    const { error } = await supabase.from('lessons').delete().eq('id', id)
    if (error) {
      toast.error(error.message)
    } else {
      setLessons(lessons.filter(l => l.id !== id))
      toast.success("Lesson deleted")
    }
  }
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

  // User Details Modal States
  const [selectedUserForDetails, setSelectedUserForDetails] = useState<UserProfile | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [editingUserDetails, setEditingUserDetails] = useState({
    full_name: "",
    phone: "",
    role: "",
    enrollments: [] as string[]
  })
  const [isUpdatingDetails, setIsUpdatingDetails] = useState(false)

  const handlePasswordReset = async (email: string) => {
    if (!email) {
      toast.error("User does not have an email associated.")
      return
    }
    try {
      const { error } = await supabase.functions.invoke('admin-manage-users', {
        body: { action: 'reset-password', email }
      })
      if (error) {
        toast.error(error.message || "Failed to send reset email")
        return
      }
      toast.success(`Password reset email sent to ${email}`)
    } catch {
      toast.error("Failed to connect to the server.")
    }
  }

  const handleChangePassword = async (userId: string) => {
    if (!newPasswordForUser || newPasswordForUser.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }
    try {
      const { error } = await supabase.functions.invoke('admin-manage-users', {
        body: { action: 'update-password', userId, password: newPasswordForUser }
      })
      if (error) {
        toast.error(error.message || "Failed to update password")
        return
      }
      toast.success("Password updated successfully!")
      setSelectedUserForPassword(null)
      setNewPasswordForUser("")
    } catch {
      toast.error("Failed to connect to the server.")
    }
  }

  const handleOpenDetails = (user: UserProfile) => {
    setSelectedUserForDetails(user)
    setEditingUserDetails({
      full_name: user.full_name || "",
      phone: user.phone || "",
      role: user.role || "student",
      enrollments: user.enrollments || []
    })
    setIsDetailsModalOpen(true)
  }

  const handleUpdateUserDetails = async () => {
    if (!selectedUserForDetails) return
    setIsUpdatingDetails(true)
    try {
      // Update profile details and enrollments via Edge Function
      const { error } = await supabase.functions.invoke('admin-manage-users', {
        body: {
          action: 'update-profile',
          userId: selectedUserForDetails.id,
          fullName: editingUserDetails.full_name,
          phone: editingUserDetails.phone,
          role: editingUserDetails.role,
          enrollments: editingUserDetails.enrollments
        }
      })

      if (error) {
        toast.error(error.message || "Failed to update user")
        setIsUpdatingDetails(false)
        return
      }

      toast.success("User updated successfully")
      setIsDetailsModalOpen(false)
      
      // Refresh users list
      await loadUsers(true)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      toast.error(`An unexpected error occurred while updating user: ${msg}`)
    } finally {
      setIsUpdatingDetails(false)
    }
  }

  const toggleEnrollment = (courseId: string) => {
    setEditingUserDetails(prev => {
      const isEnrolled = prev.enrollments.includes(courseId)
      if (isEnrolled) {
        return { ...prev, enrollments: prev.enrollments.filter(id => id !== courseId) }
      } else {
        return { ...prev, enrollments: [...prev.enrollments, courseId] }
      }
    })
  }

  if (loading) return <div className="p-8">Loading...</div>

  if (role !== 'admin' && role !== 'trainer') {
    return <div className="p-8 text-red-600">Access Denied. You must be an admin or trainer.</div>
  }

  return (
    <div className="space-y-8 pb-12 h-full overflow-y-auto pr-2 text-slate-900">
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
                      <div className="flex items-center gap-3">
                        <p className="font-bold text-gray-900 text-lg">{u.full_name || 'Unknown'}</p>
                        <span className="text-xs text-gray-500 capitalize bg-white border border-gray-200 px-2 py-0.5 rounded-full font-semibold shadow-sm">{u.role}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2">
                        {u.email && (
                          <div className="flex items-center gap-2 text-[#008080] font-bold bg-[#008080]/10 px-3 py-1.5 rounded-lg border border-[#008080]/20 shadow-sm">
                            <Mail className="w-4 h-4" />
                            <span className="text-base">{u.email}</span>
                          </div>
                        )}
                        {u.phone && (
                          <div className="flex items-center gap-2 text-gray-600 bg-white border border-gray-100 px-2.5 py-1 rounded-lg">
                            <Phone className="w-3.5 h-3.5" />
                            <span className="text-sm">{u.phone}</span>
                          </div>
                        )}
                        {u.created_at && (
                          <span className="text-xs text-gray-500 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" /> {new Date(u.created_at).toLocaleDateString()}
                          </span>
                        )}
                        {u.last_sign_in_at && (
                          <span className="text-xs text-gray-500 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" /> Last seen {new Date(u.last_sign_in_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      <Button 
                        onClick={() => handleOpenDetails(u)}
                        variant="default" 
                        size="sm" 
                        className="h-9 bg-[#008080] hover:bg-[#006666] text-white flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4" /> Manage User
                      </Button>

                      <div className="flex items-center gap-2 mr-2 w-full sm:w-auto mt-2 xl:mt-0">
                        <Video className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <Input 
                          className="h-9 text-xs w-full sm:w-48"
                          placeholder="YouTube Channel URL" 
                          defaultValue={u.youtube_url || ''}
                          onBlur={(e) => {
                            if (e.target.value !== u.youtube_url) {
                              handleUpdateYoutube(u.id, e.target.value)
                            }
                          }}
                        />
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2 xl:mt-0">
                        {u.email && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-9 text-xs flex items-center gap-1 border-gray-200 hover:bg-gray-100"
                            onClick={() => u.email && handlePasswordReset(u.email)}
                          >
                            <Mail className="w-3.5 h-3.5" /> Send Reset
                          </Button>
                        )}

                        <Dialog open={selectedUserForPassword === u.id} onOpenChange={(open) => {
                          if (open) setSelectedUserForPassword(u.id)
                          else { setSelectedUserForPassword(null); setNewPasswordForUser("") }
                        }}>
                          <div onClick={() => setSelectedUserForPassword(u.id)}>
                            <DialogTrigger
                              render={
                                <Button variant="outline" size="sm" className="h-9 text-xs flex items-center gap-1 text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-700">
                                  <Key className="w-3.5 h-3.5" /> Set Password
                                </Button>
                              }
                            />
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
                  </div>
                ))}
              </div>
            </CardContent>

            {/* User Details & Enrollment Modal */}
            <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
              <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-xl">
                    <Settings className="w-5 h-5" />
                    Manage User Details
                  </DialogTitle>
                </DialogHeader>
                
                {selectedUserForDetails && (
                  <div className="space-y-6 py-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input 
                          value={editingUserDetails.full_name}
                          onChange={e => setEditingUserDetails({...editingUserDetails, full_name: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Email Address</Label>
                        <Input value={selectedUserForDetails.email} disabled className="bg-gray-50 opacity-70" />
                        <p className="text-[10px] text-gray-400">Email cannot be changed here</p>
                      </div>

                      <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <Input 
                          placeholder="+44 7000 000000"
                          value={editingUserDetails.phone}
                          onChange={e => setEditingUserDetails({...editingUserDetails, phone: e.target.value})}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>System Role</Label>
                        <select 
                          value={editingUserDetails.role} 
                          onChange={e => setEditingUserDetails({...editingUserDetails, role: e.target.value})}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        >
                          <option value="student">Student</option>
                          <option value="trainer">Trainer</option>
                          {role === 'admin' && <option value="admin">Admin</option>}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base font-bold flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-[#008080]" />
                        Course Enrollments
                      </Label>
                      <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto p-1">
                        {courses.length === 0 && (
                          <p className="text-sm text-gray-500 italic">No courses available to assign.</p>
                        )}
                        {courses.map(course => {
                          const isEnrolled = editingUserDetails.enrollments.includes(course.id)
                          return (
                            <div 
                              key={course.id}
                              onClick={() => toggleEnrollment(course.id)}
                              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                                isEnrolled 
                                  ? 'border-[#008080] bg-[#008080]/5' 
                                  : 'border-gray-100 bg-gray-50 hover:bg-gray-100'
                              }`}
                            >
                              <span className={`text-sm font-medium ${isEnrolled ? 'text-[#008080]' : 'text-gray-700'}`}>
                                {course.title}
                              </span>
                              {isEnrolled ? (
                                <CheckCircle2 className="w-5 h-5 text-[#008080]" />
                              ) : (
                                <Plus className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setIsDetailsModalOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        className="flex-1 bg-[#008080] hover:bg-[#006666]"
                        onClick={handleUpdateUserDetails}
                        disabled={isUpdatingDetails}
                      >
                        {isUpdatingDetails ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
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
                  No vacancies found. Click "New Vacancy" to add one.
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Courses Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="border-0 shadow-sm rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  Courses
                  <Button size="sm" onClick={handleCreateCourse} className="h-8 bg-[#14B8A6] hover:bg-[#0D9488]">
                    <Plus className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {courses.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No courses yet.</p>
                )}
                {courses.map(course => (
                  <div 
                    key={course.id}
                    onClick={() => setSelectedCourseId(course.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedCourseId === course.id 
                        ? 'border-[#008080] bg-[#008080]/5 shadow-sm' 
                        : 'border-gray-100 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className={`font-semibold text-sm ${selectedCourseId === course.id ? 'text-[#008080]' : 'text-gray-900'}`}>
                        {course.title}
                      </p>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteCourse(course.id); }}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {selectedCourseId && (
              <Card className="border-0 shadow-sm rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Course Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Course Title</Label>
                    <Input 
                      key={`${selectedCourseId}-title`}
                      className="h-8 text-sm"
                      defaultValue={courses.find(c => c.id === selectedCourseId)?.title || ''}
                      onBlur={(e) => handleUpdateCourse(selectedCourseId, 'title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Description</Label>
                    <textarea 
                      key={`${selectedCourseId}-desc`}
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background"
                      defaultValue={courses.find(c => c.id === selectedCourseId)?.description || ''}
                      onBlur={(e) => handleUpdateCourse(selectedCourseId, 'description', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Modules List */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-sm rounded-2xl h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Modules in {courses.find(c => c.id === selectedCourseId)?.title || 'Selected Course'}
                  </div>
                  <Button 
                    disabled={!selectedCourseId}
                    onClick={handleCreateModule} 
                    className="bg-[#14B8A6] hover:bg-[#0D9488] text-white"
                  >
                    <Plus className="w-4 h-4 mr-1" /> New Module
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {!selectedCourseId && (
                    <div className="text-sm text-gray-500 text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      Select a course on the left to manage its modules.
                    </div>
                  )}
                  {selectedCourseId && modules.length === 0 && (
                    <div className="text-sm text-gray-500 text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      No modules found for this course. Click "New Module" to add one.
                    </div>
                  )}
                  {selectedCourseId && modules.map((mod) => (
                    <div key={mod.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50 flex flex-col gap-4 relative group">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pr-8">
                        <div className="space-y-2 md:col-span-2">
                          <Label className="text-xs text-gray-500">Module Title</Label>
                          <Input defaultValue={mod.title} onBlur={(e) => handleUpdateModule(mod.id, 'title', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-500">Order</Label>
                          <Input type="number" defaultValue={mod.order_index} onBlur={(e) => handleUpdateModule(mod.id, 'order_index', parseInt(e.target.value))} />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-500">Intro Video URL (YouTube)</Label>
                          <div className="flex gap-2">
                            <Video className="w-4 h-4 text-gray-400 mt-3" />
                            <Input 
                              placeholder="https://www.youtube.com/watch?v=..." 
                              defaultValue={mod.video_url || ''} 
                              onBlur={(e) => handleUpdateModule(mod.id, 'video_url', e.target.value)} 
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-500">Description</Label>
                          <textarea 
                            defaultValue={mod.description || ''} 
                            onBlur={(e) => handleUpdateModule(mod.id, 'description', e.target.value)}
                            className="flex min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background"
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex justify-between items-center pr-8">
                        <Dialog open={selectedModuleId === mod.id} onOpenChange={(open) => setSelectedModuleId(open ? mod.id : null)}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-[#008080] border-[#008080]/30 hover:bg-[#008080]/5">
                              <Plus className="w-4 h-4 mr-2" /> Manage Lessons
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-[#008080]" />
                                Lessons in {mod.title}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                              <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-500">Add and manage the lessons for this module.</p>
                                <Button size="sm" onClick={() => handleCreateLesson(mod.id)} className="bg-[#14B8A6] hover:bg-[#0D9488]">
                                  <Plus className="w-4 h-4 mr-1" /> Add Lesson
                                </Button>
                              </div>

                              <div className="space-y-4">
                                {lessons.length === 0 && (
                                  <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400 text-sm">
                                    No lessons yet. Click "Add Lesson" to begin.
                                  </div>
                                )}
                                {lessons.map((lesson, idx) => (
                                  <div key={lesson.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50 space-y-4 relative group/lesson">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pr-8">
                                      <div className="space-y-2 md:col-span-2">
                                        <Label className="text-xs">Lesson {idx + 1} Title</Label>
                                        <Input 
                                          defaultValue={lesson.title} 
                                          onBlur={(e) => handleUpdateLesson(lesson.id, 'title', e.target.value)} 
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="text-xs">Week #</Label>
                                        <Input 
                                          type="number" 
                                          defaultValue={lesson.week_number} 
                                          onBlur={(e) => handleUpdateLesson(lesson.id, 'week_number', parseInt(e.target.value))} 
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="text-xs">Order</Label>
                                        <Input 
                                          type="number" 
                                          defaultValue={lesson.order_index} 
                                          onBlur={(e) => handleUpdateLesson(lesson.id, 'order_index', parseInt(e.target.value))} 
                                        />
                                      </div>
                                    </div>
                                    <div className="space-y-2 pr-8">
                                      <Label className="text-xs">YouTube Video URL</Label>
                                      <Input 
                                        placeholder="https://www.youtube.com/watch?v=..." 
                                        defaultValue={lesson.video_url || ''} 
                                        onBlur={(e) => handleUpdateLesson(lesson.id, 'video_url', e.target.value)} 
                                      />
                                    </div>
                                    <div className="space-y-2 pr-8">
                                      <Label className="text-xs">Course Content</Label>
                                      <textarea 
                                        placeholder="Add course content, detailed notes, or instructions for this lesson..."
                                        defaultValue={lesson.description || ''} 
                                        onBlur={(e) => handleUpdateLesson(lesson.id, 'description', e.target.value)}
                                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                      />
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      onClick={() => handleDeleteLesson(lesson.id)} 
                                      className="absolute top-2 right-2 text-red-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0 opacity-0 group-hover/lesson:opacity-100 transition-opacity"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
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
          </div>
        </div>
      )}
    </div>
  )
}

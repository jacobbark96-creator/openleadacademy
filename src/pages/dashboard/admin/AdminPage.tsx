import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Briefcase, BookOpen, UserPlus, Video, Key, Mail, Calendar, Clock, Trash2, Plus, Settings, Phone, CheckCircle2, Trophy, ShieldCheck, Search, Filter, FileText, Info } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useTenant } from "@/providers/TenantProvider"

interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  role: string;
  phone?: string;
  created_at?: string;
  last_sign_in_at?: string;
  enrollments?: string[];
  nda_signed?: boolean;
  nda_signed_at?: string;
  subcontractor_signed?: boolean;
  subcontractor_signed_at?: string;
  agreement_signature_name?: string;
  signup_fee?: number;
  signup_fee_currency?: string;
  has_paid_signup_fee?: boolean;
  fee_breakdown?: { name: string; amount: number }[];
  accepted_legal_documents?: string[];
  custom_payment_url?: string;
  is_online?: boolean;
  last_seen_at?: string;
  last_path?: string;
  completed_modules_count?: number;
  total_modules_count?: number;
  completed_module_titles?: string[];
  completed_lesson_ids?: string[];
  passed_quiz_ids?: string[];
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
  image_url?: string;
  created_at: string;
}

interface Module {
  id: string;
  course_id: string;
  title: string;
  description: string;
  video_url?: string;
  image_url?: string;
  order_index: number;
}

interface Quiz {
  id: string;
  module_id?: string;
  lesson_id?: string;
  title: string;
  passing_score: number;
}

interface QuizQuestion {
  id: string;
  quiz_id: string;
  question: string;
  options: string[];
  correct_option_index: number;
  order_index: number;
}

interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description: string;
  video_url?: string;
  audio_url?: string;
  image_url?: string;
  order_index: number;
  week_number: number;
  has_homework: boolean;
  homework_type?: 'link' | 'upload';
}

interface LibraryResource {
  id: string;
  title: string;
  url: string;
  type: string;
  image_url?: string;
  description?: string;
  category?: string;
  created_at: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
}

interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  order_index: number;
}

export default function AdminPage() {
  const { company } = useTenant()
  const [role, setRole] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("users")
  const [users, setUsers] = useState<UserProfile[]>([])
  const [team, setTeam] = useState<TeamMember[]>([])
  const [vacancies, setVacancies] = useState<Vacancy[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null)
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [resources, setResources] = useState<LibraryResource[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [helpArticles, setHelpArticles] = useState<HelpArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [allModules, setAllModules] = useState<Module[]>([])
  const [allLessons, setAllLessons] = useState<Lesson[]>([])

  // Form states
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserRole, setNewUserRole] = useState("student")
  const [newUserPassword, setNewUserPassword] = useState("")
  const [newUserName, setNewUserName] = useState("")
  const [newUserHasFee, setNewUserHasFee] = useState(false)
  const [newUserFeeAmount, setNewUserFeeAmount] = useState("0")
  const [newUserFeeCurrency, setNewUserFeeCurrency] = useState("GBP")
  const [newUserFeeBreakdown, setNewUserFeeBreakdown] = useState<{ name: string; amount: number }[]>([
    { name: "Platform Access", amount: 0 }
  ])
  const [newUserPaymentUrl, setNewUserPaymentUrl] = useState("")

  // Tenant Legal Documents state
  const [legalDocuments, setLegalDocuments] = useState<{ title: string; content: string }[]>([])
  const [isUpdatingLegal, setIsUpdatingLegal] = useState(false)

  // Company Onboarding Settings state
  const [allowSelfOnboarding, setAllowSelfOnboarding] = useState(false)
  const [enableWelcomeBox, setEnableWelcomeBox] = useState(false)
  const [welcomeVideoUrl, setWelcomeVideoUrl] = useState("")
  const [isUpdatingOnboarding, setIsUpdatingOnboarding] = useState(false)

  const handleAddFeeItem = () => {
    setNewUserFeeBreakdown([...newUserFeeBreakdown, { name: "", amount: 0 }])
  }

  const handleRemoveFeeItem = (index: number) => {
    setNewUserFeeBreakdown(newUserFeeBreakdown.filter((_, i) => i !== index))
  }

  const handleFeeItemChange = (index: number, field: 'name' | 'amount', value: string | number) => {
    const updated = [...newUserFeeBreakdown]
    updated[index] = { ...updated[index], [field]: field === 'amount' ? Number(value) : value }
    setNewUserFeeBreakdown(updated)
    
    // Auto-calculate total fee amount
    const total = updated.reduce((sum: number, item: { amount: number }) => sum + item.amount, 0)
    setNewUserFeeAmount(total.toString())
  }

  const handleAddLegalDoc = () => {
    setLegalDocuments([...legalDocuments, { title: "", content: "" }])
  }

  const handleRemoveLegalDoc = (index: number) => {
    setLegalDocuments(legalDocuments.filter((_, i) => i !== index))
  }

  const handleLegalDocChange = (index: number, field: 'title' | 'content', value: string) => {
    const updated = [...legalDocuments]
    updated[index] = { ...updated[index], [field]: value }
    setLegalDocuments(updated)
  }

  const handleSaveLegalDocuments = async () => {
    setIsUpdatingLegal(true)
    try {
      const { data, error } = await supabase.functions.invoke('admin-manage-users', {
        body: {
          action: 'update-company-legal',
          legalDocuments
        }
      })
      if (error) throw error
      toast.success("Legal documents updated successfully")
    } catch (err: any) {
      toast.error(err.message || "Failed to update legal documents")
    } finally {
      setIsUpdatingLegal(false)
    }
  }

  const handleSaveOnboardingSettings = async (field: 'allow_self_onboarding' | 'enable_welcome_box' | 'welcome_video_url', value: any) => {
    if (!company?.id) return
    
    // Update local state optimistically
    if (field === 'allow_self_onboarding') setAllowSelfOnboarding(value)
    if (field === 'enable_welcome_box') setEnableWelcomeBox(value)
    if (field === 'welcome_video_url') setWelcomeVideoUrl(value)

    try {
      const { error } = await supabase
        .from('companies')
        .update({ [field]: value })
        .eq('id', company.id)
      
      if (error) throw error
      if (field !== 'welcome_video_url') {
        toast.success("Settings updated successfully")
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update settings")
      // Revert state if needed (not implementing full revert for brevity, toast shows error)
    }
  }

  const loadUsers = async (mounted: boolean) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        console.warn("No active session found for Edge Function call")
        return
      }

      const { data, error } = await supabase.functions.invoke('admin-manage-users', {
        body: { action: 'list' }
      })
      
      if (mounted && !error) {
        setUsers(data)
      } else if (error) {
        console.error("EDGE FUNCTION ERROR:", error)
        toast.error(`Edge function error: ${error.message}`)
        console.warn("API error, falling back:", error)
        
        let query = supabase.from('profiles').select('*')
        if (company?.id) {
          query = query.eq('company_id', company.id)
        } else {
          query = query.is('company_id', null)
        }
        const { data: profilesData } = await query
        
        if (profilesData && mounted) setUsers(profilesData)
      }
    } catch (err: any) {
      console.error("EDGE FUNCTION CATCH ERROR:", err)
      toast.error(`Edge function catch error: ${err.message || String(err)}`)
      console.warn("Could not fetch admin users, falling back to profiles", err)
      
      let query = supabase.from('profiles').select('*')
      if (company?.id) {
        query = query.eq('company_id', company.id)
      } else {
        query = query.is('company_id', null)
      }
      const { data: profilesData } = await query
      
      if (profilesData && mounted) setUsers(profilesData)
    }
  }

  useEffect(() => {
    let mounted = true
    async function loadData() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user && mounted) {
          setCurrentUserId(session.user.id)
          const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
          if (profile && mounted) {
            setRole(profile.role)
          }
        }

        // Load Users via Edge Function
        await loadUsers(mounted)

        // Helper for scoping queries to the current tenant
        const scopeQuery = (query: any) => {
          if (company?.id) {
            return query.eq('company_id', company.id)
          }
          return query.is('company_id', null)
        }

        // Load Team
        const { data: teamData } = await scopeQuery(supabase.from('team_members').select('*')).order('order_index')
        if (teamData && mounted) setTeam(teamData)

        // Load Vacancies
        const { data: vacData } = await scopeQuery(supabase.from('vacancies').select('*')).order('created_at', { ascending: false })
        if (vacData && mounted) setVacancies(vacData)

        // Load Courses and Modules
        const { data: coursesData } = await scopeQuery(supabase.from('courses').select('*')).order('created_at', { ascending: false })
        if (coursesData && mounted) {
          setCourses(coursesData)
          
          // Load all modules for this company
          const { data: modData } = await scopeQuery(supabase.from('modules').select('*')).order('order_index')
          if (modData && mounted) {
            setAllModules(modData)
            
            // Load all lessons for these modules
            const modIds = modData.map((m: any) => m.id)
            if (modIds.length > 0) {
              const { data: lessonData } = await supabase.from('lessons').select('*').in('module_id', modIds).order('order_index')
              if (lessonData && mounted) setAllLessons(lessonData)
              
              // Load quizzes for these modules
              const { data: quizData } = await supabase.from('quizzes').select('*').in('module_id', modIds)
              if (quizData && mounted) setQuizzes(quizData)
            }

            // Set initial selection for modules tab
            if (coursesData.length > 0) {
              const firstCourseId = coursesData[0].id
              setSelectedCourseId(firstCourseId)
              const filteredModules = modData.filter((m: any) => m.course_id === firstCourseId)
              setModules(filteredModules)
            }
          }
        }

        // Load Library Resources
        const { data: resData } = await scopeQuery(supabase.from('resources').select('*')).order('created_at', { ascending: false })
        if (resData && mounted) setResources(resData)

        // Load Legal Documents and Onboarding Settings from company
        if (company?.id) {
          const { data: compData } = await supabase.from('companies').select('legal_documents, allow_self_onboarding, enable_welcome_box, welcome_video_url').eq('id', company.id).single()
          if (compData && mounted) {
            if (compData.legal_documents) {
              setLegalDocuments(compData.legal_documents)
            }
            setAllowSelfOnboarding(compData.allow_self_onboarding || false)
            setEnableWelcomeBox(compData.enable_welcome_box || false)
            setWelcomeVideoUrl(compData.welcome_video_url || "")
          }
        }

        // Load Announcements
        const { data: annData } = await scopeQuery(supabase.from('announcements').select('*')).order('created_at', { ascending: false })
        if (annData && mounted) setAnnouncements(annData)

        // Load Help Articles (Global or Scoped? We will scope it just in case)
        const { data: helpData } = await supabase.from('help_articles').select('*').order('order_index', { ascending: true })
        if (helpData && mounted) setHelpArticles(helpData)
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
    async function loadQuizQuestions() {
      if (!selectedQuizId) {
        setQuizQuestions([])
        return
      }
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', selectedQuizId)
        .order('order_index', { ascending: true })
      
      if (data) setQuizQuestions(data)
    }
    loadQuizQuestions()
  }, [selectedQuizId])

  const handleManageModuleQuiz = async (moduleId: string) => {
    let quiz = quizzes.find(q => q.module_id === moduleId)
    
    if (!quiz) {
      const { data: newQuiz, error } = await supabase
        .from('quizzes')
        .insert({
          module_id: moduleId,
          title: `Module Quiz: ${modules.find(m => m.id === moduleId)?.title}`,
          passing_score: 80
        })
        .select()
        .single()
      
      if (error) {
        console.error("Quiz creation error:", error)
        toast.error(`Failed to create quiz: ${error.message}`)
        return
      }
      if (newQuiz) {
        quiz = newQuiz
        setQuizzes([...quizzes, newQuiz])
      }
    }
    
    if (quiz) {
      setSelectedQuizId(quiz.id)
    }
  }

  const handleAddQuestion = async () => {
    if (!selectedQuizId) return
    
    const newOrderIndex = quizQuestions.length > 0 
      ? Math.max(...quizQuestions.map(q => q.order_index)) + 1 
      : 0

    const { data: newQuestion, error } = await supabase
      .from('quiz_questions')
      .insert({
        quiz_id: selectedQuizId,
        question: 'New Question',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        correct_option_index: 0,
        order_index: newOrderIndex
      })
      .select()
      .single()
    
    if (error) {
      toast.error("Failed to add question")
    } else {
      setQuizQuestions([...quizQuestions, newQuestion])
      toast.success("Question added")
    }
  }

  const handleUpdateQuestion = async (id: string, field: string, value: any) => {
    const { error } = await supabase
      .from('quiz_questions')
      .update({ [field]: value })
      .eq('id', id)
    
    if (error) {
      toast.error("Failed to update question")
    } else {
      setQuizQuestions(quizQuestions.map(q => q.id === id ? { ...q, [field]: value } : q))
    }
  }

  const handleDeleteQuestion = async (id: string) => {
    const { error } = await supabase.from('quiz_questions').delete().eq('id', id)
    if (error) {
      toast.error("Failed to delete question")
    } else {
      setQuizQuestions(quizQuestions.filter(q => q.id !== id))
      toast.success("Question deleted")
    }
  }

  useEffect(() => {
    async function loadModules() {
      if (!selectedCourseId) return
      const { data: modData } = await supabase.from('modules').select('*').eq('course_id', selectedCourseId).order('order_index')
      if (modData) {
        setModules(modData)
        const modIds = modData.map(m => m.id)
        const { data: quizData } = await supabase.from('quizzes').select('*').in('module_id', modIds)
        if (quizData) setQuizzes(quizData)
      }
    }
    loadModules()
  }, [selectedCourseId])

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    const loadingToast = toast.loading("Creating user...")
    const payload = {
      action: 'create',
      email: newUserEmail,
      fullName: newUserName,
      role: newUserRole,
      password: newUserPassword,
      signupFee: newUserHasFee ? parseFloat(newUserFeeAmount) : 0,
      signupFeeCurrency: newUserFeeCurrency,
      hasPaidSignupFee: !newUserHasFee,
      companyId: company?.id,
      feeBreakdown: newUserHasFee ? newUserFeeBreakdown : [],
      paymentUrl: newUserPaymentUrl
    }
    
    console.log("SENDING CREATE USER PAYLOAD:", payload)

    try {
      const { data, error } = await supabase.functions.invoke('admin-manage-users', {
        body: payload
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
      description: 'Course description...',
      company_id: company?.id
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
      order_index: newOrderIndex,
      company_id: company?.id
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
      audio_url: '',
      order_index: newOrderIndex,
      week_number: 1,
      has_homework: false,
      company_id: company?.id
    }).select().single()

    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Lesson created")
      setLessons([...lessons, newLesson])
    }
  }

  const handleUpdateLesson = async (id: string, field: string, value: string | number | boolean) => {
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

  const handleCreateVacancy = async () => {
    const { data: newVac, error } = await supabase.from('vacancies').insert({
      title: 'New Job Title',
      department: 'Sales',
      location: 'London',
      type: 'Full-time',
      remote_hybrid: 'Remote',
      description: 'Job description goes here...',
      company_id: company?.id
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

  const handleFileUpload = async (bucket: string, id: string, file: File, table: string, field: string) => {
    try {
      setUploadingImage(id)
      const fileExt = file.name.split('.').pop()
      const fileName = `${id}-${Math.random()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName)

      const { error: updateError } = await supabase
        .from(table)
        .update({ [field]: data.publicUrl })
        .eq('id', id)

      if (updateError) throw updateError

      // Update local state based on table
      if (table === 'team_members') {
        setTeam(team.map(t => t.id === id ? { ...t, [field]: data.publicUrl } : t))
      } else if (table === 'courses') {
        setCourses(courses.map(c => c.id === id ? { ...c, [field]: data.publicUrl } : c))
      } else if (table === 'modules') {
        setModules(modules.map(m => m.id === id ? { ...m, [field]: data.publicUrl } : m))
      } else if (table === 'lessons') {
        setLessons(lessons.map(l => l.id === id ? { ...l, [field]: data.publicUrl } : l))
      } else if (table === 'resources') {
        setResources(resources.map(r => r.id === id ? { ...r, [field]: data.publicUrl } : r))
      } else if (table === 'announcements') {
        setAnnouncements(announcements.map(a => a.id === id ? { ...a, [field]: data.publicUrl } : a))
      }

      toast.success("File uploaded successfully")
    } catch (error: Error | unknown) {
      const msg = error instanceof Error ? error.message : "Unknown error"
      toast.error(`Failed to upload: ${msg}`)
    } finally {
      setUploadingImage(null)
    }
  }

  const handleImageUpload = async (id: string, file: File) => {
    await handleFileUpload('avatars', id, file, 'team_members', 'image_url')
  }

  const [selectedUserForPassword, setSelectedUserForPassword] = useState<string | null>(null)
  const [newPasswordForUser, setNewPasswordForUser] = useState("")

  // User Details Modal States
  const [selectedUserForDetails, setSelectedUserForDetails] = useState<UserProfile | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [activeDetailsTab, setActiveDetailsTab] = useState("settings")
  const [editingUserDetails, setEditingUserDetails] = useState({
    full_name: "",
    phone: "",
    role: "",
    enrollments: [] as string[],
    signup_fee: 0,
    signup_fee_currency: "GBP",
    has_paid_signup_fee: true,
    fee_breakdown: [] as { name: string; amount: number }[],
    custom_payment_url: ""
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
      role: user.role || 'student',
      enrollments: user.enrollments || [],
      signup_fee: user.signup_fee || 0,
      signup_fee_currency: user.signup_fee_currency || 'GBP',
      has_paid_signup_fee: user.has_paid_signup_fee ?? true,
      fee_breakdown: user.fee_breakdown || [],
      custom_payment_url: user.custom_payment_url || ""
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
          enrollments: editingUserDetails.enrollments,
          signupFee: editingUserDetails.signup_fee,
          signupFeeCurrency: editingUserDetails.signup_fee_currency,
          hasPaidSignupFee: editingUserDetails.has_paid_signup_fee,
          feeBreakdown: editingUserDetails.fee_breakdown,
          customPaymentUrl: editingUserDetails.custom_payment_url
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

  const canDeleteUser = (user: UserProfile) => {
    if (!role || currentUserId === user.id) return false
    if (role === 'admin') return true
    if (role === 'trainer') return user.role === 'student'
    return false
  }

  const handleDeleteUser = async (user: UserProfile) => {
    if (!canDeleteUser(user)) {
      toast.error("You do not have permission to delete this user")
      return
    }

    const userLabel = user.full_name || user.email || 'this user'
    if (!confirm(`Are you sure you want to delete ${userLabel}? This cannot be undone.`)) return

    const loadingToast = toast.loading("Deleting user...")

    try {
      const { error } = await supabase.functions.invoke('admin-manage-users', {
        body: {
          action: 'delete-user',
          userId: user.id
        }
      })

      toast.dismiss(loadingToast)

      if (error) {
        const anyError = error as any
        const status = anyError.status ?? anyError.context?.status
        let body: unknown = undefined

        if (anyError.context && typeof anyError.context.clone === "function") {
          const cloned = anyError.context.clone()
          body = await cloned.json().catch(async () => await cloned.text())
        } else if (anyError.context?.body) {
          body = anyError.context.body
        }

        const messageFromBody =
          typeof body === "object" && body && "error" in (body as any)
            ? String((body as any).error)
            : undefined

        const statusPrefix = status ? `(${status}) ` : ""
        toast.error(`${statusPrefix}${messageFromBody || error.message || "Failed to delete user"}`)
        return
      }

      setUsers(users.filter((existingUser) => existingUser.id !== user.id))
      if (selectedUserForDetails?.id === user.id) {
        setIsDetailsModalOpen(false)
        setSelectedUserForDetails(null)
      }
      toast.success("User deleted")
    } catch (error: unknown) {
      toast.dismiss(loadingToast)
      const msg = error instanceof Error ? error.message : String(error)
      toast.error(`Failed to delete user: ${msg}`)
    }
  }

  const handleCreateResource = async () => {
    const { data, error } = await supabase.from('resources').insert({
      title: 'New Resource',
      url: '',
      type: 'PDF',
      category: 'General',
      company_id: company?.id
    }).select().single()
    if (error) toast.error(error.message)
    else {
      setResources([data, ...resources])
      toast.success("Resource created")
    }
  }

  const handleUpdateResource = async (id: string, field: string, value: any) => {
    const { error } = await supabase.from('resources').update({ [field]: value }).eq('id', id)
    if (error) toast.error(error.message)
    else setResources(resources.map(r => r.id === id ? { ...r, [field]: value } : r))
  }

  const handleDeleteResource = async (id: string) => {
    if (!confirm("Are you sure?")) return
    const { error } = await supabase.from('resources').delete().eq('id', id)
    if (error) toast.error(error.message)
    else {
      setResources(resources.filter(r => r.id !== id))
      toast.success("Resource deleted")
    }
  }

  const handleCreateAnnouncement = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase.from('announcements').insert({
      title: 'New Announcement',
      content: '',
      created_by: user?.id,
      company_id: company?.id
    }).select().single()
    if (error) toast.error(error.message)
    else {
      setAnnouncements([data, ...announcements])
      toast.success("Announcement created")
    }
  }

  const handleUpdateAnnouncement = async (id: string, field: string, value: any) => {
    const { error } = await supabase.from('announcements').update({ [field]: value }).eq('id', id)
    if (error) toast.error(error.message)
    else setAnnouncements(announcements.map(a => a.id === id ? { ...a, [field]: value } : a))
  }

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm("Are you sure?")) return
    const { error } = await supabase.from('announcements').delete().eq('id', id)
    if (error) toast.error(error.message)
    else {
      setAnnouncements(announcements.filter(a => a.id !== id))
      toast.success("Announcement deleted")
    }
  }

  const handleCreateHelpArticle = async () => {
    const { data, error } = await supabase.from('help_articles').insert({
      title: 'New Article',
      content: '',
      category: 'General',
      order_index: helpArticles.length
    }).select().single()
    if (error) toast.error(error.message)
    else {
      setHelpArticles([...helpArticles, data])
      toast.success("Article created")
    }
  }

  const handleUpdateHelpArticle = async (id: string, field: string, value: any) => {
    const { error } = await supabase.from('help_articles').update({ [field]: value }).eq('id', id)
    if (error) toast.error(error.message)
    else setHelpArticles(helpArticles.map(a => a.id === id ? { ...a, [field]: value } : a))
  }

  const handleDeleteHelpArticle = async (id: string) => {
    if (!confirm("Are you sure?")) return
    const { error } = await supabase.from('help_articles').delete().eq('id', id)
    if (error) toast.error(error.message)
    else {
      setHelpArticles(helpArticles.filter(a => a.id !== id))
      toast.success("Article deleted")
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
          className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'users' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Manage Users
        </button>
        <button
          onClick={() => setActiveTab("progress")}
          className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'progress' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Student Progress
        </button>
        {role === 'admin' && (
          <button
            onClick={() => setActiveTab("agreements")}
            className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'agreements' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Signed Agreements
          </button>
        )}
        {role === 'admin' && company?.slug === 'openlead' && (
          <button
            onClick={() => setActiveTab("team")}
            className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'team' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Leadership Team
          </button>
        )}
        {role === 'admin' && company?.slug === 'openlead' && (
          <button
            onClick={() => setActiveTab("vacancies")}
            className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'vacancies' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Vacancies
          </button>
        )}
        {role === 'admin' && (
          <button
            onClick={() => setActiveTab("legal")}
            className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'legal' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Legal Documents
          </button>
        )}
        {role === 'admin' && (
          <button
            onClick={() => setActiveTab("welcome-box")}
            className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'welcome-box' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Welcome Box
          </button>
        )}
        {(role === 'admin' || role === 'trainer') && (
          <button
            onClick={() => setActiveTab("modules")}
            className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'modules' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Manage Modules
          </button>
        )}
        {(role === 'admin' || role === 'trainer') && (
          <button
            onClick={() => setActiveTab("library")}
            className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'library' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Library
          </button>
        )}
        {(role === 'admin' || role === 'trainer') && (
          <button
            onClick={() => setActiveTab("announcements")}
            className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'announcements' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Announcements
          </button>
        )}
        {(role === 'admin' || role === 'trainer') && (
          <button
            onClick={() => setActiveTab("help")}
            className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'help' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Help Centre
          </button>
        )}
      </div>

      {activeTab === 'users' && (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Add New User
              </CardTitle>
              {role === 'admin' && (
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                  <Label htmlFor="self-onboard-toggle" className="text-xs font-bold text-gray-700 cursor-pointer">
                    Allow Self Onboarding
                  </Label>
                  <div 
                    className={`w-8 h-4 rounded-full transition-colors cursor-pointer relative ${allowSelfOnboarding ? 'bg-primary' : 'bg-gray-300'}`}
                    onClick={() => handleSaveOnboardingSettings('allow_self_onboarding', !allowSelfOnboarding)}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform ${allowSelfOnboarding ? 'translate-x-4' : ''}`} />
                  </div>
                </div>
              )}
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
                <div className="space-y-4 md:col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id="fee-toggle"
                      checked={newUserHasFee}
                      onChange={(e) => setNewUserHasFee(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="fee-toggle" className="font-semibold cursor-pointer">Require Sign Up Fee</Label>
                  </div>
                  {newUserHasFee && (
                    <div className="space-y-4 pl-7">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-bold text-gray-700">Fee Breakdown</Label>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={handleAddFeeItem}
                          className="h-7 text-[10px] font-bold"
                        >
                          <Plus className="w-3 h-3 mr-1" /> Add Line Item
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        {newUserFeeBreakdown.map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input 
                              placeholder="Item Name (e.g. Platform Access)"
                              value={item.name}
                              onChange={e => handleFeeItemChange(index, 'name', e.target.value)}
                              className="flex-1 h-8 text-xs"
                            />
                            <div className="flex items-center gap-1 w-32">
                              <span className="text-xs text-gray-400 font-bold">
                                {newUserFeeCurrency === 'GBP' ? '£' : 
                                 newUserFeeCurrency === 'USD' ? '$' : 
                                 newUserFeeCurrency === 'EUR' ? '€' : '$'}
                              </span>
                              <Input 
                                type="number"
                                placeholder="0.00"
                                value={item.amount}
                                onChange={e => handleFeeItemChange(index, 'amount', e.target.value)}
                                className="h-8 text-xs"
                              />
                            </div>
                            {newUserFeeBreakdown.length > 1 && (
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleRemoveFeeItem(index)}
                                className="h-8 w-8 p-0 text-red-400 hover:text-red-600"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label className="text-xs font-bold text-gray-500">Currency</Label>
                          <select
                            value={newUserFeeCurrency}
                            onChange={e => setNewUserFeeCurrency(e.target.value)}
                            className="flex h-8 rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background w-24"
                          >
                            <option value="GBP">GBP (£)</option>
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="AUD">AUD ($)</option>
                            <option value="CAD">CAD ($)</option>
                          </select>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Total Signup Fee</p>
                          <p className="text-lg font-black text-primary">
                            {newUserFeeCurrency === 'GBP' ? '£' : 
                             newUserFeeCurrency === 'USD' ? '$' : 
                             newUserFeeCurrency === 'EUR' ? '€' : '$'}
                            {newUserFeeAmount}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-100 space-y-2">
                        <Label className="text-xs font-bold text-gray-500 uppercase">Manual Payment Link (Optional)</Label>
                        <Input 
                          placeholder="https://buy.stripe.com/..."
                          value={newUserPaymentUrl}
                          onChange={e => setNewUserPaymentUrl(e.target.value)}
                          className="h-9 text-xs"
                        />
                        <p className="text-[10px] text-gray-400">If provided, the student will be redirected here instead of the default platform checkout.</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="md:col-span-2 pt-2">
                  <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">Create User</Button>
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
                        <div className="relative">
                          <p className="font-bold text-gray-900 text-lg">{u.full_name || 'Unknown'}</p>
                          {u.is_online && (
                            <span className="absolute -top-1 -right-2 flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-white"></span>
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 capitalize bg-white border border-gray-200 px-2 py-0.5 rounded-full font-semibold shadow-sm">{u.role}</span>
                        {u.is_online && (
                          <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full border border-green-200 font-bold uppercase tracking-wider">
                            Online Now
                          </span>
                        )}
                        {(u.nda_signed || u.subcontractor_signed) && (
                          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20 font-bold uppercase tracking-wider">
                            Agreements Signed
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2">
                        {u.email && (
                          <div className="flex items-center gap-2 text-primary font-bold bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20 shadow-sm">
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
                        {typeof u.completed_modules_count === 'number' && (
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
                            <Trophy className="w-3.5 h-3.5 text-amber-500" />
                            <span>Modules: {u.completed_modules_count}/{u.total_modules_count}</span>
                          </div>
                        )}
                        {u.last_path && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            At: {u.last_path}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      <Button 
                        onClick={() => handleOpenDetails(u)}
                        variant="default" 
                        size="sm" 
                        className="h-9 bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4" /> Manage User
                      </Button>

                      {(u.nda_signed || u.subcontractor_signed) && (
                        <Dialog>
                          <DialogTrigger
                            render={
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-9 border-primary text-primary hover:bg-primary/5 font-bold"
                              />
                            }
                          >
                            <ShieldCheck className="w-4 h-4 mr-2" /> View Agreements
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-primary" />
                                Signed Agreements: {u.full_name}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                              {u.nda_signed ? (
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-bold text-slate-900">Non-Disclosure Agreement</h4>
                                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">SIGNED</span>
                                  </div>
                                  <div className="space-y-1 text-sm text-slate-500">
                                    <p>Signed by: <span className="font-semibold text-slate-700">{u.agreement_signature_name}</span></p>
                                    <p>Date: <span className="font-semibold text-slate-700">{u.nda_signed_at ? new Date(u.nda_signed_at).toLocaleString() : 'N/A'}</span></p>
                                  </div>
                                </div>
                              ) : (
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 opacity-50">
                                  <h4 className="font-bold text-slate-400">Non-Disclosure Agreement</h4>
                                  <p className="text-xs text-slate-400 italic">Not yet signed</p>
                                </div>
                              )}

                              {u.subcontractor_signed ? (
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-bold text-slate-900">Subcontractor Agreement</h4>
                                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">SIGNED</span>
                                  </div>
                                  <div className="space-y-1 text-sm text-slate-500">
                                    <p>Signed by: <span className="font-semibold text-slate-700">{u.agreement_signature_name}</span></p>
                                    <p>Date: <span className="font-semibold text-slate-700">{u.subcontractor_signed_at ? new Date(u.subcontractor_signed_at).toLocaleString() : 'N/A'}</span></p>
                                  </div>
                                </div>
                              ) : (
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 opacity-50">
                                  <h4 className="font-bold text-slate-400">Subcontractor Agreement</h4>
                                  <p className="text-xs text-slate-400 italic">Not yet signed</p>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}

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
                                className="w-full bg-primary hover:bg-primary/90"
                                onClick={() => handleChangePassword(u.id)}
                              >
                                Update Password
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 text-xs flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleDeleteUser(u)}
                          disabled={!canDeleteUser(u)}
                          title={
                            currentUserId === u.id
                              ? "You cannot delete your own account"
                              : role === 'trainer' && u.role !== 'student'
                                ? "Trainers can only delete student accounts"
                                : undefined
                          }
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete User
                        </Button>
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
                    <div className="flex border-b border-gray-100">
                      <button 
                        onClick={() => setActiveDetailsTab("settings")}
                        className={`px-4 py-2 text-sm font-bold transition-colors border-b-2 ${activeDetailsTab === 'settings' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                      >
                        User Settings
                      </button>
                      <button 
                        onClick={() => setActiveDetailsTab("progress")}
                        className={`px-4 py-2 text-sm font-bold transition-colors border-b-2 ${activeDetailsTab === 'progress' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                      >
                        Detailed Progress
                      </button>
                    </div>

                    {activeDetailsTab === 'settings' ? (
                      <div className="space-y-6">
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

                          <div className="space-y-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                              <Label className="text-base font-bold flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-primary" />
                                Signup Fee & Breakdown
                              </Label>
                              <div className="flex items-center gap-2">
                                <input 
                                  type="checkbox" 
                                  id="edit-has-paid"
                                  checked={editingUserDetails.has_paid_signup_fee}
                                  onChange={e => setEditingUserDetails({...editingUserDetails, has_paid_signup_fee: e.target.checked})}
                                  className="w-4 h-4 rounded border-gray-300 text-primary"
                                />
                                <Label htmlFor="edit-has-paid" className="text-xs font-medium">Mark as Paid</Label>
                              </div>
                            </div>

                            <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-bold text-gray-500 uppercase">Fee Items</p>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-6 text-[10px] font-bold"
                                  onClick={() => {
                                    const updated = [...editingUserDetails.fee_breakdown, { name: "", amount: 0 }]
                                    const total = updated.reduce((sum: number, item: { amount: number }) => sum + item.amount, 0)
                                    setEditingUserDetails({
                                      ...editingUserDetails, 
                                      fee_breakdown: updated,
                                      signup_fee: total
                                    })
                                  }}
                                >
                                  Add Item
                                </Button>
                              </div>
                              
                              {editingUserDetails.fee_breakdown.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <Input 
                                    placeholder="Item name"
                                    value={item.name}
                                    onChange={e => {
                                      const updated = [...editingUserDetails.fee_breakdown]
                                      updated[idx] = { ...updated[idx], name: e.target.value }
                                      setEditingUserDetails({...editingUserDetails, fee_breakdown: updated})
                                    }}
                                    className="flex-1 h-8 text-xs"
                                  />
                                  <Input 
                                    type="number"
                                    placeholder="0.00"
                                    value={item.amount}
                                    onChange={e => {
                                      const updated = [...editingUserDetails.fee_breakdown]
                                      updated[idx] = { ...updated[idx], amount: Number(e.target.value) }
                                      const total = updated.reduce((sum: number, item: { amount: number }) => sum + item.amount, 0)
                                      setEditingUserDetails({
                                        ...editingUserDetails, 
                                        fee_breakdown: updated,
                                        signup_fee: total
                                      })
                                    }}
                                    className="w-20 h-8 text-xs"
                                  />
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-8 p-0 text-red-400"
                                    onClick={() => {
                                      const updated = editingUserDetails.fee_breakdown.filter((_: any, i: number) => i !== idx)
                                      const total = updated.reduce((sum: number, item: { amount: number }) => sum + item.amount, 0)
                                      setEditingUserDetails({
                                        ...editingUserDetails, 
                                        fee_breakdown: updated,
                                        signup_fee: total
                                      })
                                    }}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </Button>
                                </div>
                              ))}
                              
                              <div className="flex items-center justify-between pt-2 border-t border-gray-200 mt-2">
                                <select
                                  value={editingUserDetails.signup_fee_currency}
                                  onChange={e => setEditingUserDetails({...editingUserDetails, signup_fee_currency: e.target.value})}
                                  className="h-7 text-[10px] rounded border bg-white px-1 font-bold"
                                >
                                  <option value="GBP">GBP (£)</option>
                                  <option value="USD">USD ($)</option>
                                  <option value="EUR">EUR (€)</option>
                                </select>
                                <p className="text-sm font-black text-primary">
                                  Total: {editingUserDetails.signup_fee_currency === 'GBP' ? '£' : '$'}
                                  {editingUserDetails.signup_fee}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-2 pt-2">
                              <Label className="text-xs font-bold text-gray-500 uppercase">Manual Payment Link</Label>
                              <Input 
                                placeholder="https://buy.stripe.com/..."
                                value={editingUserDetails.custom_payment_url}
                                onChange={e => setEditingUserDetails({...editingUserDetails, custom_payment_url: e.target.value})}
                                className="h-9 text-xs"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-base font-bold flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-primary" />
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
                                      ? 'border-primary bg-primary/5' 
                                      : 'border-gray-100 bg-gray-50 hover:bg-gray-100'
                                  }`}
                                >
                                  <span className={`text-sm font-medium ${isEnrolled ? 'text-primary' : 'text-gray-700'}`}>
                                    {course.title}
                                  </span>
                                  {isEnrolled ? (
                                    <CheckCircle2 className="w-5 h-5 text-primary" />
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
                            className="flex-1 bg-primary hover:bg-primary/90"
                            onClick={handleUpdateUserDetails}
                            disabled={isUpdatingDetails}
                          >
                            {isUpdatingDetails ? 'Saving...' : 'Save Changes'}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="space-y-4">
                          {courses.filter(c => editingUserDetails.enrollments.includes(c.id)).length === 0 && (
                            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                              <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                              <p className="text-sm text-gray-500">User is not enrolled in any courses.</p>
                            </div>
                          )}
                          {courses.filter(c => editingUserDetails.enrollments.includes(c.id)).map(course => (
                            <div key={course.id} className="space-y-4">
                              <h3 className="font-black text-lg text-primary flex items-center gap-2">
                                <Trophy className="w-5 h-5" />
                                {course.title}
                              </h3>
                              <div className="space-y-3">
                                {allModules.filter(m => m.course_id === course.id).map(mod => {
                                  const modLessons = allLessons.filter(l => l.module_id === mod.id)
                                  const completedInMod = modLessons.filter(l => selectedUserForDetails.completed_lesson_ids?.includes(l.id)).length
                                  const isModComplete = modLessons.length > 0 && completedInMod === modLessons.length
                                  
                                  return (
                                    <div key={mod.id} className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm">
                                      <div className={`p-3 flex items-center justify-between ${isModComplete ? 'bg-green-50' : 'bg-gray-50'}`}>
                                        <div className="flex items-center gap-2">
                                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${isModComplete ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                            {isModComplete ? <CheckCircle2 className="w-4 h-4" /> : mod.order_index}
                                          </div>
                                          <span className={`font-bold text-sm ${isModComplete ? 'text-green-700' : 'text-gray-700'}`}>{mod.title}</span>
                                        </div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{completedInMod}/{modLessons.length} Done</span>
                                      </div>
                                      <div className="p-2 space-y-1">
                                        {modLessons.map(lesson => {
                                          const isDone = selectedUserForDetails.completed_lesson_ids?.includes(lesson.id)
                                          return (
                                            <div key={lesson.id} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group">
                                              <div className="flex items-center gap-3">
                                                {isDone ? (
                                                  <div className="bg-green-100 p-1 rounded-md">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                                                  </div>
                                                ) : (
                                                  <div className="bg-gray-100 p-1 rounded-md group-hover:bg-gray-200">
                                                    <div className="w-3.5 h-3.5" />
                                                  </div>
                                                )}
                                                <span className={`text-xs font-medium ${isDone ? 'text-gray-900' : 'text-gray-500'}`}>{lesson.title}</span>
                                              </div>
                                              {isDone && <span className="text-[9px] font-bold text-green-500 bg-green-50 px-1.5 py-0.5 rounded border border-green-100 uppercase tracking-tighter">Completed</span>}
                                            </div>
                                          )
                                        })}
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </Card>
        </div>
      )}

      {activeTab === 'progress' && (role === 'admin' || role === 'trainer') && (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Student Progress Matrix
              </CardTitle>
              <p className="text-sm text-gray-500">Track and compare student lesson completions across all courses instantly.</p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-gray-50 border-y border-gray-100">
                      <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest sticky left-0 bg-gray-50 z-20 border-r border-gray-100 min-w-[200px] shadow-[2px_0_5px_rgba(0,0,0,0.02)]">Student</th>
                      {courses.map(course => (
                        <span key={course.id} className="contents">
                          {allModules.filter(m => m.course_id === course.id).map(mod => (
                            allLessons.filter(l => l.module_id === mod.id).map(lesson => (
                              <th key={lesson.id} className="p-4 text-[9px] font-black text-gray-400 uppercase tracking-widest border-r border-gray-100 min-w-[140px] text-center bg-white/50">
                                <div className="space-y-1">
                                  <div className="text-primary truncate" title={course.title}>{course.title}</div>
                                  <div className="text-gray-400 truncate" title={mod.title}>{mod.title}</div>
                                  <div className="text-gray-900 truncate" title={lesson.title}>{lesson.title}</div>
                                </div>
                              </th>
                            ))
                          ))}
                        </span>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.filter(u => u.role === 'student').length === 0 ? (
                      <tr>
                        <td colSpan={100} className="p-12 text-center text-gray-400 italic bg-gray-50/30">
                          No students found in this company.
                        </td>
                      </tr>
                    ) : (
                      users.filter(u => u.role === 'student').map(u => (
                        <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <td className="p-4 sticky left-0 bg-white z-10 border-r border-gray-100 shadow-[2px_0_5_rgba(0,0,0,0.02)]">
                            <p className="font-bold text-gray-900 text-sm">{u.full_name || 'Unknown'}</p>
                            <p className="text-[10px] text-gray-400 truncate w-32">{u.email}</p>
                          </td>
                          {courses.map(course => (
                            <span key={course.id} className="contents">
                              {allModules.filter(m => m.course_id === course.id).map(mod => (
                                allLessons.filter(l => l.module_id === mod.id).map(lesson => {
                                  const isEnrolled = u.enrollments?.includes(course.id)
                                  const isDone = u.completed_lesson_ids?.includes(lesson.id)
                                  
                                  // Check if there is a quiz for this lesson and if it's passed
                                  const lessonQuiz = quizzes.find(q => q.lesson_id === lesson.id)
                                  const quizPassed = !lessonQuiz || u.passed_quiz_ids?.includes(lessonQuiz.id)
                                  
                                  const isFullyComplete = isDone && quizPassed

                                  return (
                                    <td key={lesson.id} className="p-4 border-r border-gray-100 text-center">
                                      {!isEnrolled ? (
                                        <span className="text-[10px] text-gray-200 font-medium">N/A</span>
                                      ) : isFullyComplete ? (
                                        <div className="flex justify-center">
                                          <div className="bg-green-100 p-1 rounded-md shadow-sm border border-green-200">
                                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                                          </div>
                                        </div>
                                      ) : isDone ? (
                                        <div className="flex justify-center flex-col items-center gap-1">
                                          <div className="bg-amber-100 p-1 rounded-md shadow-sm border border-amber-200">
                                            <Clock className="w-4 h-4 text-amber-600" />
                                          </div>
                                          <span className="text-[8px] font-black text-amber-600 uppercase">Quiz Pending</span>
                                        </div>
                                      ) : (
                                        <div className="w-4 h-4 mx-auto border-2 border-gray-100 rounded-md bg-white" />
                                      )}
                                    </td>
                                  )
                                })
                              ))}
                            </span>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'agreements' && role === 'admin' && (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  Agreement Compliance Tracker
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input 
                      placeholder="Search by name or email..." 
                      className="pl-9 w-full md:w-[300px] h-9 text-sm"
                      onChange={(e) => {
                        // We can add local filtering if needed, but for now just showing all
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="pb-3 font-bold text-gray-500 text-xs uppercase tracking-wider">User</th>
                      <th className="pb-3 font-bold text-gray-500 text-xs uppercase tracking-wider text-center">NDA Status</th>
                      <th className="pb-3 font-bold text-gray-500 text-xs uppercase tracking-wider text-center">Subcontractor Status</th>
                      <th className="pb-3 font-bold text-gray-500 text-xs uppercase tracking-wider">Signature Name</th>
                      <th className="pb-3 font-bold text-gray-500 text-xs uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500 italic">No users found.</td>
                      </tr>
                    ) : (
                      users.map(u => (
                        <tr key={u.id} className="group hover:bg-gray-50/50 transition-colors">
                          <td className="py-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-900">{u.full_name || 'Unknown'}</span>
                              <span className="text-xs text-gray-500">{u.email}</span>
                            </div>
                          </td>
                          <td className="py-4 text-center">
                            {u.nda_signed ? (
                              <div className="inline-flex flex-col items-center">
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                                <span className="text-[10px] text-gray-400 mt-0.5">
                                  {u.nda_signed_at ? new Date(u.nda_signed_at).toLocaleDateString() : 'N/A'}
                                </span>
                              </div>
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-gray-200 mx-auto" />
                            )}
                          </td>
                          <td className="py-4 text-center">
                            {u.subcontractor_signed ? (
                              <div className="inline-flex flex-col items-center">
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                                <span className="text-[10px] text-gray-400 mt-0.5">
                                  {u.subcontractor_signed_at ? new Date(u.subcontractor_signed_at).toLocaleDateString() : 'N/A'}
                                </span>
                              </div>
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-gray-200 mx-auto" />
                            )}
                          </td>
                          <td className="py-4">
                            <span className="text-sm font-medium text-gray-700">
                              {u.agreement_signature_name || <span className="text-gray-300 italic">Not signed</span>}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <Dialog>
                              <DialogTrigger
                                render={
                                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/90 hover:bg-primary/5 h-8" />
                                }
                              >
                                Details
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                  <DialogTitle>Agreement Details: {u.full_name}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-6 py-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                      <h4 className="font-bold text-slate-900 mb-2">NDA</h4>
                                      <div className="space-y-1 text-sm">
                                        <p className="text-gray-500">Status: <span className={u.nda_signed ? "text-primary font-bold" : "text-gray-400"}>{u.nda_signed ? "Signed" : "Pending"}</span></p>
                                        {u.nda_signed && (
                                          <>
                                            <p className="text-gray-500">Date: <span className="text-slate-700 font-medium">{new Date(u.nda_signed_at!).toLocaleString()}</span></p>
                                            <p className="text-gray-500">IP Logged: <span className="text-slate-700 font-medium italic text-[10px]">Securely Logged</span></p>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                      <h4 className="font-bold text-slate-900 mb-2">Subcontractor</h4>
                                      <div className="space-y-1 text-sm">
                                        <p className="text-gray-500">Status: <span className={u.subcontractor_signed ? "text-primary font-bold" : "text-gray-400"}>{u.subcontractor_signed ? "Signed" : "Pending"}</span></p>
                                        {u.subcontractor_signed && (
                                          <>
                                            <p className="text-gray-500">Date: <span className="text-slate-700 font-medium">{new Date(u.subcontractor_signed_at!).toLocaleString()}</span></p>
                                            <p className="text-gray-500">IP Logged: <span className="text-slate-700 font-medium italic text-[10px]">Securely Logged</span></p>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  {u.agreement_signature_name && (
                                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                                      <p className="text-xs text-primary font-bold uppercase tracking-wider mb-1">Legal Signature</p>
                                      <p className="text-2xl font-signature text-slate-800 italic" style={{ fontFamily: "'Dancing Script', cursive" }}>{u.agreement_signature_name}</p>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'team' && role === 'admin' && company?.slug === 'openlead' && (
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

      {activeTab === 'vacancies' && role === 'admin' && company?.slug === 'openlead' && (
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Manage Vacancies
              </div>
              <Button onClick={handleCreateVacancy} className="bg-primary hover:bg-primary/90 text-white">
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

      {activeTab === 'legal' && role === 'admin' && (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  Tenant Legal Documents
                </CardTitle>
                <p className="text-xs text-gray-500 mt-1">These documents must be accepted by all new users before they can access the platform.</p>
              </div>
              <Button 
                onClick={handleAddLegalDoc}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Document
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {legalDocuments.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No legal documents added yet.</p>
                  <Button variant="link" onClick={handleAddLegalDoc} className="text-primary font-bold">Create your first document</Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {legalDocuments.map((doc, index) => (
                    <div key={index} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 relative group">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveLegalDoc(index)}
                        className="absolute top-4 right-4 text-red-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Document Title</Label>
                          <Input 
                            placeholder="e.g. Terms & Conditions"
                            value={doc.title}
                            onChange={e => handleLegalDocChange(index, 'title', e.target.value)}
                            className="font-bold text-lg"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Document Content (Markdown/Text)</Label>
                          <textarea 
                            placeholder="Enter the document content here..."
                            value={doc.content}
                            onChange={e => handleLegalDocChange(index, 'content', e.target.value)}
                            className="w-full h-48 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm ring-offset-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4 flex justify-end">
                    <Button 
                      onClick={handleSaveLegalDocuments}
                      disabled={isUpdatingLegal}
                      className="bg-primary hover:bg-primary/90 text-white min-w-[200px]"
                    >
                      {isUpdatingLegal ? 'Saving...' : 'Save Legal Documents'}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'welcome-box' && role === 'admin' && (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="pb-4 border-b border-gray-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-primary" />
                  Welcome Box Settings
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">Configure the onboarding flow for new users.</p>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                <Label className="text-xs font-bold text-gray-700 cursor-pointer">
                  Enable Welcome Box
                </Label>
                <div 
                  className={`w-8 h-4 rounded-full transition-colors cursor-pointer relative ${enableWelcomeBox ? 'bg-primary' : 'bg-gray-300'}`}
                  onClick={() => handleSaveOnboardingSettings('enable_welcome_box', !enableWelcomeBox)}
                >
                  <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform ${enableWelcomeBox ? 'translate-x-4' : ''}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="max-w-2xl space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-gray-900">Welcome Video URL (Optional)</Label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="https://vimeo.com/... or https://youtube.com/..." 
                      value={welcomeVideoUrl}
                      onChange={(e) => setWelcomeVideoUrl(e.target.value)}
                      className="flex-1 rounded-xl"
                    />
                    <Button 
                      onClick={() => handleSaveOnboardingSettings('welcome_video_url', welcomeVideoUrl)}
                      className="rounded-xl font-bold bg-primary hover:bg-primary/90 text-white"
                    >
                      Save URL
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    If provided, new users will see this video in a popup before they are asked to pay.
                  </p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <h4 className="font-bold text-blue-900 text-sm mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4" /> User Onboarding Flow
                  </h4>
                  <ol className="list-decimal list-inside text-xs text-blue-800 space-y-1 ml-1">
                    <li>User logs in for the first time.</li>
                    <li>If <strong>Welcome Box</strong> is enabled, they see the Welcome Video (if URL is provided).</li>
                    <li>After the video, they are prompted to pay the Signup Fee (if configured).</li>
                    <li>Once paid, access to the dashboard is granted.</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'modules' && (role === 'admin' || role === 'trainer') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Courses Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="border-0 shadow-sm rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  Courses
                  <Button size="sm" onClick={handleCreateCourse} className="h-8 bg-primary hover:bg-primary/90">
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
                        ? 'border-primary bg-primary/5 shadow-sm' 
                        : 'border-gray-100 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className={`font-semibold text-sm ${selectedCourseId === course.id ? 'text-primary' : 'text-gray-900'}`}>
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
                    <Label className="text-xs">Cover Photo</Label>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded bg-gray-100 border overflow-hidden flex-shrink-0">
                        {courses.find(c => c.id === selectedCourseId)?.image_url ? (
                          <img src={courses.find(c => c.id === selectedCourseId)?.image_url} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Plus className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <Input 
                        type="file" 
                        accept="image/*"
                        className="h-8 text-[10px]"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload('thumbnails', selectedCourseId, e.target.files[0], 'courses', 'image_url')}
                      />
                    </div>
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
                    className="bg-primary hover:bg-primary/90 text-white"
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
                          <Label className="text-xs text-gray-500">Cover Photo</Label>
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded bg-white border flex-shrink-0 overflow-hidden">
                              {mod.image_url ? (
                                <img src={mod.image_url} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                  <Plus className="w-3 h-3" />
                                </div>
                              )}
                            </div>
                            <Input 
                              type="file" 
                              accept="image/*"
                              className="h-8 text-[10px]"
                              onChange={(e) => e.target.files?.[0] && handleFileUpload('thumbnails', mod.id, e.target.files[0], 'modules', 'image_url')}
                            />
                          </div>
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

                      <div className="pt-2 flex flex-wrap gap-2 pr-8">
                        <Dialog open={selectedModuleId === mod.id} onOpenChange={(open) => setSelectedModuleId(open ? mod.id : null)}>
                          <DialogTrigger render={<Button variant="outline" size="sm" className="text-primary border-primary/30 hover:bg-primary/5" />}>
                              <Plus className="w-4 h-4 mr-2" /> Manage Lessons
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-primary" />
                                Lessons in {mod.title}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                              <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-500">Add and manage the lessons for this module.</p>
                                <Button size="sm" onClick={() => handleCreateLesson(mod.id)} className="bg-primary hover:bg-primary/90">
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
                                        <Label className="text-xs">Cover Photo</Label>
                                        <div className="flex items-center gap-2">
                                          <div className="w-10 h-10 rounded bg-white border flex-shrink-0 overflow-hidden">
                                            {lesson.image_url ? (
                                              <img src={lesson.image_url} className="w-full h-full object-cover" />
                                            ) : (
                                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <Plus className="w-3 h-3" />
                                              </div>
                                            )}
                                          </div>
                                          <Input 
                                            type="file" 
                                            accept="image/*"
                                            className="h-8 text-[10px]"
                                            onChange={(e) => e.target.files?.[0] && handleFileUpload('thumbnails', lesson.id, e.target.files[0], 'lessons', 'image_url')}
                                          />
                                        </div>
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
                                      <Label className="text-xs">Lesson Audio</Label>
                                      <div className="flex flex-col gap-2 rounded-lg border border-dashed border-gray-200 bg-white p-3">
                                        <div className="flex flex-col gap-2 md:flex-row md:items-center">
                                          <Input
                                            type="file"
                                            accept="audio/*"
                                            className="text-[10px]"
                                            disabled={uploadingImage === lesson.id}
                                            onChange={(e) => {
                                              if (e.target.files?.[0]) {
                                                handleFileUpload('resources', lesson.id, e.target.files[0], 'lessons', 'audio_url')
                                              }
                                            }}
                                          />
                                          {lesson.audio_url && (
                                            <a
                                              href={lesson.audio_url}
                                              target="_blank"
                                              rel="noreferrer"
                                              className="text-xs font-medium text-primary hover:underline"
                                            >
                                              Open audio file
                                            </a>
                                          )}
                                        </div>
                                        {lesson.audio_url ? (
                                          <audio controls preload="metadata" className="w-full">
                                            <source src={lesson.audio_url} />
                                            Your browser does not support the audio player.
                                          </audio>
                                        ) : (
                                          <p className="text-xs text-gray-500">Upload an audio file to show it in the lesson course content.</p>
                                        )}
                                      </div>
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
                                    <div className="space-y-4 pr-8 pt-2 border-t border-gray-100">
                                      <div className="flex items-center gap-2">
                                        <input 
                                          type="checkbox" 
                                          id={`homework-${lesson.id}`}
                                          checked={lesson.has_homework}
                                          onChange={(e) => handleUpdateLesson(lesson.id, 'has_homework', e.target.checked)}
                                          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <Label htmlFor={`homework-${lesson.id}`} className="text-sm font-semibold">Include Homework</Label>
                                      </div>
                                      
                                      {lesson.has_homework && (
                                        <div className="pl-6 space-y-3">
                                          <p className="text-xs text-gray-500 font-medium">Submission Method:</p>
                                          <div className="flex gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                              <input 
                                                type="radio" 
                                                name={`homework-type-${lesson.id}`}
                                                checked={lesson.homework_type === 'link'}
                                                onChange={() => handleUpdateLesson(lesson.id, 'homework_type', 'link')}
                                                className="w-4 h-4 text-primary focus:ring-primary"
                                              />
                                              <span className="text-xs">Paste Link</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                              <input 
                                                type="radio" 
                                                name={`homework-type-${lesson.id}`}
                                                checked={lesson.homework_type === 'upload'}
                                                onChange={() => handleUpdateLesson(lesson.id, 'homework_type', 'upload')}
                                                className="w-4 h-4 text-primary focus:ring-primary"
                                              />
                                              <span className="text-xs">File Upload</span>
                                            </label>
                                          </div>
                                        </div>
                                      )}
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

                        <Dialog open={selectedQuizId !== null && quizzes.find(q => q.id === selectedQuizId)?.module_id === mod.id} onOpenChange={(open) => { if(!open) setSelectedQuizId(null); }}>
                          <DialogTrigger render={<Button variant="outline" size="sm" onClick={() => handleManageModuleQuiz(mod.id)} className="text-orange-600 border-orange-200 hover:bg-orange-50" />}>
                              <CheckCircle2 className="w-4 h-4 mr-2" /> Manage Module Quiz
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-orange-500" />
                                Quiz Questions for {mod.title}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                              <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-500">Create a mandatory quiz for the end of this module.</p>
                                <Button size="sm" onClick={handleAddQuestion} className="bg-orange-500 hover:bg-orange-600">
                                  <Plus className="w-4 h-4 mr-1" /> Add Question
                                </Button>
                              </div>

                              <div className="space-y-6">
                                {quizQuestions.length === 0 && (
                                  <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400 text-sm">
                                    No questions yet. Click "Add Question" to begin.
                                  </div>
                                )}
                                {quizQuestions.map((q, qIdx) => (
                                  <div key={q.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50 space-y-4 relative group/question">
                                    <div className="space-y-2 pr-8">
                                      <Label className="text-xs">Question {qIdx + 1}</Label>
                                      <Input 
                                        defaultValue={q.question} 
                                        onBlur={(e) => handleUpdateQuestion(q.id, 'question', e.target.value)} 
                                      />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                                      {q.options.map((opt, optIdx) => (
                                        <div key={optIdx} className="space-y-1">
                                          <div className="flex items-center gap-2">
                                            <input 
                                              type="radio" 
                                              name={`correct-${q.id}`} 
                                              checked={q.correct_option_index === optIdx}
                                              onChange={() => handleUpdateQuestion(q.id, 'correct_option_index', optIdx)}
                                            />
                                            <Label className="text-[10px] text-gray-500">Option {optIdx + 1} {q.correct_option_index === optIdx && '(Correct)'}</Label>
                                          </div>
                                          <Input 
                                            defaultValue={opt} 
                                            onBlur={(e) => {
                                              const newOptions = [...q.options]
                                              newOptions[optIdx] = e.target.value
                                              handleUpdateQuestion(q.id, 'options', newOptions)
                                            }}
                                            className={q.correct_option_index === optIdx ? 'border-green-500 ring-green-500' : ''}
                                          />
                                        </div>
                                      ))}
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      onClick={() => handleDeleteQuestion(q.id)} 
                                      className="absolute top-2 right-2 text-red-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0 opacity-0 group-hover/question:opacity-100 transition-opacity"
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
      {activeTab === 'library' && (role === 'admin' || role === 'trainer') && (
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Resource Library
              </div>
              <Button onClick={handleCreateResource} className="bg-primary hover:bg-primary/90 text-white">
                <Plus className="w-4 h-4 mr-1" /> New Resource
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resources.map(res => (
                <div key={res.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50 space-y-4 relative group">
                  <div className="flex gap-4">
                    <div className="w-24 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 relative">
                      {res.image_url ? (
                        <img src={res.image_url} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <BookOpen className="w-8 h-8" />
                        </div>
                      )}
                      <Label className="absolute inset-0 cursor-pointer bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                        Upload Cover
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleFileUpload('thumbnails', res.id, e.target.files[0], 'resources', 'image_url')}
                        />
                      </Label>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Title</Label>
                        <Input defaultValue={res.title} onBlur={(e) => handleUpdateResource(res.id, 'title', e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Type & Category</Label>
                        <div className="flex gap-2">
                          <select 
                            defaultValue={res.type} 
                            onChange={(e) => handleUpdateResource(res.id, 'type', e.target.value)}
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs"
                          >
                            <option value="PDF">PDF File</option>
                            <option value="Link">External Link</option>
                            <option value="Video">Video Link</option>
                          </select>
                          <Input 
                            placeholder="Category" 
                            defaultValue={res.category} 
                            onBlur={(e) => handleUpdateResource(res.id, 'category', e.target.value)} 
                            className="h-9 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">{res.type === 'Link' ? 'Link URL' : 'File / Resource URL'}</Label>
                    <div className="flex gap-2">
                      <Input defaultValue={res.url} onBlur={(e) => handleUpdateResource(res.id, 'url', e.target.value)} placeholder="https://..." />
                      {res.type !== 'Link' && (
                        <Button variant="outline" size="sm" className="h-10 relative overflow-hidden">
                          <Plus className="w-4 h-4 mr-1" /> Upload File
                          <input 
                            type="file" 
                            className="absolute inset-0 opacity-0 cursor-pointer" 
                            onChange={(e) => e.target.files?.[0] && handleFileUpload('resources', res.id, e.target.files[0], 'resources', 'url')}
                          />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Description</Label>
                    <textarea 
                      defaultValue={res.description || ''} 
                      onBlur={(e) => handleUpdateResource(res.id, 'description', e.target.value)}
                      className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleDeleteResource(res.id)} 
                    className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'announcements' && (role === 'admin' || role === 'trainer') && (
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Announcements
              <Button onClick={handleCreateAnnouncement} className="bg-primary hover:bg-primary/90 text-white">
                <Plus className="w-4 h-4 mr-1" /> New Announcement
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {announcements.map(ann => (
                <div key={ann.id} className="p-6 border border-gray-100 rounded-xl bg-gray-50 space-y-4 relative group">
                  <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
                    <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden relative group/img">
                      {ann.image_url ? (
                        <img src={ann.image_url} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                          <Plus className="w-8 h-8" />
                        </div>
                      )}
                      <Label className="absolute inset-0 cursor-pointer bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                        Upload Image
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleFileUpload('thumbnails', ann.id, e.target.files[0], 'announcements', 'image_url')}
                        />
                      </Label>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input defaultValue={ann.title} onBlur={(e) => handleUpdateAnnouncement(ann.id, 'title', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Content</Label>
                        <textarea 
                          defaultValue={ann.content} 
                          onBlur={(e) => handleUpdateAnnouncement(ann.id, 'content', e.target.value)}
                          className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleDeleteAnnouncement(ann.id)} 
                    className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'help' && (role === 'admin' || role === 'trainer') && (
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Help Centre Articles
              <Button onClick={handleCreateHelpArticle} className="bg-primary hover:bg-primary/90 text-white">
                <Plus className="w-4 h-4 mr-1" /> New Article
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {helpArticles.map(art => (
                <div key={art.id} className="p-6 border border-gray-100 rounded-xl bg-gray-50 space-y-4 relative group">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-2">
                      <Label>Article Title</Label>
                      <Input defaultValue={art.title} onBlur={(e) => handleUpdateHelpArticle(art.id, 'title', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Input defaultValue={art.category} onBlur={(e) => handleUpdateHelpArticle(art.id, 'category', e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Article Content (Markdown supported)</Label>
                    <textarea 
                      defaultValue={art.content} 
                      onBlur={(e) => handleUpdateHelpArticle(art.id, 'content', e.target.value)}
                      className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleDeleteHelpArticle(art.id)} 
                    className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
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

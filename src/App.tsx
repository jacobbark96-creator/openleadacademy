import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { supabase } from "./lib/supabase/client"
import { TenantProvider } from "./providers/TenantProvider"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import RegisterAcademyPage from "./pages/RegisterAcademyPage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import ResetPasswordPage from "./pages/ResetPasswordPage"
import AboutPage from "./pages/AboutPage"
import ContactPage from "./pages/ContactPage"
import VacanciesPage from "./pages/VacanciesPage"
import PricingPage from "./pages/PricingPage"
import DashboardLayout from "./layouts/DashboardLayout"
import AuthLayout from "./layouts/AuthLayout"
import DashboardPage from "./pages/dashboard/DashboardPage"
import AdminPage from "./pages/dashboard/admin/AdminPage"
import AnnouncementsPage from "./pages/dashboard/AnnouncementsPage"
import LearningPage from "./pages/dashboard/LearningPage"
import LibraryPage from "./pages/dashboard/LibraryPage"
import LessonPage from "./pages/dashboard/LessonPage"
import QuizPage from "./pages/dashboard/QuizPage"
import ProgressPage from "./pages/dashboard/ProgressPage"
import CertificatesPage from "./pages/dashboard/CertificatesPage"
import SettingsPage from "./pages/dashboard/SettingsPage"
import SupportPage from "./pages/dashboard/SupportPage"
import HelpPage from "./pages/dashboard/HelpPage"
import LegalPage from "./pages/dashboard/LegalPage"
import ResourcesPage from "./pages/dashboard/ResourcesPage"

function AuthListener() {
  const navigate = useNavigate()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        navigate("/reset-password")
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <TenantProvider>
        <AuthListener />
        <Routes>
          {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/vacancies" element={<VacanciesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/register-academy" element={<RegisterAcademyPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Dashboard Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/admin" element={<AdminPage />} />
          
          <Route path="/dashboard/announcements" element={<AnnouncementsPage />} />
          <Route path="/dashboard/learning" element={<LearningPage />} />
          <Route path="/dashboard/lessons/:id" element={<LessonPage />} />
          <Route path="/dashboard/quizzes" element={<QuizPage />} />
          <Route path="/dashboard/quizzes/:id" element={<QuizPage />} />
          <Route path="/dashboard/library" element={<LibraryPage />} />
          <Route path="/dashboard/progress" element={<ProgressPage />} />
          <Route path="/dashboard/certificates" element={<CertificatesPage />} />
          <Route path="/dashboard/legal" element={<LegalPage />} />
          <Route path="/dashboard/resources" element={<ResourcesPage />} />
          <Route path="/dashboard/settings" element={<SettingsPage />} />
          <Route path="/dashboard/help" element={<HelpPage />} />
          <Route path="/dashboard/support" element={<SupportPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </TenantProvider>
    </BrowserRouter>
  )
}

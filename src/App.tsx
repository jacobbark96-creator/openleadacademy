import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import AboutPage from "./pages/AboutPage"
import ContactPage from "./pages/ContactPage"
import VacanciesPage from "./pages/VacanciesPage"
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/vacancies" element={<VacanciesPage />} />
        
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
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
          <Route path="/dashboard/resources" element={<LibraryPage />} />
          <Route path="/dashboard/settings" element={<SettingsPage />} />
          <Route path="/dashboard/help" element={<HelpPage />} />
          <Route path="/dashboard/support" element={<SupportPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

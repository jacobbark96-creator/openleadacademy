import { Logo } from "@/components/Logo"
import { Outlet } from "react-router-dom"

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 flex flex-col items-center">
          <Logo />
          <p className="text-gray-500 mt-6">Build Elite Sales Skills</p>
        </div>
        <Outlet />
      </div>
    </div>
  )
}

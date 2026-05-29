import { Link } from "react-router-dom"
import { Logo } from "@/components/Logo"

export function PublicFooter() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Logo />
            </Link>
            <p className="text-gray-500 text-sm">
              Building elite sales skills for the next generation of top performers.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">Student Portal</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">Curriculum</Link></li>
              <li><Link to="/vacancies" className="hover:text-primary transition-colors">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Connect</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="#" className="hover:text-primary transition-colors">Twitter</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">LinkedIn</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">YouTube</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-100 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Openlead Academy. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

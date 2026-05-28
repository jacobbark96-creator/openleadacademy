'use client'

import dynamic from 'next/dynamic'

// We disable SSR for the Admin Dashboard to avoid 500 errors on Cloudflare.
// This ensures the page only renders in the browser where it has access 
// to client-side Supabase auth and avoids complex server-side environments.
const AdminClient = dynamic(() => import("./AdminClient"), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#008080]"></div>
    </div>
  )
})

export default function AdminPage() {
  return <AdminClient />
}

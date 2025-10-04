import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyToken } from '../../lib/jwt'
import AdminDashboardClient from './AdminDashboardClient'

export default async function AdminPage() {
  // Server-side orchestration: check token cookie and redirect to SSO if missing/invalid.
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value

  // If no token or invalid, redirect to SSO entry point
  if (!token) {
    const url = new URL('/admin/sso', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')
    url.searchParams.set('from', '/admin')
    redirect(url.toString())
  }

  const payload = verifyToken(token)
  if (!payload) {
    const url = new URL('/admin/sso', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')
    url.searchParams.set('from', '/admin')
    url.searchParams.set('reason', 'invalid_token')
    redirect(url.toString())
  }

  // If token valid, render the client dashboard component
  return <AdminDashboardClient />
}
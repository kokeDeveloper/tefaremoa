import { NextResponse } from 'next/server'
import { PrismaClient } from '../../../generated/prisma'
import { signToken } from '../../../../lib/auth'

const prisma = new PrismaClient()

export async function GET(req: Request) {
  const url = new URL(req.url)
  const from = url.searchParams.get('from') || '/admin'
  const email = url.searchParams.get('email')
  const ssoToken = url.searchParams.get('token') || url.searchParams.get('sso_token')

  // Basic flow: SSO provider should redirect back with ?email=... (or provide a token we can validate).
  // For now, accept email if present and match an existing admin. If not found, redirect to local login.

  try {
    if (!email && !ssoToken) {
      const redirect = new URL('/admin/login', url.origin)
      redirect.searchParams.set('from', from)
      redirect.searchParams.set('reason', 'missing_sso_data')
      return NextResponse.redirect(redirect)
    }

    // If email provided, find admin
    let admin = null
    if (email) {
      admin = await prisma.admin.findUnique({ where: { email } })
    }

    // NOTE: if you integrate a real SSO provider, validate `ssoToken` here and extract the email.
    if (!admin) {
      const redirect = new URL('/admin/login', url.origin)
      redirect.searchParams.set('from', from)
      redirect.searchParams.set('reason', 'no_admin')
      return NextResponse.redirect(redirect)
    }

    const token = signToken({ id: admin.id, email: admin.email, role: admin.role })
    const res = NextResponse.redirect(from)
    res.cookies.set('token', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 })
    return res
  } catch (err) {
    const redirect = new URL('/admin/login', req.url)
    redirect.searchParams.set('from', from)
    redirect.searchParams.set('reason', 'sso_error')
    return NextResponse.redirect(redirect)
  } finally {
    await prisma.$disconnect()
  }
}

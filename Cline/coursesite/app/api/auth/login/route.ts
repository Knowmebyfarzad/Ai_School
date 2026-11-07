import { NextResponse } from 'next/server'
import { signToken } from '@/lib/auth'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { email } = await req.json()
  if (!email) return new Response('Email required', { status: 400 })

  let user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    user = await prisma.user.create({
      data: { email, password: 'beta-no-password' },
    })
  }

  const token = signToken({ userId: user.id })
  cookies().set('token', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 })

  return NextResponse.json({ ok: true })
}
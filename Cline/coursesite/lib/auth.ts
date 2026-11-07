import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const SECRET = process.env.JWT_SECRET!

export function signToken(payload: object) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' })
}

export function getSession() {
  const token = cookies().get('token')?.value
  if (!token) return null
  try {
    return jwt.verify(token, SECRET) as { userId: string }
  } catch {
    return null
  }
}
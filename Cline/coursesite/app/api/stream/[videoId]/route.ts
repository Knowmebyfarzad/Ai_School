import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import fs from 'fs/promises'

export async function GET(req: Request, { params }: { params: { videoId: string } }) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')
  if (!token) return new Response('Missing token', { status: 401 })

  let decoded
  try {
    decoded = Buffer.from(token, 'base64url').toString()
  } catch {
    return new Response('Bad token', { status: 401 })
  }

  const [videoId, userId, exp, sig] = decoded.split(':')
  if (!videoId || !userId || !exp || !sig) return new Response('Bad token', { status: 401 })
  if (Math.floor(Date.now() / 1000) > parseInt(exp)) return new Response('Expired', { status: 401 })

  const message = `${videoId}:${userId}:${exp}`
  const expected = crypto.createHmac('sha256', process.env.SIGNING_SECRET!).update(message).digest('hex')
  if (sig !== expected) return new Response('Invalid', { status: 401 })

  const video = await prisma.video.findUnique({ where: { id: videoId } })
  if (!video) return new Response('Not found', { status: 404 })

  const file = await fs.readFile(video.filePath)
  return new Response(file, {
    headers: { 'Content-Type': 'video/mp4', 'Cache-Control': 'private, max-age=3600' },
  })
}
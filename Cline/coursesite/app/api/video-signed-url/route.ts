import crypto from 'crypto'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const videoId = searchParams.get('videoId')
  const session = getSession()
  if (!session || !videoId) return new Response('Unauthorized', { status: 401 })

  const video = await prisma.video.findUnique({ where: { id: videoId } })
  if (!video) return new Response('Not found', { status: 404 })

  const enrolled = await prisma.enrollment.findFirst({
    where: { userId: session.userId, courseId: video.courseId },
  })
  if (!enrolled) return new Response('Forbidden', { status: 403 })

  const exp = Math.floor(Date.now() / 1000) + 3600
  const message = `${videoId}:${session.userId}:${exp}`
  const sig = crypto.createHmac('sha256', process.env.SIGNING_SECRET!).update(message).digest('hex')
  const token = Buffer.from(`${message}:${sig}`).toString('base64url')

  return Response.json({ url: `/api/stream/${videoId}?token=${token}` })
}
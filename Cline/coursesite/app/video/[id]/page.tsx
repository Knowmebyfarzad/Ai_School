import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export default async function VideoPage({ params }: { params: { id: string } }) {
  const session = getSession()
  if (!session) redirect('/login')

  const video = await prisma.video.findUnique({ where: { id: params.id } })
  if (!video) return <div>ویدیو پیدا نشد</div>

  const enrolled = await prisma.enrollment.findFirst({
    where: { userId: session.userId, courseId: video.courseId },
  })
  if (!enrolled) return <div>شما به این دوره دسترسی ندارید</div>

  // ساخت لینک موقت (signed URL) معتبر ۱ ساعت
  const exp = Math.floor(Date.now() / 1000) + 3600
  const message = `${video.id}:${session.userId}:${exp}`
  const sig = crypto.createHmac('sha256', process.env.SIGNING_SECRET!).update(message).digest('hex')
  const token = Buffer.from(`${message}:${sig}`).toString('base64url')
  const src = `/api/stream/${video.id}?token=${token}`

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 900, margin: '40px auto', padding: 20 }}>
      <h1>{video.title}</h1>
      <video controls width="100%" style={{ maxWidth: 800 }}>
        <source src={src} type="video/mp4" />
        مرورگر شما از ویدیو پشتیبانی نمی‌کند.
      </video>
      <p style={{ marginTop: 10, fontSize: 14, color: '#666' }}>
        لینک ویدیو یک ساعت معتبر است و فقط برای شما است.
      </p>
    </div>
  )
}
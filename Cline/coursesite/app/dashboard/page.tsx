import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function Dashboard() {
  const session = getSession()
  if (!session) redirect('/login')

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.userId },
    include: { course: { include: { videos: { orderBy: { order: 'asc' } } } } },
  })

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 800, margin: '40px auto', padding: 20 }}>
      <h1>دوره‌های شما</h1>
      {enrollments.length === 0 ? (
        <p>هیچ دوره‌ای خریداری نکرده‌اید.</p>
      ) : (
        <ul>
          {enrollments.map((e) => (
            <li key={e.course.id} style={{ marginBottom: 20 }}>
              <h2>{e.course.title}</h2>
              <ul>
                {e.course.videos.map((v) => (
                  <li key={v.id}>
                    <a href={`/video/${v.id}`}>{v.title}</a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
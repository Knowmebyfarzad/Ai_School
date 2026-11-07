import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(req: Request) {
  const { courseId } = await req.json()
  const session = getSession()
  if (!session) return new Response('Unauthorized', { status: 401 })

  const course = await prisma.course.findUnique({ where: { id: courseId } })
  if (!course) return new Response('Not found', { status: 404 })

  const checkout = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: course.title },
          unit_amount: course.priceCents,
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXTAUTH_URL}/dashboard?payment=success`,
    cancel_url: `${process.env.NEXTAUTH_URL}/dashboard?payment=cancel`,
    metadata: { userId: session.userId, courseId },
  })

  await prisma.order.create({
    data: {
      userId: session.userId,
      courseId,
      stripeSessionId: checkout.id,
      amountCents: course.priceCents,
      status: 'pending',
    },
  })

  return Response.json({ url: checkout.url })
}
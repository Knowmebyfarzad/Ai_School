import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

export async function POST(req: Request) {
  const body = await req.text()
  const sig = headers().get('stripe-signature')!

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return new Response('Bad signature', { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const s = event.data.object as any
    const { userId, courseId } = s.metadata || {}

    await prisma.order.update({
      where: { stripeSessionId: s.id },
      data: { status: 'paid' },
    })

    await prisma.enrollment.upsert({
      where: { userId_courseId: { userId, courseId } },
      update: {},
      create: { userId, courseId },
    })
  }

  return new Response('ok', { status: 200 })
}
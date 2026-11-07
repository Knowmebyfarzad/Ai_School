import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 600, margin: '40px auto', padding: 20 }}>
      <h1>سایت دوره آموزشی</h1>
      <p>نسخه بتا ساده</p>
      <ul>
        <li><Link href="/login">ورود / ثبت نام</Link></li>
        <li><Link href="/dashboard">داشبورد (دوره‌های من)</Link></li>
      </ul>
    </div>
  )
}
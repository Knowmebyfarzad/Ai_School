export default function Login() {
  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 400, margin: '60px auto', padding: 20 }}>
      <h1>ورود</h1>
      <form
        action="/api/auth/login"
        method="POST"
        style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
      >
        <input name="email" type="email" placeholder="ایمیل" required />
        <button type="submit">ورود</button>
      </form>
    </div>
  )
}
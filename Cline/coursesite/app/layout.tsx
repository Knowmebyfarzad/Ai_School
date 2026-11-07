export const metadata = {
  title: 'Course Site',
  description: 'Simple video course platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
import SideBar from "@/components/sideBar"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
        <SideBar />
      <body>{children}</body>
    </html>
  )
}

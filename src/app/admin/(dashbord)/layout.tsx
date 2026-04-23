import TopBar from "@/components/admin/topBar";
import SideBar from "@/components/sideBar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TopBar />
        <div className="grid grid-cols-5">
          <SideBar />
          <div className="col-span-4">{children}</div>
        </div>
      </body>
    </html>
  );
}

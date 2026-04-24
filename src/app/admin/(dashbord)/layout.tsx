import TopBar from "@/components/admin/topBar";
import SideBar from "@/components/sideBar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar />

      <div className="flex md:flex-1 overflow-hidden">
        <div className="md:w-72 flex-none border-r border-gray-700">
          <SideBar />
        </div>

        <main className="md:flex-1 w-full overflow-y-auto bg-gray-50/50">
          {children}
        </main>
      </div>
    </div>
  );
}

import { Header } from "@/components/headers"
import { UserSidebar } from "@/components/sidebars"
import pathnames from "@/lib/pathnames"
import { useMeStore } from "@/zustand/useMeStore"
import { Navigate, Outlet } from "react-router-dom"
import { toast } from "sonner"

const AdminLayout = () => {
  const { me } = useMeStore()
  if (!me || me.role === "Thành viên" || me.role === "Chủ trọ") {
    toast.warning("Không có quyền truy cập.")
    return <Navigate to={"/" + pathnames.publics.login} replace={true} />
  }
  return (
    <div className="th-admin-shell bg-slate-100 flex min-h-screen flex-col">
      <Header />
      <main className="th-admin-layout flex flex-auto">
        <aside className="w-[296px] hidden lg:block flex-none" aria-hidden="true"></aside>
        <aside className="th-admin-sidebar w-[296px] hidden lg:block fixed top-[70px] h-full left-0" aria-label="Thanh công cụ quản trị viên">
          <UserSidebar />
        </aside>
        <section className="th-admin-content w-full bg-slate-100 h-full flex-auto">
          <Outlet />
        </section>
      </main>
    </div>
  )
}

export default AdminLayout

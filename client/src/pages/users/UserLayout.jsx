import { Header } from "@/components/headers"
import { UserSidebar } from "@/components/sidebars"
import pathnames from "@/lib/pathnames"
import { useMeStore } from "@/zustand/useMeStore"
import { Navigate, Outlet } from "react-router-dom"

const UserLayout = () => {
  const { me } = useMeStore()
  if (!me) return <Navigate to={"/" + pathnames.publics.login} />
  return (
    <div className="bg-slate-100 flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-auto">
        <div className="w-[296px] hidden lg:block flex-none"></div>
        <div className="w-[296px] hidden lg:block fixed top-[70px] h-full left-0">
          <UserSidebar />
        </div>
        <div className="w-full bg-slate-100 h-full flex-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default UserLayout

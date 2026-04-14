import { Header } from "@/components/headers"
import { Footer } from "@/components/layouts"
import { Navigation } from "@/components/navigations"
import { Outlet } from "react-router-dom"

const PublicLayout = () => {
  return (
    <div className="th-public-shell bg-white">
      <Header />
      <Navigation />
      <main className="th-public-main h-[calc(100vh-110px)] flex flex-col">
        <section className="th-public-content flex-auto">
          <Outlet />
        </section>
        <Footer />
      </main>
    </div>
  )
}

export default PublicLayout

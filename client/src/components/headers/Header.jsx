import { Link, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { CirclePlus, Heart, LogOut, Menu } from "lucide-react"
import pathnames from "@/lib/pathnames"
import { useMeStore } from "@/zustand/useMeStore"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu"
import { adminMenu, navigations, ownerMenu, userMenu } from "@/lib/constant"
import { useEffect, useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"

const Header = () => {
  const navigate = useNavigate()
  const { me, logout } = useMeStore()
  const [menu, setMenu] = useState(userMenu)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (me && me.role === "Chủ trọ") setMenu(ownerMenu)
    if (me && me.role === "Quản trị viên") setMenu(adminMenu)
  }, [me])

  const handleLogOut = () => {
    logout()
    navigate("/" + pathnames.publics.login)
  }

  const getPublicPath = (path = "") => (path ? `/${path}` : "/")

  return (
    <header className="th-header-shell h-[70px] flex-none w-full py-[15px] border-b bg-primary text-primary-foreground sticky top-0 z-20 flex items-center justify-between">
      <nav
        className="th-header-inner w-main flex items-center justify-between mx-auto"
        aria-label="Thanh điều hướng chính"
      >
        <Link to="/" className="text-3xl text-primary-foreground font-display font-extrabold tracking-[0.02em]">
          Trohub
        </Link>
        <div className="hidden md:flex items-center gap-3">
          {me && (
            <div className="flex items-center justify-center gap-7">
              <Link className="relative" to={"/" + pathnames.user.layout + pathnames.user.wishlist}>
                <Heart size="20" />
                {me?.rWishlist?.length > 0 && (
                  <span className="text-[8px] w-3 h-3 rounded-full grid place-content-center bg-red-500 text-white absolute -top-1 -right-1">
                    {me?.rWishlist?.length}
                  </span>
                )}
              </Link>
            </div>
          )}
          {!me && (
            <Button
              onClick={() => navigate(pathnames.publics.layout + pathnames.publics.login)}
              variant="link"
              className="text-white hover:text-white/80"
            >
              Đăng nhập / Đăng ký
            </Button>
          )}

          {me && (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-bold">{me.fullname}</NavigationMenuTrigger>
                  <NavigationMenuContent className="px-4 py-2 grid min-w-48 grid-cols-1">
                    {menu.map((el) => (
                      <NavigationMenuLink asChild key={el.id}>
                        <Link
                          className="col-span-1 flex items-center gap-2 rounded text-sm hover:bg-space-holder-color px-2 whitespace-nowrap py-1 cursor-pointer"
                          to={"/" + el.path}
                        >
                          {el.icon}
                          {el.label}
                        </Link>
                      </NavigationMenuLink>
                    ))}
                    <div className="w-full h-[1px] border-t border-slate-200 my-1"></div>
                    <div
                      onClick={handleLogOut}
                      className="col-span-1 flex items-center gap-2 rounded text-sm hover:bg-space-holder-color px-2 whitespace-nowrap py-1 cursor-pointer"
                    >
                      <LogOut size="14" />
                      <span>Đăng xuất</span>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}
          <Button
            onClick={() => navigate("/" + pathnames.owner.layout + pathnames.owner.createPost)}
            variant="outline"
            className="border-white/70 text-white bg-transparent hover:bg-white/10 hover:text-white"
          >
            <span>Đăng tin mới</span>
            <CirclePlus size={15} />
          </Button>
        </div>
        <div className="md:hidden flex items-center gap-2">
          {me && (
            <Link className="relative p-2" to={"/" + pathnames.user.layout + pathnames.user.wishlist}>
              <Heart size={20} />
              {me?.rWishlist?.length > 0 && (
                <span className="text-[8px] w-3 h-3 rounded-full grid place-content-center bg-red-500 text-white absolute -top-1 -right-1">
                  {me?.rWishlist?.length}
                </span>
              )}
            </Link>
          )}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-white/70 text-white bg-transparent hover:bg-white/10 hover:text-white"
                aria-label="Open menu"
                data-testid="mobile-hamburger-menu"
              >
                <Menu size={18} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="th-mobile-sheet w-[85%] sm:max-w-sm">
              <SheetHeader>
                <SheetTitle>Trohub Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-2">
                {navigations.map((el) => (
                  <Link
                    key={el.id}
                    to={getPublicPath(el.pathname)}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block rounded-md px-3 py-2 text-sm font-semibold hover:bg-secondary"
                  >
                    {el.label}
                  </Link>
                ))}
                <div className="h-[1px] bg-border my-2" />
                {me &&
                  menu.map((el) => (
                    <Link
                      key={el.id}
                      to={`/${el.path}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block rounded-md px-3 py-2 text-sm hover:bg-secondary"
                    >
                      {el.label}
                    </Link>
                  ))}
                {!me && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      navigate(pathnames.publics.layout + pathnames.publics.login)
                    }}
                    className="w-full text-left rounded-md px-3 py-2 text-sm font-semibold hover:bg-secondary"
                  >
                    Đăng nhập / Đăng ký
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    navigate("/" + pathnames.owner.layout + pathnames.owner.createPost)
                  }}
                  className="w-full text-left rounded-md px-3 py-2 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Đăng tin mới
                </button>
                {me && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      handleLogOut()
                    }}
                    className="w-full text-left rounded-md px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    Đăng xuất
                  </button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}

export default Header

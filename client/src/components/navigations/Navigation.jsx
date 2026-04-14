import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { navigations } from "@/lib/constant"
import { cn } from "@/lib/utils"
import { Link, useLocation } from "react-router-dom"

const Navigation = () => {
  const location = useLocation()
  return (
    <nav
      className="th-navigation-box h-10 text-sm text-slate-50 hidden md:grid place-content-center bg-primary top-[70px] z-10 sticky"
      aria-label="Điều hướng danh mục"
    >
      <NavigationMenu>
        <NavigationMenuList className="w-main flex items-center justify-start h-full m-auto">
          {navigations.map((el) => (
            <NavigationMenuItem
              className={cn(
                "h-10 cursor-pointer flex items-center hover:bg-slate-800",
                location.pathname === "/" + el.pathname && "bg-slate-800"
              )}
              key={el.id}
            >
              <NavigationMenuLink asChild>
                <Link className="px-4 h-full flex font-semibold items-center" to={el.pathname}>
                  {el.label}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  )
}

export default Navigation

import { Fragment, useEffect, useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { adminMenu, ownerMenu, userMenu } from "@/lib/constant"
import { useMeStore } from "@/zustand/useMeStore"

const NavMenu = () => {
  const [activedTab, setActivedTab] = useState([])
  const { pathname } = useLocation()
  const [currentCollapsed, setCurrentCollapsed] = useState(null)
  const [menu, setMenu] = useState(userMenu)
  const { me } = useMeStore()

  useEffect(() => {
    if (me?.role && me.role === "Chủ trọ") setMenu(ownerMenu)
    if (me?.role && me.role === "Quản trị viên") setMenu(adminMenu)
  }, [me])

  const handleSetActivedTab = (id) => {
    if (id === activedTab) setActivedTab((prev) => prev.filter((el) => el !== id))
    else setActivedTab((prev) => [...prev, id])
  }

  useEffect(() => {
    const activedSub = menu.find((el) => el.hasSubs && el.subs.some((sub) => pathname.includes(sub.path)))
    if (activedSub) {
      setActivedTab((prev) => [...prev, activedSub.id])
      setCurrentCollapsed(activedSub.id)
    } else setCurrentCollapsed(null)
  }, [pathname, menu])

  return (
    <div className="py-4">
      {menu.map((el) => (
        <Fragment key={el.id}>
          {el.hasSubs && (
            <Collapsible
              open={activedTab.some((id) => id === el.id)}
              onOpenChange={(open) =>
                open
                  ? setActivedTab((prev) => [...prev, el.id])
                  : setActivedTab((prev) => prev.filter((t) => t !== el.id))
              }
            >
              <CollapsibleTrigger
                onClick={() => handleSetActivedTab(el.id)}
                className="flex hover:bg-slate-200 w-full py-2 px-4 items-center justify-between"
              >
                <p className={cn("flex items-center gap-2", currentCollapsed === el.id && "text-blue-600")}>
                  {el.icon} {el.label}
                </p>
                {activedTab.some((id) => id === el.id) ? (
                  <ChevronDown color="#555" size={14} />
                ) : (
                  <ChevronRight color="#555" size={14} />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent>
                {el.subs.map((el) => (
                  <NavLink
                    key={el.id}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center hover:bg-slate-200 gap-2 px-4 pl-9 py-2",
                        isActive && "bg-slate-200"
                      )
                    }
                    to={"/" + el.path}
                  >
                    {el.label}
                  </NavLink>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}
          {!el.hasSubs && (
            <NavLink
              className={({ isActive }) =>
                cn(
                  "flex items-center hover:bg-slate-200 gap-2 px-4 py-2",
                  isActive && "bg-slate-200 border-l-4 border-blue-600"
                )
              }
              to={"/" + el.path}
            >
              {el.icon}
              {el.label}
            </NavLink>
          )}
        </Fragment>
      ))}
    </div>
  )
}

export default NavMenu

import { UserBox } from "."
import NavMenu from "./NavMenu"

const UserSidebar = () => {
  return (
    <div className="bg-white w-full h-full">
      <UserBox />
      <NavMenu />
    </div>
  )
}

export default UserSidebar

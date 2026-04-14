import { generateDefaultAvatar } from "@/lib/utils"
import { useMeStore } from "@/zustand/useMeStore"

const UserBox = () => {
  const { me } = useMeStore()
  return (
    <div className="flex p-4 items-center gap-2">
      <div className="relative">
        <img
          src={me?.avatar || generateDefaultAvatar(me?.fullname?.toLowerCase())}
          alt="Avatar"
          className="w-16 h-16 border-slate-200 object-cover rounded-full border-2"
        />
      </div>
      <div>
        <p className="font-bold">{me?.fullname}</p>
        <p className="flex text-sm items-center gap-2 justify-between">
          <span>Số dư TK:</span>
          <span>{me?.balance + " đ"}</span>
        </p>
      </div>
    </div>
  )
}

export default UserBox

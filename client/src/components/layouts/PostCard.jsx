import { Card, CardContent } from "@/components/ui/card"
import PropTypes from "prop-types"
import {
  BadgeCheck,
  BadgeHelp,
  Ban,
  Edit,
  EllipsisVertical,
  HandCoins,
  Heart,
  Hourglass,
  ImagePlay,
  MapPin,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import moment from "moment"
import { toast } from "sonner"
import { apiRemovePostByUser } from "@/apis/post"
import { cn, fromNow, handleClassifyMedia, renderGender, shortNumber } from "@/lib/utils"
import Tooltip from "@/components/tooltips/Tooltip"
import { Link } from "react-router-dom"
import pathnames from "@/lib/pathnames"
import ConditionRender from "./ConditionRender"
import { apiAddWishlist } from "@/apis/user"
import { useMeStore } from "@/zustand/useMeStore"
import Expired from "./Expired"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { useState } from "react"

const PostCard = ({
  media = [],
  title,
  price = 0,
  size = 0,
  address,
  createdAt,
  isShowWislish = false,
  checked = false,
  onCheckedChange,
  status = "",
  // eslint-disable-next-line react/prop-types
  roomStatus,
  verified,
  expiredDate,
  isUpdating = false,
  setEditPost,
  gender,
  post,
  refresh,
  bedroom,
  bathroom,
  isManage = false,
}) => {
  const { getMe, me } = useMeStore()
  const [isHandleExpired, setIsHandleExpired] = useState(false)
  const [isShowOption, setIsShowOption] = useState(false)

  const handleCheckStatus = () => {
    if (roomStatus === "Còn trống") return "bg-green-600"
    if (roomStatus === "Đã thuê") return "bg-cyan-600"
    return "bg-slate-500"
  }
  const handleRemoveCard = async () => {
    const response = await apiRemovePostByUser({ postIds: post.id })
    if (response.data.success) {
      toast.success(response.data.msg)
      refresh()
    } else toast.error(response.data.msg)
  }

  const updateWishlist = async () => {
    const response = await apiAddWishlist({
      idPost: post.id,
    })
    if (response.data.success) {
      toast.success(response.data.msg)
      getMe()
    } else toast.error("Có lỗi, hãy thử lại sau.")
  }

  return (
    <>
      <Card className="th-post-shell" data-testid={`post-card-${post?.id || "unknown"}`}>
        <CardContent
          className={cn(
            "th-post-frame rounded-md flex h-full flex-row p-0",
            isUpdating && "border-red-600 bg-red-100"
          )}
        >
          <figure className="th-post-media w-[30%] h-[175px] rounded-l-md flex-none overflow-hidden relative">
            {handleClassifyMedia(media[0]) === "IMAGE" && (
              <img
                src={media[0] || "/image.svg"}
                alt="Thumb"
                className="w-full h-full rounded-l-md object-cover"
              />
            )}
            {handleClassifyMedia(media[0]) === "VIDEO" && (
              <video src={media[0]} alt="Video" className="w-full h-full rounded-l-md object-cover" />
            )}
            <figcaption className="absolute inset-0 bg-gradient-to-t from-black/70 group text-slate-50 to-transparent">
              {!isManage && (
                <div
                  style={{ clipPath: "polygon(0% 0%, 90% 0, 100% 50%, 90% 100%, 0% 100%)" }}
                  className={cn(
                    "top-1 left-0 w-fit px-1 h-6 pr-2 text-xs font-bold grid place-items-center text-slate-50 absolute",
                    handleCheckStatus()
                  )}
                >
                  {roomStatus}
                </div>
              )}
              <ConditionRender show={isManage}>
                <div
                  style={{ clipPath: "polygon(0% 0%, 90% 0, 100% 50%, 90% 100%, 0% 100%)" }}
                  className={cn(
                    "top-1 left-0 w-fit px-1 h-6 pr-2 bg-slate-500 text-xs font-bold grid place-items-center text-slate-50 absolute"
                  )}
                >
                  {status}
                </div>
              </ConditionRender>
              {isManage && (
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => onCheckedChange(post.id)}
                  className={cn(
                    "absolute bottom-3 border-slate-50 left-3 group-hover:block hidden",
                    checked && "block border-blue-600"
                  )}
                />
              )}
              <ConditionRender show={!isManage}>
                <span
                  onClick={updateWishlist}
                  className={cn("absolute bottom-3 p-1 border-slate-50 left-3 group-hover:block")}
                >
                  <Heart
                    fill={me?.rWishlist?.some((el) => el.idPost === post.id) ? "#dc2626 " : "transparent"}
                    size={16}
                    className={cn(me?.rWishlist?.some((el) => el.idPost === post.id) && "text-red-600")}
                  />
                </span>
              </ConditionRender>
              <p className="flex absolute bottom-3 right-3 gap-1 items-center">
                <span className="text-sm">{media.length}</span>
                <ImagePlay size={14} />
              </p>
            </figcaption>
          </figure>
          <section className="th-post-content p-3 flex-auto space-y-2">
            <header className="flex items-center gap-2">
              <Link
                to={"/" + pathnames.publics.detailPost + post.id}
                className="line-clamp-1 flex-auto font-bold hover:text-primary hover:underline text-lg"
                data-testid={`post-card-title-${post?.id || "unknown"}`}
              >
                {verified ? (
                  <Tooltip explain="Tin đăng đã xác thực ✅">
                    <BadgeCheck size={20} color="green" className="inline-block mb-1 mr-1" />
                  </Tooltip>
                ) : (
                  <Tooltip explain="Tin đăng chưa xác thực ⁉️">
                    <BadgeHelp size={20} color="red" className="inline-block mb-1 mr-1" />
                  </Tooltip>
                )}
                <span>{title}</span>
              </Link>
              {isManage && (
                <DropdownMenu open={isShowOption} onOpenChange={setIsShowOption}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      onClick={() => setIsShowOption(true)}
                      className="w-fit p-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-fit bg-transparent text-slate-900 hover:text-blue-600 hover:bg-transparent"
                    >
                      <EllipsisVertical size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-40">
                    <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      {!isUpdating && (
                        <DropdownMenuItem
                          onClick={() => {
                            setEditPost(post)
                            setIsShowOption(false)
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Chỉnh sửa</span>
                        </DropdownMenuItem>
                      )}
                      {isUpdating && (
                        <DropdownMenuItem
                          onClick={() => {
                            setEditPost(null)
                            setIsShowOption(false)
                          }}
                        >
                          <Ban className="mr-2 h-4 w-4" />
                          <span>Hủy chỉnh sửa</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => {
                          handleRemoveCard()
                          setIsShowOption(false)
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Xóa tin</span>
                      </DropdownMenuItem>
                      {moment(expiredDate).isBefore(moment()) && (
                        <DropdownMenuItem
                          onClick={() => {
                            setIsHandleExpired(true)
                            setIsShowOption(false)
                          }}
                          className="w-full"
                        >
                          <HandCoins className="mr-2 h-4 w-4" />
                          <span>Gia hạn</span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </header>
            <p className="flex items-center font-bold text-blue-600 text-lg gap-4">
              <span>{`${shortNumber(price)}`}</span>
              <span>
                <span>{size}</span>
                <span>
                  m<sup>2</sup>
                </span>
              </span>
            </p>
            <p className="line-clamp-1">
              <span className="inline-block">
                <MapPin size={14} />
              </span>
              <span className="ml-2 text-sm">{address}</span>
            </p>
            {!isManage && (
              <div className="flex items-center gap-3">
                <p className="text-xs w-fit flex items-center gap-2 text-primary font-bold">
                  <img src={renderGender(gender)} alt="Gender" className="w-5 h-5 object-cover" />
                  <span>{gender}</span>
                </p>
                <p className="text-xs w-fit flex items-center gap-2 text-primary font-bold">
                  <img src="/Bedroom.svg" alt="Gender" className="w-5 h-5 object-cover" />
                  <span>{bedroom}</span>
                </p>
                <p className="text-xs w-fit flex items-center gap-2 text-primary font-bold">
                  <img src="/Bathroom.svg" alt="Gender" className="w-5 h-5 object-cover" />
                  <span>{bathroom}</span>
                </p>
              </div>
            )}
            {isManage && expiredDate && (
              <p className={cn(moment(expiredDate).isBefore(moment()) && "text-red-600")}>
                <span className="inline-block">
                  <Hourglass size={14} />
                </span>
                <span className={cn("ml-2")}>{moment(expiredDate).format("DD/MM/YYYY")}</span>
                {moment(expiredDate).isBefore(moment()) && <sup>{`(Quá hạn)`}</sup>}
              </p>
            )}
            <ConditionRender show={isManage}>
              <p className={cn(moment(expiredDate).isBefore(moment()) && "text-red-600")}>
                👉
                <span className="font-bold text-xs">{roomStatus}</span>
              </p>
            </ConditionRender>
            <footer className="flex items-center justify-between">
              <span className="text-xs italic">{"Đăng " + fromNow(createdAt)}</span>
              {isShowWislish && (
                <Button className="w-fit p-0 h-fit bg-transparent text-slate-900 hover:text-blue-600 hover:bg-transparent">
                  <Heart />
                </Button>
              )}
            </footer>
          </section>
        </CardContent>
      </Card>
      <Dialog open={isHandleExpired} onOpenChange={setIsHandleExpired}>
        <DialogContent className="p-0">
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <Expired onCloseDialog={() => setIsHandleExpired(false)} refresh={refresh} idPost={post.id} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default PostCard
PostCard.propTypes = {
  media: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired,
  post: PropTypes.any.isRequired,
  address: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  bedroom: PropTypes.number,
  bathroom: PropTypes.number,
  gender: PropTypes.string,
  size: PropTypes.number.isRequired,
  createdAt: PropTypes.string.isRequired,
  isShowWislish: PropTypes.bool,
  onCheckedChange: PropTypes.func,
  checked: PropTypes.bool,
  status: PropTypes.string,
  verified: PropTypes.bool.isRequired,
  expiredDate: PropTypes.string.isRequired,
  isUpdating: PropTypes.bool,
  setEditPost: PropTypes.func,
  refresh: PropTypes.func,
  isManage: PropTypes.bool,
}

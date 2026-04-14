import PropTypes from "prop-types"
import Star from "../layouts/Star"
import VoteBar from "./VoteBar"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { votes } from "@/lib/constant"
import { useState } from "react"
import { Star as StarIcon } from "lucide-react"
import { apiRatingPost } from "@/apis/post"
import { useMeStore } from "@/zustand/useMeStore"
import { ConditionRender } from "../layouts"
import { createSearchParams, useLocation, useNavigate } from "react-router-dom"
import pathnames from "@/lib/pathnames"
import { toast } from "sonner"

const Rating = ({ averageStar = 0, idPost, onMutate, voters = [] }) => {
  const [star, setStar] = useState(0)
  const { me } = useMeStore()
  const location = useLocation()
  const navigate = useNavigate()
  const [isShowDialog, setIsShowDialog] = useState(false)

  const handleRatingPost = async () => {
    const response = await apiRatingPost({ idPost, star })
    if (response.data.success) {
      toast.success(response.data.msg)
      onMutate()
      setIsShowDialog(false)
    } else toast.error(response.data.msg)
  }
  const redirectLogin = () => {
    navigate({
      pathname: "/" + pathnames.publics.login,
      search: createSearchParams({ redirect: location.pathname }).toString(),
    })
  }
  return (
    <div className="space-y-3">
      <p className="font-bold">Đánh giá của bạn</p>
      <div className="border rounded-md p-6">
        <div className="grid grid-cols-2">
          <div className="flex items-center flex-col gap-2 justify-center p-4">
            <p className="text-3xl font-bold">{`${averageStar}/5`}</p>
            <Star starNumber={averageStar} />
            <span className="text-xs text-gray-600">{`${voters.length} lượt đánh giá`}</span>
          </div>
          <div className="p-[10px]">
            {[...Array(5).keys()].map((item) => (
              <VoteBar
                key={item}
                star={5 - item}
                voter={voters?.filter((i) => +i.star === 5 - item)?.length}
                percent={Math.round(
                  (voters?.filter((i) => +i.star === 5 - item)?.length * 100) / voters?.length
                )}
              />
            ))}
          </div>
        </div>
        <div className="p-4 grid place-content-center">
          <ConditionRender show={!me}>
            <p className="text-center text-sm">
              Bạn chưa đăng nhập, vui lòng hãy{" "}
              <span className="underline cursor-pointer text-blue-600 font-bold" onClick={redirectLogin}>
                đăng nhập
              </span>{" "}
              trước khi đánh giá 😊
            </p>
          </ConditionRender>
          <ConditionRender show={!!me}>
            <Dialog open={isShowDialog} onOpenChange={setIsShowDialog}>
              <DialogTrigger asChild>
                <Button>Đánh giá bản tin</Button>
              </DialogTrigger>
              <DialogContent className="w-[700px] max-w-full">
                <DialogHeader>
                  <DialogTitle></DialogTitle>
                  <div className="space-y-6">
                    <p className="font-bold">Bạn thấy tin đăng này như thế nào?</p>
                    <div className="w-full flex justify-between items-center">
                      {votes.map((item) => (
                        <span
                          key={item.star}
                          onClick={() => setStar(item.star)}
                          className="flex flex-col flex-1 py-4 gap-2 justify-center rounded-lg cursor-pointer items-center hover:bg-gray-200"
                        >
                          {star < item.star ? (
                            <StarIcon size={32} className="text-orange-500" />
                          ) : (
                            <StarIcon size={32} className="text-orange-500" fill="#f97316" />
                          )}
                          <span>{item.txt}</span>
                        </span>
                      ))}
                    </div>
                    <div className="grid place-content-center w-full">
                      <Button onClick={handleRatingPost}>Đánh giá</Button>
                    </div>
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </ConditionRender>
        </div>
      </div>
    </div>
  )
}

export default Rating
Rating.propTypes = {
  averageStar: PropTypes.number,
  idPost: PropTypes.number.isRequired,
  onMutate: PropTypes.func.isRequired,
  voters: PropTypes.array.isRequired,
}

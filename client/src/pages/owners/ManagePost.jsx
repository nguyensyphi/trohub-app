import { useCallback, useEffect, useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Pagination } from "@/components/paginations"
import { createSearchParams, useLocation, useNavigate, useSearchParams } from "react-router-dom"
import useDebounce from "@/hooks/useDebounce"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { apiRemovePostByUser, useGetUserPost } from "@/apis/post"
import Section from "@/components/Section"
import PostCard from "@/components/layouts/PostCard"
import classnames from "@/lib/classnames"
import CustomDropmenuCheckbox from "@/components/searchs/CustomDropmenuCheckbox"
import { expiredStatusArr, postTypes, roomStatuses, sortBy, statusArr } from "@/lib/constant"
import { UpdatePost } from "@/components/layouts"

const options = {
  revalidateOnFocus: true, // Không re-fetch khi mất focus
  revalidateOnReconnect: true, // Không re-fetch khi reconnect mạng
  revalidateIfStale: true, // Không re-fetch nếu dữ liệu cũ
  shouldRetryOnError: true, // Chỉ re-fetch khi có lỗi
  revalidateOnMount: true, // Chỉ gọi API lần đầu khi component mount
}

const MagagePost = () => {
  const [cards, setCards] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [titleTerm, setTitleTerm] = useState("")
  const [propertyTypes, setPropertyTypes] = useState([])
  const [roomStatus, setRoomStatus] = useState([])
  const [statuses, setStatuses] = useState([])
  const [sort, setSort] = useState("createdAt,desc")
  const [editPost, setEditPost] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [expiredStatus, setExpiredStatus] = useState("Tất cả")

  // Fetch posts
  const { data, mutate } = useGetUserPost(searchParams, options)

  const debounceTitleTerm = useDebounce(titleTerm, 800)

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams.toString())

    // Set limit and title
    newParams.set("limit", "6")
    newParams.set("page", "1")
    if (debounceTitleTerm) newParams.set("title", debounceTitleTerm)
    else newParams.delete("title")

    // Set propertyTypes
    if (propertyTypes.length > 0) {
      newParams.delete("postType")
      propertyTypes.forEach((el) => {
        newParams.append("postType", el.value)
      })
    } else {
      newParams.delete("postType")
    }
    // Set status
    if (statuses.length > 0) {
      newParams.delete("status")
      statuses.forEach((el) => {
        newParams.append("status", el.value)
      })
    } else {
      newParams.delete("status")
    }

    // Set roomStatus
    if (statuses.length > 0) {
      newParams.delete("roomStatus")
      statuses.forEach((el) => {
        newParams.append("roomStatus", el.value)
      })
    } else {
      newParams.delete("roomStatus")
    }

    // Set sort
    if (sort) {
      const orderOffset = sort.split(",")
      newParams.set("sort", orderOffset[0])
      newParams.set("order", orderOffset[1])
    } else {
      newParams.delete("sort")
      newParams.delete("order")
    }

    // Cập nhật searchParams và gọi API
    setSearchParams(newParams)
    navigate({
      pathname: location.pathname,
      search: newParams.toString(),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceTitleTerm, propertyTypes, location.pathname, statuses, sort])

  // Set values cho cards
  useEffect(() => {
    const cardsLength = data?.posts?.length || 0
    if (cardsLength > 0) {
      const cardsFormat = data?.posts.map((el) => ({
        idPost: el.postId,
        label: `card-${el.id}`,
        isChecked: false,
      }))
      setCards(cardsFormat)
    }
  }, [data?.posts])

  // Chọn tất cả
  const handleSelectAll = () => {
    const newStateChecked = !selectAll
    setSelectAll(newStateChecked)
    const updateCards = cards.map((el) => ({ ...el, isChecked: newStateChecked }))
    setCards(updateCards)
  }

  // Chọn 1 card
  const handleCheckCard = (idCard) => {
    const updateCards = cards.map((el) => {
      if (el.idPost === idCard) {
        return { ...el, isChecked: !el.isChecked }
      } else return el
    })
    setCards(updateCards)
  }

  // Cập nhật search params khi thay đổi loại BĐS
  const handleOnChangePropertyType = (option) => {
    const hasOption = propertyTypes.some((el) => el.value === option.value)
    if (hasOption) setPropertyTypes((prev) => prev.filter((el) => el.value !== option.value))
    else setPropertyTypes((prev) => [...prev, option])
  }

  // Cập nhật search params khi thay đổi trạng thái
  const handleOnChangeStatus = (option) => {
    const hasOption = statuses.some((el) => el.value === option.value)
    if (hasOption) setStatuses((prev) => prev.filter((el) => el.value !== option.value))
    else setStatuses((prev) => [...prev, option])
  }

  const handleOnChangeRoomStatus = (option) => {
    const hasOption = statuses.some((el) => el.value === option.value)
    if (hasOption) setRoomStatus((prev) => prev.filter((el) => el.value !== option.value))
    else setRoomStatus((prev) => [...prev, option])
  }

  // Kiểm tra xem trên url có đang search params nào không?
  const handleCheckSearchParams = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("page")
    params.delete("limit")
    params.delete("order")
    params.delete("sort")

    return Object.keys([...params]).length !== 0
  }

  // Reset params
  const handleResetQuery = () => {
    setTitleTerm("")
    setPropertyTypes([])
    setStatuses([])
    setRoomStatus([])
    setSort("createdAt,desc")
    navigate({
      pathname: location.pathname,
      search: createSearchParams({ limit: 6, page: 1 }).toString(),
    })
  }

  const removePosts = async () => {
    const selectedPostIds = cards.filter((el) => !!el.isChecked).map((el) => el.idPost)
    const response = await apiRemovePostByUser({ postIds: selectedPostIds })
    if (response.data.success) {
      toast.success(response.data.msg)
      if (selectAll) handleResetQuery()
      setSelectAll(false)
      refresh()
    } else toast.error(response.data.msg)
  }

  const checkSelectedCards = () => {
    return cards.reduce((sum, el) => sum + (el.isChecked ? 1 : 0), 0)
  }

  const refresh = useCallback(async () => {
    await mutate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={cn("space-y-4 p-4")}>
      <Section title="Quản lý tin đăng của bạn">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Checkbox checked={selectAll} id="terms" onCheckedChange={handleSelectAll} />
              <label htmlFor="terms" className="text-sm font-medium leading-none">
                Chọn tất cả
              </label>
            </div>
            {checkSelectedCards() > 0 && (
              <Button
                onClick={removePosts}
                variant="filled"
                size="sm"
              >{`Xóa ${checkSelectedCards()} tin`}</Button>
            )}
            <Input
              placeholder="Tìm kiếm tin đăng"
              value={titleTerm}
              onChange={(e) => setTitleTerm(e.target.value)}
              className='"border placeholder:text-slate-300 px-3 rounded-md h-8 w-fit'
            />
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm font-medium leading-none">
                Sắp xếp:
              </label>
              <Select defaultValue="createdAt,desc" value={sort} onValueChange={setSort}>
                <SelectTrigger className={cn("w-[150px] h-8", classnames.resetOutline)}>
                  <SelectValue placeholder="Mới nhất" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {sortBy.map((el) => (
                      <SelectItem key={el.value} value={el.value}>
                        {el.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <CustomDropmenuCheckbox
              label="Loại tin đăng"
              values={propertyTypes}
              onChangeValues={handleOnChangePropertyType}
              options={postTypes}
              limit={1}
            />
            <CustomDropmenuCheckbox
              label="Trạng thái tin đăng"
              values={statuses}
              onChangeValues={handleOnChangeStatus}
              options={statusArr}
            />
            <CustomDropmenuCheckbox
              label="Trạng thái phòng"
              values={roomStatus}
              onChangeValues={handleOnChangeRoomStatus}
              options={roomStatuses}
            />
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm font-medium leading-none">
                Tin đăng:
              </label>
              <Select defaultValue="createdAt,desc" value={expiredStatus} onValueChange={setExpiredStatus}>
                <SelectTrigger className={cn("w-[150px] h-8", classnames.resetOutline)}>
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {expiredStatusArr.map((el) => (
                      <SelectItem key={el.value} value={el.value}>
                        {el.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {handleCheckSearchParams() && (
              <Button onClick={handleResetQuery} className="h-8" size="sm">
                <X size={14} />
                Reset
              </Button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {data?.posts &&
            data.posts?.length > 0 &&
            data.posts.map((el, idx) => (
              <PostCard
                key={el.id}
                media={el.media}
                title={el.title}
                price={+el.price}
                size={+el.size}
                createdAt={el.createdAt}
                address={el.address}
                checked={cards.length > 0 ? cards[idx]?.isChecked : false}
                onCheckedChange={handleCheckCard}
                verified={el.verified}
                status={el.status}
                roomStatus={el.roomStatus}
                expiredDate={el.expiredDate}
                isUpdating={editPost?.id === el.id}
                post={el}
                setEditPost={setEditPost}
                refresh={refresh}
                isManage={true}
                gender={el.gender}
              />
            ))}
        </div>
        {data?.pagination && <Pagination {...data.pagination} />}
      </Section>
      {editPost && (
        <Section title={`Cập nhật tin đăng #${editPost.id}`}>
          <UpdatePost mutate={mutate} setEditPost={setEditPost} post={editPost} />
        </Section>
      )}
    </div>
  )
}

export default MagagePost

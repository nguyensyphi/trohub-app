import { apiDeleteNews, useGetNewsAdmin } from "@/apis/news"
import Image from "@/components/layouts/Image"
import { Pagination } from "@/components/paginations"
import Section from "@/components/Section"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import useDebounce from "@/hooks/useDebounce"
import classnames from "@/lib/classnames"
import { sortBy } from "@/lib/constant"
import { cn } from "@/lib/utils"
import DOMPurify from "dompurify"
import { Ban, Edit, EllipsisVertical, Trash2, X } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { createSearchParams, useLocation, useNavigate, useSearchParams } from "react-router-dom"
import UpdateNews from "./UpdateNews"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

const ManageNews = () => {
  const [cards, setCards] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [titleTerm, setTitleTerm] = useState("")
  const [sort, setSort] = useState("createdAt,desc")
  const [editNews, setEditNews] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { data, mutate } = useGetNewsAdmin(searchParams)

  const debounceTitleTerm = useDebounce(titleTerm, 800)

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams.toString())

    // Set limit and title
    newParams.set("limit", "6")
    newParams.set("page", "1")
    if (debounceTitleTerm) newParams.set("title", debounceTitleTerm)
    else newParams.delete("title")

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
  }, [debounceTitleTerm, location.pathname, sort])

  const handleCheckSearchParams = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("page")
    params.delete("limit")
    params.delete("order")
    params.delete("sort")

    return Object.keys([...params]).length !== 0
  }

  useEffect(() => {
    const cardsLength = data?.news?.length || 0
    if (cardsLength > 0) {
      const cardsFormat = data?.news.map((el) => ({
        idNews: el.id,
        label: `card-${el.id}`,
        isChecked: false,
      }))
      setCards(cardsFormat)
    }
  }, [data?.news])

  // Reset params
  const handleResetQuery = () => {
    setTitleTerm("")
    setSort("createdAt,desc")
    navigate({
      pathname: location.pathname,
      search: createSearchParams({ limit: 6, page: 1 }).toString(),
    })
  }

  const removePosts = async () => {
    const selectedNewsIds = cards.filter((el) => !!el.isChecked).map((el) => el.idNews)
    const response = await apiDeleteNews({ idNews: selectedNewsIds })
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

  const handleSelectAll = () => {
    const newStateChecked = !selectAll
    setSelectAll(newStateChecked)
    const updateCards = cards.map((el) => ({ ...el, isChecked: newStateChecked }))
    setCards(updateCards)
  }

  const handleCheckCard = (idCard) => {
    const updateCards = cards.map((el) => {
      if (el.idNews === idCard) {
        return { ...el, isChecked: !el.isChecked }
      } else return el
    })
    setCards(updateCards)
  }

  const handleRemoveCard = async (id) => {
    const response = await apiDeleteNews({ idNews: id })
    if (response.data.success) {
      toast.success(response.data.msg)
      refresh()
    } else toast.error(response.data.msg)
  }

  const refresh = useCallback(async () => {
    await mutate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={cn("space-y-4 p-4")}>
      <Section title="Quản lý tin tức">
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
              placeholder="Tìm kiếm tin tức"
              value={titleTerm}
              onChange={(e) => setTitleTerm(e.target.value)}
              className='"border placeholder:text-slate-300 px-3 rounded-md h-8 w-fit'
            />

            {handleCheckSearchParams() && (
              <Button onClick={handleResetQuery} className="h-8" size="sm">
                <X size={14} />
                Reset
              </Button>
            )}
          </div>
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
        </div>
        <div className="grid grid-cols-3 gap-4">
          {data?.news &&
            data.news?.length > 0 &&
            data.news.map((el, idx) => (
              <div className="border rounded-md" key={el.id}>
                <div className="w-full h-[175px] rounded-t-md flex-none overflow-hidden relative">
                  <Image
                    className="w-full h-full rounded-t-md object-cover"
                    src={el.avatar}
                    fallbackSrc="/imagenotfound.png"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 group text-slate-50 to-transparent">
                    <Checkbox
                      checked={cards.length > 0 ? cards[idx]?.isChecked : false}
                      onCheckedChange={() => handleCheckCard(el.id)}
                      className={cn(
                        "absolute bottom-3 border-slate-50 left-3 group-hover:block hidden",
                        cards[idx]?.isChecked && "block border-blue-600"
                      )}
                    />
                  </div>
                </div>
                <div className="p-4 w-full relative">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="w-fit absolute top-4 right-1 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-fit bg-transparent text-slate-900 hover:text-blue-600 hover:bg-transparent">
                        <EllipsisVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-40">
                      <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        {editNews?.id !== el.id && (
                          <DropdownMenuItem
                            onClick={() => {
                              setEditNews(el)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Chỉnh sửa</span>
                          </DropdownMenuItem>
                        )}
                        {editNews?.id === el.id && (
                          <DropdownMenuItem
                            onClick={() => {
                              setEditNews(null)
                            }}
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            <span>Hủy chỉnh sửa</span>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => {
                            handleRemoveCard(el.id)
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Xóa tin</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <p className="font-bold mb-3 line-clamp-1">{el.title}</p>
                  <p
                    className="text-sm text-slate-600 line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(el.content) }}
                  ></p>
                </div>
              </div>
            ))}
        </div>
        {data?.pagination && <Pagination {...data.pagination} />}
      </Section>
      {editNews && (
        <Section title={`Cập nhật tin đăng #${editNews.id}`}>
          <UpdateNews refresh={refresh} setEditNews={setEditNews} news={editNews} />
        </Section>
      )}
    </div>
  )
}

export default ManageNews

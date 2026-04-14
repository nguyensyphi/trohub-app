import { useGetPublicPosts } from "@/apis/post"
import { useEffect } from "react"
import { createSearchParams, useLocation, useNavigate, useSearchParams } from "react-router-dom"
import PostCard from "./PostCard"
import { Pagination } from "../paginations"
import { useSearchStore } from "@/zustand/useSearchStore"
import PropTypes from "prop-types"

const options = {
  revalidateOnFocus: false, // Không re-fetch khi mất focus
  revalidateOnReconnect: true, // Không re-fetch khi reconnect mạng
  revalidateIfStale: true, // Không re-fetch nếu dữ liệu cũ
  shouldRetryOnError: true, // Chỉ re-fetch khi có lỗi
  revalidateOnMount: true, // Chỉ gọi API lần đầu khi component mount
}

const List = ({ setAddressArr, postType }) => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { currentSearchParams, setCurrentSearchParams, resetSearchStore } = useSearchStore()
  // const data = { data: [], status: 0 }
  const { data } = useGetPublicPosts(searchParams, options)

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams.toString())

    // Set limit and title
    newParams.set("limit", "4")
    newParams.set("page", "1")

    // postType
    if (postType) newParams.set("postType", postType)

    navigate({
      pathname: location.pathname,
      search: newParams.toString(),
      replace: true,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  // Xóa thẻ "Tìm kiếm"
  useEffect(() => {
    const params = Object.fromEntries([...searchParams])
    if (!params.price) setCurrentSearchParams({ type: "price" })
    if (!params.size) setCurrentSearchParams({ type: "size" })

    window.scrollTo(0, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, location.pathname])

  // Lấy địa chỉ từ các bài posts
  useEffect(() => {
    if (data?.posts && data.posts?.length > 0 && setAddressArr) {
      const newAddressArr = new Set(data.posts.map((el) => el.address))
      setAddressArr([...newAddressArr.values()])
    } else {
      if (setAddressArr) setAddressArr([])
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.posts])

  const resetSearch = () => {
    resetSearchStore()
    navigate({
      pathname: location.pathname,
      search: createSearchParams({
        page: "1",
        limit: "5",
      }).toString(),
    })
  }

  return (
    <section className="th-list-shell p-4 rounded-md h-full space-y-6">
      <header className="flex items-center justify-between gap-6">
        <h1 className="text-2xl font-bold">{`Danh sách ${postType?.toLowerCase() ?? "phòng trọ"}`}</h1>
      </header>
      {currentSearchParams.length > 0 && (
        <aside className="th-filter-chipbar flex items-center gap-3" aria-label="Bộ lọc đang áp dụng">
          <p className="text-xs">Tìm kiếm:</p>
          <div className="flex items-center flex-wrap gap-3">
            {currentSearchParams.map((el, idx) => (
              <span className="py-1 px-2 text-xs rounded-lg bg-background text-primary font-bold" key={idx}>
                {el.label}
              </span>
            ))}
            <span
              onClick={resetSearch}
              className="py-1 px-2 text-xs bg-primary cursor-pointer rounded-lg text-secondary font-bold"
            >
              Reset
            </span>
          </div>
        </aside>
      )}
      <article className="th-list-grid grid grid-cols-1 gap-4">
        {data?.posts && data.posts?.length > 0 ? (
          data.posts.map((el) => (
            <PostCard
              key={el.id}
              postId={el.postId}
              media={el.media}
              title={el.title}
              price={+el.price}
              bathroom={+el.bathroom}
              bedroom={+el.bedroom}
              size={+el.size}
              createdAt={el.createdAt}
              gender={el.gender}
              address={el.address}
              verified={el.verified}
              roomStatus={el.roomStatus}
              expiredDate={el.expiredDate}
              post={el}
            />
          ))
        ) : (
          <p className="text-sm">Không có dữ liệu phù hợp...</p>
        )}
      </article>
      {data?.pagination && <Pagination {...data.pagination} />}
    </section>
  )
}

export default List

List.propTypes = {
  setLocations: PropTypes.func,
  setAddressArr: PropTypes.func,
  postType: PropTypes.string,
}

import { apiGetNewsById } from "@/apis/news"
import Image from "@/components/layouts/Image"
import DOMPurify from "dompurify"
import moment from "moment"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const DetailNews = () => {
  const { id } = useParams()
  const [news, setNews] = useState(null)

  useEffect(() => {
    const fetchNews = async () => {
      const response = await apiGetNewsById(id)
      if (response.data.success) setNews(response.data.news)
    }
    if (id) fetchNews()
  }, [id])
  return (
    <>
      {news && (
        <div className="w-main h-full m-auto py-6 space-y-4">
          <Image
            src={news.avatar}
            fallbackSrc="/imagenotfound.png"
            className="w-full h-[200px] object-cover"
          />
          <h1 className="font-bold text-3xl">{news.title}</h1>
          <div className="text-sm">
            <p>
              Đăng bởi: <span>{news.postedBy?.fullname}</span>
            </p>
            <p>
              Ngày cập nhật: <span>{moment(news.updatedAt).format("DD/MM/YYYY")}</span>
            </p>
          </div>
          <div
            className="leading-8 text-justify content-news"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(news.content) }}
          ></div>
        </div>
      )}
    </>
  )
}

export default DetailNews

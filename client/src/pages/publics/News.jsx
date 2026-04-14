import { useGetNewsPublic } from "@/apis/news"
import Image from "@/components/layouts/Image"
import pathnames from "@/lib/pathnames"
import DOMPurify from "dompurify"
import { Link } from "react-router-dom"

const News = () => {
  const { data } = useGetNewsPublic()
  return (
    <div className="w-main m-auto space-y-6 px-4 py-6">
      <h1 className="font-bold text-2xl">Tin tức</h1>
      <div className="grid grid-cols-3 gap-4">
        {data?.news &&
          data.news?.map((el) => (
            <div className="border rounded-md" key={el.id}>
              <div className="w-full h-[175px] rounded-t-md flex-none overflow-hidden relative">
                <Image
                  className="w-full h-full rounded-t-md object-cover"
                  src={el.avatar}
                  fallbackSrc="/imagenotfound.png"
                />
              </div>
              <div className="p-4 relative">
                <Link
                  to={"/" + pathnames.publics.detailNews + el.id}
                  className="font-bold hover:underline mb-3 line-clamp-1"
                >
                  {el.title}
                </Link>
                <p
                  className="text-sm text-slate-600 line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(el.content) }}
                ></p>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default News

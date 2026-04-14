import { useGetPostById } from "@/apis/post"
import Slider from "@/components/layouts/Slider"
import { cn, defaultAvatar, fromNow, shortNumber } from "@/lib/utils"
import { EyeIcon, History, LandPlot, Mail, MapPin, PhoneCallIcon, Wallet } from "lucide-react"
import { useParams } from "react-router-dom"
import DOMPurify from "dompurify"
import PropTypes from "prop-types"
import { useCallback, useEffect, useState } from "react"
import { apiGetLocationsFromSearchTerm } from "@/apis/external"
import { MapContainer } from "@/components/maps"
import Rating from "@/components/ratings/Rating"
import Image from "@/components/layouts/Image"
import { Comments } from "@/components/comments"

const PostAttribute = ({ name = "", value = "", className = "", isLast = false }) => (
  <div
    className={cn(
      "grid grid-cols-10 border border-b-0 border-primary",
      // isFirst && "border-b",
      isLast && "border-b"
    )}
  >
    <p className="col-span-3 flex items-center px-6 py-4 border-r border-primary">{name}</p>
    <p className={cn("col-span-7 flex items-center px-6 py-4", className)}>{value}</p>
  </div>
)

const DetailPost = () => {
  const { idPost } = useParams()
  const [locations, setLocations] = useState([])
  const { data, mutate } = useGetPostById(idPost)
  useEffect(() => {
    const fetchLocations = async () => {
      const response = await apiGetLocationsFromSearchTerm(data?.postData?.address)
      if (response.status === 200) {
        if (response.data?.length > 0) {
          const dataFormat = response.data?.map((el) => ({
            longitude: +el.lon,
            latitude: +el.lat,
            displayName: el.display_name,
          }))
          setLocations(dataFormat)
        } else {
          const addressShort = data?.postData?.address
            ?.split(",")
            .filter((_, idx) => idx > 0)
            .join(",")
          const res = await apiGetLocationsFromSearchTerm(addressShort)
          if (res.status === 200) {
            const dataFormat = res.data?.map((el) => ({
              longitude: +el.lon,
              latitude: +el.lat,
              displayName: el.display_name,
            }))
            setLocations(dataFormat)
          }
        }
      }
    }
    if (data?.postData?.address) fetchLocations()
  }, [data?.postData?.address])

  const onMutate = useCallback(() => {
    mutate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCheckStatus = (status) => {
    if (status === "Còn phòng") return "text-green-600"
    if (status === "Đã thuê") return "text-red-600"
    return ""
  }
  if (!data || !data.postData) return <p className="p-4 text-center">Đang tải dữ liệu...</p>
  return (
    <main className="w-main max-w-full m-auto p-4 pb-[150px] space-y-4" data-testid="detail-post-page">
      <Slider media={data.postData?.media} />
      <div className="grid grid-cols-10 text-base gap-4">
        <div className="col-span-7 space-y-4">
          <h1 className="text-2xl font-bold text-primary" data-testid="detail-post-title">
            {data.postData?.title}
          </h1>
          <p className="flex items-center gap-2">
            <MapPin size={16} />
            <span>{data.postData?.address}</span>
          </p>
          <div className="flex items-center gap-6">
            <p className="flex items-center gap-2">
              <Wallet size={16} />
              <span className="text-lg text-red-600 font-bold">{shortNumber(data.postData?.price)}</span>
            </p>
            <p className="flex items-center gap-2">
              <LandPlot size={18} />
              <span>{data.postData?.size + " m²"}</span>
            </p>
            <p className="flex items-center gap-2">
              <History size={16} />
              <span>{fromNow(data.postData?.createdAt)}</span>
            </p>
            <p className="flex items-center gap-2">
              <EyeIcon size={16} />
              <span>{data.postData?.views}</span>
            </p>
          </div>
          <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.postData?.description) }}></p>
          <div>
            <p className="font-bold mb-3">Đặc điểm phòng trọ</p>
            <PostAttribute name="Số phòng ngủ" value={data.postData?.bedroom} />
            <PostAttribute name="Số phòng tắm" value={data.postData?.bathroom} />
            <PostAttribute name="Tỉnh / Thành phố" value={data.postData?.province} />
            <PostAttribute name="Quận / Huyện" value={data.postData?.district} />
            <PostAttribute name="Phường / Xã" value={data.postData?.ward} />
            <PostAttribute name="Đối tượng ưu tiên" value={data.postData?.gender} />
            <PostAttribute
              className={handleCheckStatus(data.postData?.status)}
              name="Trạng thái tin đăng"
              value={data.postData?.status}
            />
            <PostAttribute
              className={handleCheckStatus(data.postData?.status)}
              name="Trạng thái phòng"
              value={data.postData?.roomStatus}
            />
            <PostAttribute isLast={true} name="Số lượt xem" value={data.postData?.views} />
          </div>
          <div>
            <p className="font-bold mb-3">Tìm trên bản đồ</p>
            {locations && locations.length > 0 ? (
              <div className="w-full h-[350px]">
                <MapContainer locations={locations} zoom={13} />
              </div>
            ) : (
              <div className="w-full grid place-content-center bg-slate-100 rounded-md h-[350px]">
                <p>Đang tải bản đồ...</p>
              </div>
            )}
          </div>
          <Rating
            onMutate={onMutate}
            voters={data.voters}
            idPost={data.postData?.id}
            averageStar={data.postData?.averageStar}
          />
          <Comments comments={data.comments} onMutate={onMutate} />
        </div>
        <div className="col-span-3">
          <div className="w-full bg-slate-100 p-4 border flex-col gap-3 rounded-md flex items-center justify-center">
            <Image
              src={data.postData?.postedBy?.avatar}
              alt="Avatar"
              className="w-24 h-24 object-cover rounded-full"
              fallbackSrc={defaultAvatar(data.postData?.postedBy?.fullname)}
            />
            <p className="font-bold text-lg">{data.postData?.postedBy?.fullname}</p>
            <a
              className="w-full max-w-[220px] text-sm h-10 flex items-center justify-center rounded-md border gap-2 hover:bg-primary/90 px-2 py-2 text-slate-50 bg-primary"
              href={`mailto:${data.postData?.postedBy?.email}`}
              data-testid="detail-contact-mail"
            >
              <Mail size={16} />
              <span>Liên hệ mail</span>
            </a>
            <a
              className="w-full max-w-[220px] text-sm h-10 flex items-center justify-center rounded-md border border-primary gap-2 hover:bg-slate-50 px-2 py-2 text-primary"
              href={`tel:${data.postData?.postedBy?.phone}`}
              data-testid="detail-contact-phone"
            >
              <PhoneCallIcon size={16} />
              <span>Liên hệ SĐT</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}

export default DetailPost
PostAttribute.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  className: PropTypes.string,
  isLast: PropTypes.bool,
}

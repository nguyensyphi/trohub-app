import { useGetWishlist } from "@/apis/user"
import PostCard from "@/components/layouts/PostCard"
import Section from "@/components/Section"
import { cn } from "@/lib/utils"

const Wishlist = () => {
  const { data } = useGetWishlist()

  return (
    <div className={cn("space-y-4 h-full p-4")}>
      <Section title="Tin đăng yêu thích">
        <div className="grid grid-cols-2 gap-4">
          {data?.wls?.map((el) => (
            <PostCard
              key={el.id}
              media={el.rPost?.media}
              title={el.rPost?.title}
              price={+el.rPost?.price}
              size={+el.rPost?.size}
              createdAt={el.rPost?.createdAt}
              address={el.rPost?.address}
              verified={el.rPost?.verified}
              status={el.rPost?.status}
              expiredDate={el.rPost?.expiredDate}
              post={el.rPost}
              isManage={true}
              gender={el.rPost?.gender}
            />
          ))}
        </div>
      </Section>
    </div>
  )
}

export default Wishlist

import { StarHalf, Star as StarIcon } from "lucide-react"
import PropTypes from "prop-types"
import { memo } from "react"

const Star = ({ starNumber = 0 }) => {
  const fullStars = Math.floor(starNumber) // Số sao đầy
  const hasHalfStar = starNumber % 1 !== 0 // Kiểm tra có nửa sao hay không
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0) // Số sao rỗng

  return (
    <div className="flex space-x-1">
      {/* Render sao đầy */}
      {[...Array(fullStars)].map((_, index) => (
        <StarIcon key={index} className="w-6 h-6 text-orange-500" fill="#f97316" />
      ))}
      {/* Render nửa sao nếu có */}
      {hasHalfStar && (
        <div className="relative w-6 h-6">
          <StarIcon className="w-6 h-6 text-orange-500" />
          <StarHalf className="w-6 absolute inset-0 h-6 text-orange-500" fill="#f97316" />
          {/* <div className="absolute top-0 right-0 w-3 h-full bg-white"></div> */}
        </div>
      )}
      {/* Render sao rỗng */}
      {[...Array(emptyStars)].map((_, index) => (
        <StarIcon key={index} className="text-orange-500 w-6 h-6" />
      ))}
    </div>
  )
}

export default memo(Star)
Star.propTypes = {
  starNumber: PropTypes.number,
}

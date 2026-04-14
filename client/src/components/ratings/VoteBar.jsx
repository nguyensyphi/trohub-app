import { Star } from "lucide-react"
import { memo, useEffect, useRef } from "react"
import PropTypes from "prop-types"

const Votebar = ({ star = 0, percent, voter = 0 }) => {
  const votebar = useRef()
  useEffect(() => {
    votebar.current.style.right = `${100 - percent}%`
  }, [percent])
  return (
    <div className="flex w-full items-center gap-1 my-2 text-xs text-gray-600">
      <div className="flex items-center gap-1 justify-center flex-none w-8">
        <span className="text-sm font-bold">{star}</span>
        <Star className="text-orange-600" size={16} />
      </div>
      <div className="h-[8px] flex-auto bg-gray-300 rounded-l-full rounded-r-full relative">
        <div
          ref={votebar}
          className="absolute top-0 bottom-0 left-0 bg-primary rounded-l-full rounded-r-full"
        ></div>
      </div>
      <span className="text-xs text-primary/70">{`${voter} đánh giá`}</span>
    </div>
  )
}

export default memo(Votebar)
Votebar.propTypes = {
  star: PropTypes.number,
  percent: PropTypes.number.isRequired,
  voter: PropTypes.number,
}

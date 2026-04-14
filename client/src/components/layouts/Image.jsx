import PropTypes from "prop-types"
import { useState } from "react"

const Image = ({ src, fallbackSrc, ...props }) => {
  const [imageUrl, setImageUrl] = useState(src)

  return <img onError={() => setImageUrl(fallbackSrc)} src={imageUrl} {...props} />
}

export default Image
Image.propTypes = {
  src: PropTypes.string.isRequired,
  fallbackSrc: PropTypes.string.isRequired,
}

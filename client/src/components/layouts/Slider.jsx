import PropTypes from "prop-types"
import { useMemo, useState } from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel"
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog"

const Slider = ({ media = [] }) => {
  const [previewMedia, setPreviewMedia] = useState(null)
  const isPreviewVideo = useMemo(() => /\.(mp4|webm|ogg)(\?.*)?$/i.test(previewMedia || ""), [previewMedia])

  const handleOpenPreview = (source) => {
    setPreviewMedia(source)
  }

  return (
    <div className="w-full flex bg-black items-center justify-center border border-input">
      <Carousel className="w-full md:w-3/5">
        <CarouselContent className="w-[calc(100%+16px)] pl-0">
          {media.map((el, idx) => (
            <CarouselItem className="h-full pl-0 m-auto" key={idx}>
              <button
                type="button"
                onClick={() => handleOpenPreview(el)}
                className="w-full h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Mở ảnh phòng lớn"
                data-testid={`detail-slider-item-${idx}`}
              >
                <img src={el} alt="Slider Image" className="h-[280px] md:h-[350px] w-full object-cover" />
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <Dialog open={!!previewMedia} onOpenChange={(isOpen) => !isOpen && setPreviewMedia(null)}>
        <DialogContent className="max-w-4xl p-2 bg-black border border-input" data-testid="detail-slider-dialog">
          <DialogTitle className="sr-only">Xem trước media phòng trọ</DialogTitle>
          {isPreviewVideo ? (
            <video src={previewMedia || ""} controls autoPlay className="w-full max-h-[80vh] object-contain" />
          ) : (
            <img src={previewMedia || ""} alt="Preview" className="w-full max-h-[80vh] object-contain" />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Slider
Slider.propTypes = {
  media: PropTypes.arrayOf(PropTypes.string).isRequired,
}

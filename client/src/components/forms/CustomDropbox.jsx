import PropTypes from "prop-types"
import { Button } from "../ui/button"
import { CircleX, Upload } from "lucide-react"
import { cn, handleClassifyMedia } from "@/lib/utils"

const CustomDropBox = ({ onSelect, isMultiple = false, media = [], onRemove, errors, className }) => {
  const convertDropboxLink = (link) => {
    return link
      .replace("www.dropbox.com", "dl.dropboxusercontent.com")
      .replace("?dl=0", "")
      .replace("&dl=0", "")
  }
  const handleDropboxChooser = () => {
    const options = {
      success: (files) => {
        const fileFormatted = files.map((el) => ({ ...el, link: convertDropboxLink(el.link) }))
        onSelect(fileFormatted)
      },
      cancel: () => {
        console.log("User canceled")
      },
      linkType: "preview", // hoặc "preview"
      multiselect: isMultiple,
      extensions: [".jpg", ".png", ".mp4"],
    }

    window.Dropbox.choose(options)
  }

  return (
    <div className="space-y-4">
      <Button
        type="button"
        onClick={handleDropboxChooser}
        className="h-8 rounded-md w-fit space-x-3"
        variant="outline"
      >
        <span>Tải media</span>
        <Upload size={16} />
      </Button>
      {media && media.length > 0 && (
        <div
          className={cn(
            "min-h-[300px] max-h-[500px] overflow-y-auto border border-slate-200 bg-slate-100 p-4 gap-4 grid grid-cols-3 rounded-md",
            className
          )}
        >
          {media.map((el) => (
            <div key={el} className="w-full aspect-[3/2] relative">
              {handleClassifyMedia(el) === "IMAGE" && (
                <img src={el} alt="Item" className="w-full h-full object-cover border border-blue-900/70" />
              )}
              {handleClassifyMedia(el) === "VIDEO" && (
                <video
                  controls
                  src={el}
                  alt="Item"
                  className="w-full h-full object-cover border border-blue-900/70"
                />
              )}
              <span
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  onRemove(el)
                }}
                className="absolute top-1 right-1 z-20 rounded-full bg-slate-200 block w-fit h-fit p-[2px] cursor-pointer"
              >
                <CircleX size={17} />
              </span>
            </div>
          ))}
        </div>
      )}
      {errors && errors.media && <p className="text-sm text-red-500">{errors.media.message}</p>}
    </div>
  )
}

export default CustomDropBox

CustomDropBox.propTypes = {
  onSelect: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  isMultiple: PropTypes.bool,
  media: PropTypes.arrayOf(PropTypes.string).isRequired,
  errors: PropTypes.object,
  className: PropTypes.string,
}

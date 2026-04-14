import { provincesArr, provinceTops } from "@/lib/constant"
import { X } from "lucide-react"
import PropTypes from "prop-types"

const SelectProvince = ({ onClose, memorizedSetAddress }) => {
  //   console.log(data)
  return (
    <aside
      className="absolute z-10 top-0 border border-slate-200 left-0 max-h-[500px] overflow-y-auto right-0 h-fit px-6 rounded-lg text-slate-900 bg-slate-50"
      data-testid="province-selector"
      aria-label="Chọn tỉnh thành"
    >
      <div className="flex items-center sticky top-0 py-6 bg-slate-50 z-10 justify-between border-b border-slate-200">
        <p className="font-semibold">Bạn muốn tìm phòng trọ ở tỉnh thành nào?</p>
        <span
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
          className="cursor-pointer text-slate-500 p-2"
        >
          <X size={16} />
        </span>
      </div>
      <div className="py-6 border-b border-slate-200">
        <div className="space-y-3">
          <p className="font-bold text-slate-500 text-sm">Các tỉnh thành nổi bật</p>
          <div className="flex items-center justify-around gap-4">
            {provinceTops.map((el) => (
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                    memorizedSetAddress({ text: el.name, provinceId: el.id })
                    onClose()
                  }}
                  key={el.id}
                  className="flex-1 group h-20 relative rounded-lg overflow-hidden aspect-[3/2]"
                  data-testid={`province-top-${el.id}`}
                >
                <img
                  src={el.path}
                  alt={el.name}
                  className="h-full group-hover:animate-scale-up-center w-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t p-2 flex rounded-lg items-end justify-center text-xs font-bold text-slate-50 from-slate-900/70 to-transparent">
                  {el.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="py-6">
        <div className="space-y-3">
          <p className="font-bold text-slate-500 text-sm">Tất cả tỉnh thành</p>
          <div className="grid grid-cols-6 gap-4">
            {provincesArr.map((el, idx) => (
              <p
                onClick={(e) => {
                  e.stopPropagation()
                  memorizedSetAddress({ text: el.name, provinceId: el.idProvince })
                  onClose()
                }}
                key={idx}
                className="text-xs hover:underline cursor-pointer hover:text-blue-600"
                data-testid={`province-option-${el.idProvince}`}
              >
                {el.name}
              </p>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}

export default SelectProvince

SelectProvince.propTypes = {
  onClose: PropTypes.func.isRequired,
  memorizedSetAddress: PropTypes.func.isRequired,
}

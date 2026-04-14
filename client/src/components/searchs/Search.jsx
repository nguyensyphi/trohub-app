import { SearchIcon } from "lucide-react"
import { Button } from "../ui/button"
import { useCallback, useState } from "react"
import SelectProvince from "./SelectProvince"
import PopoverRange from "./PopoverRange"
import { convenients, prices, sizes } from "@/lib/constant"
import PopoverCheckbox from "./PopoverCheckbox"
import { useNavigate, useSearchParams } from "react-router-dom"
import pathnames from "@/lib/pathnames"
import { toast } from "sonner"

const Search = () => {
  const [isShowProvinceOptions, setIsShowProvinceOptions] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [address, setAddress] = useState({
    text: "",
    provinceId: "",
  })

  const memorizedSetAddress = useCallback((value) => {
    setAddress(value)
  }, [])

  const handleSearch = () => {
    if (!address.text || !address.provinceId) return toast.info("Bạn phải chọn địa chỉ trước!")
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.set("address", address.text)
    newSearchParams.set("provinceId", address.provinceId)
    navigate({
      pathname: "/" + pathnames.publics.search,
      search: newSearchParams.toString(),
    })
  }

  return (
    <section className="space-y-4 text-sm p-4 bg-black/60 rounded-md" data-testid="homepage-search-box">
      <div
        onClick={() => setIsShowProvinceOptions(true)}
        className="w-full relative flex flex-col sm:flex-row sm:items-center justify-between bg-secondary gap-3 px-2 py-[6px] border border-input rounded-md"
        data-testid="homepage-search-address-trigger"
      >
        <p className="text-sm w-full sm:w-auto flex items-center cursor-pointer gap-2 font-semibold text-slate-900">
          <SearchIcon color="#222222" size={20} />
          <span className="line-clamp-1">{address.text || "Trên toàn quốc"}</span>
        </p>
        <Button
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            handleSearch()
          }}
          data-testid="homepage-search-submit"
          className="w-full sm:w-auto"
        >
          Tìm kiếm
        </Button>
        {isShowProvinceOptions && (
          <SelectProvince
            memorizedSetAddress={memorizedSetAddress}
            onClose={() => setIsShowProvinceOptions(false)}
          />
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <PopoverRange
          id="price"
          label="Mức giá"
          _id="_price"
          maxValue={15 * Math.pow(10, 6)}
          options={prices}
          exp={1000000}
          unit="đ"
          testIdPrefix="homepage-filter-price"
        />
        <PopoverRange
          id="size"
          label="Diện tích"
          _id="_size"
          unit="m²"
          maxValue={150}
          options={sizes}
          testIdPrefix="homepage-filter-size"
        />
        <PopoverCheckbox
          options={convenients.map((el) => ({ id: el, label: el }))}
          testIdPrefix="homepage-filter-convenient"
        />
      </div>
    </section>
  )
}

export default Search

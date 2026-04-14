import { CustomAddressV2, List } from "@/components/layouts"
import { MapContainer } from "@/components/maps"
import PopoverCheckbox from "@/components/searchs/PopoverCheckbox"
import PopoverRange from "@/components/searchs/PopoverRange"
import { Input } from "@/components/ui/input"
import { convenients, genders, prices, sizes } from "@/lib/constant"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

import { useLocation, useNavigate, useSearchParams } from "react-router-dom"

import { apiGetLocationsFromSearchTerm } from "@/apis/external"
import { MapPinX } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { SelectValue } from "@radix-ui/react-select"
import { Label } from "@/components/ui/label"
import useDebounce from "@/hooks/useDebounce"

const SearchLayout = () => {
  const [locations, setLocations] = useState([])
  const [addressArr, setAddressArr] = useState([])
  const [searchParams] = useSearchParams()
  const [bedroom, setBedroom] = useState("")
  const [bathroom, setBathroom] = useState("")
  const [gender, setGender] = useState("")
  const [title, setTitle] = useState("")
  const navigate = useNavigate()
  const location = useLocation()

  const address = searchParams.get("address")
  const debounceTitle = useDebounce(title, 800)

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString())

    if (gender) newSearchParams.set("gender", gender)
    else newSearchParams.delete("gender")

    if (debounceTitle) newSearchParams.set("title", debounceTitle)
    else newSearchParams.delete("title")

    if (bedroom) newSearchParams.set("bedroom", bedroom)
    else newSearchParams.delete("bedroom")

    if (bathroom) newSearchParams.set("bathroom", bathroom)
    else newSearchParams.delete("bathroom")

    navigate({
      pathname: location.pathname,
      search: newSearchParams.toString(),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gender, bedroom, bathroom, searchParams, location.pathname, debounceTitle])

  useEffect(() => {
    const fetchLocations = async () => {
      const promise = addressArr.map((el) => apiGetLocationsFromSearchTerm(el))
      const response = await Promise.all(promise)
      let newLocations = []
      response.forEach((el) => {
        if (el.status === 200) {
          const dataFormat = el.data
            ?.filter((_, idx) => idx === 0)
            ?.map((i) => ({
              longitude: +i.lon,
              latitude: +i.lat,
              displayName: i.display_name,
            }))
          newLocations = [...newLocations, ...dataFormat]
        }
      })
      setLocations(newLocations)
    }
    if (addressArr && addressArr.length > 0) fetchLocations()
    else setLocations([])
  }, [addressArr])

  // console.log(form.getValues())

  return (
    <main className="th-search-shell h-full space-y-4 p-4 md:p-6">
      <h1 className="text-lg font-bold" data-testid="search-page-title">{`Tìm kiếm ${address}`}</h1>
      <section
        className="th-filter-panel h-fit grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3 md:gap-4"
        aria-label="Bộ lọc tìm kiếm"
        data-testid="search-filter-panel"
      >
        <PopoverRange
          id="price"
          label="Mức giá"
          _id="_price"
          maxValue={15 * Math.pow(10, 6)}
          options={prices}
          exp={1000000}
          unit="đ"
          className="text-primary text-sm h-8"
          testIdPrefix="search-filter-price"
        />
        <PopoverRange
          id="size"
          label="Diện tích"
          _id="_size"
          unit="m²"
          maxValue={150}
          options={sizes}
          className="text-primary h-8"
          testIdPrefix="search-filter-size"
        />
        <PopoverCheckbox
          className="text-primary text-sm h-8"
          options={convenients.map((el) => ({ id: el, label: el }))}
          testIdPrefix="search-filter-convenient"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 col-span-1 xl:col-span-2 gap-3 md:gap-4">
          <div className="flex items-center gap-2">
            <Label>Đối tượng:</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="h-8" data-testid="search-filter-gender-trigger" aria-label="Chọn đối tượng">
                <SelectValue className="placeholder:text-sm placeholder:text-slate-500" placeholder="Chọn" />
              </SelectTrigger>
              <SelectContent>
                {genders.map((el) => (
                  <SelectItem value={el.value} key={el.value} data-testid={`search-filter-gender-option-${el.value}`}>
                    {el.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Label className="min-w-[70px]">Số phòng ngủ</Label>
            <Input
              type="number"
              value={bedroom}
              onChange={(e) => setBedroom(e.target.value)}
              placeholder="0"
              className="h-8"
              data-testid="search-filter-bedroom-input"
              aria-label="Số phòng ngủ"
            />
          </div>
          <div className="flex items-center gap-2">
            <Label className="min-w-[70px]">Số phòng tắm</Label>
            <Input
              type="number"
              value={bathroom}
              onChange={(e) => setBathroom(e.target.value)}
              placeholder="0"
              className="h-8"
              data-testid="search-filter-bathroom-input"
              aria-label="Số phòng tắm"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 col-span-1 md:col-span-2 xl:col-span-1">
          <Label className="min-w-[50px]">Tựa đề</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="VD: Phòng trọ abc..."
            className="h-8"
            data-testid="search-filter-title-input"
            aria-label="Tựa đề tin đăng"
          />
        </div>
        <CustomAddressV2 />
      </section>
      <section
        className={cn("th-search-result grid grid-cols-1 xl:grid-cols-2 gap-4 w-full", "h-auto")}
        data-testid="search-result-wrapper"
      >
        <article
          className={cn("th-result-list max-h-full h-full overflow-y-auto")}
          aria-label="Danh sách bài đăng"
          data-testid="search-result-list"
        >
          <List setAddressArr={setAddressArr} setLocations={setLocations} />
        </article>
        <aside
          className="th-map-panel w-full bg-secondary rounded-md"
          aria-label="Bản đồ vị trí"
          data-testid="search-map-panel"
        >
          {locations && locations.length > 0 ? (
            <section className="col-span-2 h-[320px] md:h-full">
              <MapContainer locations={locations} zoom={13} />
            </section>
          ) : (
            <p className="w-full h-full flex flex-col items-center justify-center gap-6 text-sm italic">
              <MapPinX size={96} color="gray" />
              <span>Không tìm thấy tọa độ bản đồ...</span>
            </p>
          )}
        </aside>
      </section>
    </main>
  )
}

export default SearchLayout

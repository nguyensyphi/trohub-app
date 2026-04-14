import { List, ListSelectOption } from "@/components/layouts"
import { Search } from "@/components/searchs"
import { prices, provinceTops, sizes } from "@/lib/constant"

const ChoThuePhongTro = () => {
  return (
    <div className="w-main m-auto space-y-6 py-6">
      <Search />
      <div className="grid grid-cols-10 gap-6">
        <div className="col-span-7">
          <List postType="Cho thuê phòng trọ" />
        </div>
        <div className="col-span-3 space-y-6">
          <ListSelectOption id="price" title="Xem theo giá" options={prices} />
          <ListSelectOption id="size" title="Xem theo diện tích" options={sizes} />
          <ListSelectOption
            title="Xem theo khu vực"
            id="address"
            options={provinceTops.map((el) => ({ id: +el.id, label: el.name, value: el.name }))}
          />
        </div>
      </div>
    </div>
  )
}

export default ChoThuePhongTro

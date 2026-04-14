import { List, ListSelectOption } from "@/components/layouts"
import { Search } from "@/components/searchs"
import { prices, provinceTops, sizes } from "@/lib/constant"

const Homepage = () => {
  return (
    <div className="w-main m-auto space-y-6 py-4 md:py-6">
      <Search />
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 lg:gap-6">
        <div className="col-span-1 lg:col-span-7">
          <List />
        </div>
        <aside className="col-span-1 lg:col-span-3 space-y-4 lg:space-y-6">
          <ListSelectOption id="price" title="Xem theo giá" options={prices} />
          <ListSelectOption id="size" title="Xem theo diện tích" options={sizes} />
          <ListSelectOption
            title="Xem theo khu vực"
            id="address"
            options={provinceTops.map((el) => ({ id: +el.id, label: el.name, value: el.name }))}
          />
        </aside>
      </div>
    </div>
  )
}

export default Homepage

import { useSearchStore } from "@/zustand/useSearchStore"
import PropTypes from "prop-types"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"

const ListSelectOption = ({ title, options = [], id }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { setCurrentSearchParams } = useSearchStore()

  const handleSearch = (value, label) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", 1)
    if (value) {
      params.set(id, value)
      setCurrentSearchParams({ type: id, value, isMultiple: false, label })
    } else params.delete(id)
    navigate({
      pathname: location.pathname,
      search: params.toString(),
    })
  }
  return (
    <div className="p-4 border w-full border-input rounded-md space-y-4">
      <h1 className="font-bold text-xl">{title}</h1>
      <div className="grid grid-cols-2 gap-4">
        {options.map((el) => (
          <p
            className="text-sm border-b border-dashed pb-1 cursor-pointer hover:text-blue-600 border-input"
            key={el.id}
            onClick={() => handleSearch(el.value, el.label)}
          >
            {el.label}
          </p>
        ))}
      </div>
    </div>
  )
}

export default ListSelectOption
ListSelectOption.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
      id: PropTypes.number,
    })
  ),
}

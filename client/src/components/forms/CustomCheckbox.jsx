import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import PropTypes from "prop-types"
import { BadgePlus } from "lucide-react"
import { cn } from "@/lib/utils"
import classnames from "@/lib/classnames"

const CustomCheckbox = ({ options = [], values = [], onChangeValues, label, limit = 2 }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          className={cn("border-input text-slate-900 min-w-[120px] w-fit", classnames.resetOutline)}
          variant="outline"
        >
          <BadgePlus color="blue" size={16} />
          <span>{label}</span>
          {values.length > 0 && (
            <p className="flex border-l pl-2 items-center gap-1 text-xs">
              {values.length <= limit &&
                values.map((el) => (
                  <span className="p-1 bg-slate-200 rounded-sm" key={el.value}>
                    {el.label}
                  </span>
                ))}
              {values.length > limit && (
                <span className="p-1 bg-slate-200 rounded-sm">{`${values.length} đã chọn`}</span>
              )}
            </p>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit">
        <DropdownMenuLabel>Lists</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((el) => (
          <DropdownMenuCheckboxItem
            key={el.value}
            checked={values.some((item) => item.value === el.value)}
            onCheckedChange={() => onChangeValues(el)}
          >
            {el.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default CustomCheckbox
CustomCheckbox.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
  values: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
  onChangeValues: PropTypes.func.isRequired,
  label: PropTypes.string,
  limit: PropTypes.number,
}

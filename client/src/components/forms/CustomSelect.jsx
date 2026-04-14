import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import PropTypes from "prop-types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

const CustomSelect = ({
  form,
  id,
  className,
  label,
  placeholder,
  options = [],
  isRequired = false,
  info = "",
}) => {
  return (
    <FormField
      control={form.control}
      name={id}
      render={({ field }) => (
        <FormItem className={cn("w-full", className)}>
          {label && (
            <FormLabel className="font-bold">
              {label}
              {isRequired && <span className="text-red-600 text-lg px-1">*</span>}
              {info}
            </FormLabel>
          )}
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger
                className={cn(
                  "text-slate-900 h-8 w-full focus:ring-0 outline-none focus:ring-offset-0",
                  !field.value && "text-slate-300"
                )}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            {options && options.length > 0 && (
              <SelectContent className="z-[1000]">
                {options.map((el, idx) => (
                  <SelectItem value={el.value} key={idx}>
                    {el.label}
                  </SelectItem>
                ))}
              </SelectContent>
            )}
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default CustomSelect
CustomSelect.propTypes = {
  form: PropTypes.shape({
    control: PropTypes.object.isRequired,
    watch: PropTypes.func.isRequired,
  }).isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  isRequired: PropTypes.bool,
  info: PropTypes.node,
}

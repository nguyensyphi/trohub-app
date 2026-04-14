import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import PropTypes from "prop-types"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const CustomInput = ({
  form,
  id,
  label,
  placeholder,
  className,
  isRequired = false,
  readOnly = false,
  type = "text",
  inputClassName,
  info,
}) => {
  return (
    <FormField
      name={id}
      control={form.control}
      render={({ field }) => (
        <FormItem className={cn("w-full", className)}>
          {label && (
            <FormLabel className="font-bold">
              {label}
              {isRequired && <span className="text-red-600 text-lg px-1">*</span>}
              {info}
            </FormLabel>
          )}
          <FormControl>
            <Input
              placeholder={placeholder}
              type={type}
              className={cn(
                "border placeholder:text-slate-300 px-3 rounded-md h-8",
                readOnly && "select-none cursor-not-allowed bg-slate-100",
                inputClassName
              )}
              {...field}
              readOnly={readOnly}
              value={field.value}
              onChange={(e) =>
                type === "number" ? field.onChange(e.target.valueAsNumber) : field.onChange(e.target.value)
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default CustomInput
CustomInput.propTypes = {
  form: PropTypes.shape({
    control: PropTypes.object.isRequired,
    watch: PropTypes.func.isRequired,
  }).isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  type: PropTypes.string,
  isRequired: PropTypes.bool,
  readOnly: PropTypes.bool,
  info: PropTypes.node,
}

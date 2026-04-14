import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MoveRight, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import PropTypes from "prop-types"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "../ui/slider"
import { cn, convertToPercent, convertToValue } from "@/lib/utils"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { useSearchStore } from "@/zustand/useSearchStore"

const PopoverRange = ({
  id,
  label,
  _id,
  options = [],
  maxValue = 0,
  exp = 1,
  unit = "",
  className = "",
  testIdPrefix,
}) => {
  const [isShowContent, setIsShowContent] = useState(false)
  const [width, setWidth] = useState(0)
  const parentSidebarRef = useRef()
  const { setCurrentSearchParams } = useSearchStore()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const form = useForm({
    defaultValues: {
      [id]: [0, 100],
      [_id]: "ALL",
      to: 0,
      from: 0,
    },
  })
  const val = form.watch(_id)
  const values = form.watch(id)
  const from = form.watch("from")
  const to = form.watch("to")

  // Thumb thay doi --> set lai from, to
  useEffect(() => {
    form.setValue("from", Number(convertToValue(values[0], maxValue, exp).toFixed()).toLocaleString())
    if (values[0] === values[1] && values[0] === 100) {
      form.setValue("to", "trở lên")
      form.setValue(_id, JSON.stringify(["gt", maxValue]))
    } else {
      form.setValue("to", Number(convertToValue(values[1], maxValue, exp).toFixed()).toLocaleString())
      if (values[0] === 0 && values[1] === 100) {
        form.setValue(_id, "ALL")
      } else {
        form.setValue(
          _id,
          JSON.stringify([convertToValue(values[0], maxValue, exp), convertToValue(values[1], maxValue, exp)])
        )
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, maxValue, id])

  useEffect(() => {
    const width = parentSidebarRef.current?.getBoundingClientRect().width
    if (width) {
      setWidth(width)
    }
  }, [])

  const handleSubmitSearch = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    const data = form.getValues()
    console.log(data)
    if (data[_id] && data[_id] !== "ALL") {
      newSearchParams.set(id, data[_id])
      setCurrentSearchParams({
        type: id,
        value: data[_id],
        isMultiple: false,
        label: `Từ ${from} - ${to} ${unit}`,
      })
    } else {
      newSearchParams.delete(id)
    }
    setIsShowContent(false)

    navigate({
      pathname: location.pathname,
      search: newSearchParams.toString(),
    })
  }

  useEffect(() => {
    if (!val || val === "ALL") {
      return form.setValue(id, [0, 100])
    }

    const arrayValue = JSON.parse(val)

    if (arrayValue[0] === "lt") {
      return form.setValue(id, [0, convertToPercent(arrayValue[1], maxValue)])
    }

    if (arrayValue[0] === "gt") {
      return form.setValue(id, [convertToPercent(arrayValue[1], maxValue), 100])
    }

    form.setValue(id, [convertToPercent(arrayValue[0], maxValue), convertToPercent(arrayValue[1], maxValue)])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [val, _id, maxValue])
  return (
    <Popover open={isShowContent} onOpenChange={setIsShowContent}>
      <PopoverTrigger
        ref={parentSidebarRef}
        className={cn(
          "rounded-md px-2 py-[6px] w-full text-secondary text-sm font-semibold border border-input",
          className
        )}
        data-testid={`${testIdPrefix || `range-${id}`}-trigger`}
      >
        {label}
      </PopoverTrigger>
      <PopoverContent
        style={{ width: `${width}px` }}
        className="p-0 max-h-[400px] h-fit overflow-y-auto"
        data-testid={`${testIdPrefix || `range-${id}`}-content`}
      >
        <div className="p-4 border-b sticky top-0 bg-slate-50 z-10 border-slate-200 text-slate-900 flex items-center font-bold text-sm">
          <p className="flex-auto text-center">{label}</p>
          <span className="flex-none block">
            <X onClick={() => setIsShowContent(false)} size={14} color="#555555" />
          </span>
        </div>
        <div className="p-4 flex gap-3 items-center" data-testid={`${testIdPrefix || `range-${id}`}-inputs`}>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-bold">{label + " thấp nhất"}</p>
            <Input
              tabIndex={-1}
              value={from}
              className="px-2 py-[6px] h-fit"
              readOnly
              data-testid={`${testIdPrefix || `range-${id}`}-from`}
            />
          </div>
          <MoveRight size={16} className="-mb-4" />
          <div className="flex flex-col gap-1">
            <p className="text-xs font-bold">{label + " cao nhất"}</p>
            <Input
              tabIndex={-1}
              value={to}
              className="px-2 py-[6px] h-fit"
              readOnly
              data-testid={`${testIdPrefix || `range-${id}`}-to`}
            />
          </div>
        </div>
        <Form {...form}>
          <form className="space-y-6 p-4">
            <FormField
              name={id}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Slider
                      value={field.value}
                      onValueChange={(value) => form.setValue(id, value)}
                      min={0}
                      max={100}
                      step={1}
                      data-testid={`${testIdPrefix || `range-${id}`}-slider`}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={_id}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} value={field.value}>
                      {options.map((el) => (
                        <FormItem className="flex items-center justify-between" key={el.id}>
                          <FormLabel className="flex-auto">{el.label}</FormLabel>
                          <FormControl className="flex-none">
                            <RadioGroupItem value={el.value} />
                          </FormControl>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <div className="p-4 sticky bottom-0 border-t bg-slate-50 z-10 border-slate-200 text-slate-900 flex items-center font-bold justify-between text-sm">
          <div></div>
          <Button onClick={handleSubmitSearch} size="sm" data-testid={`${testIdPrefix || `range-${id}`}-apply`}>
            Áp dụng
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default PopoverRange

PopoverRange.propTypes = {
  id: PropTypes.string.isRequired,
  exp: PropTypes.number,
  label: PropTypes.string.isRequired,
  unit: PropTypes.string,
  _id: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
  maxValue: PropTypes.number.isRequired,
  className: PropTypes.string,
  testIdPrefix: PropTypes.string,
}

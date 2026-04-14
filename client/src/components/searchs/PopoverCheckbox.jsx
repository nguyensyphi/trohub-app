import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { X } from "lucide-react"
import PropTypes from "prop-types"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { useEffect, useRef, useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"

const PopoverCheckbox = ({ options = [], className, testIdPrefix = "checkbox-filter" }) => {
  const [isShowContent, setIsShowContent] = useState(false)
  const [width, setWidth] = useState(0)
  const [searchParams] = useSearchParams()
  const parentSidebarRef = useRef()
  const form = useForm({
    defaultValues: {
      convenient: [],
    },
  })
  const navigate = useNavigate()
  const location = useLocation()

  const convenient = form.watch("convenient")

  useEffect(() => {
    const width = parentSidebarRef.current?.getBoundingClientRect().width
    if (width) {
      setWidth(width)
    }
  }, [])

  const handleSubmit = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.delete("convenient")
    if (convenient.length > 0) {
      convenient.forEach((el) => {
        newSearchParams.append("convenient", el)
      })
    } else newSearchParams.delete("convenient")
    navigate({
      pathname: location.pathname,
      search: newSearchParams.toString(),
    })
  }

  return (
    <Popover open={isShowContent} onOpenChange={setIsShowContent}>
      <PopoverTrigger
        ref={parentSidebarRef}
        className={cn(
          "rounded-md px-2 py-[6px] w-full font-semibold text-secondary border border-input",
          className
        )}
        data-testid={`${testIdPrefix}-trigger`}
      >
        Tiện nghi
      </PopoverTrigger>
      <PopoverContent
        className="p-0 max-h-[400px] h-fit overflow-y-auto"
        style={{ width: `${width}px` }}
        data-testid={`${testIdPrefix}-content`}
      >
        <div className="p-4 border-b sticky top-0 bg-slate-50 z-10 border-slate-200 text-slate-900 flex items-center font-bold text-sm">
          <p className="flex-auto text-center">Tiện nghi</p>
          <span className="flex-none block">
            <X onClick={() => setIsShowContent(false)} size={14} color="#555555" />
          </span>
        </div>
        <Form {...form}>
          <form className="p-4" data-testid={`${testIdPrefix}-form`}>
            <FormField
              control={form.control}
              name="convenient"
              render={() => (
                <FormItem>
                  {options.map((el) => (
                    <FormField
                      key={el.id}
                      control={form.control}
                      name="convenient"
                      render={({ field }) => (
                        <FormItem key={el.id} className="flex items-center justify-between">
                          <FormLabel className="flex-auto">{el.label}</FormLabel>
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(el.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, el.id])
                                  : field.onChange(field.value?.filter((value) => value !== el.id))
                              }}
                              data-testid={`${testIdPrefix}-option-${String(el.id).replace(/\s+/g, "-")}`}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ))}
                </FormItem>
              )}
            />
          </form>
        </Form>
        <div className="p-4 sticky bottom-0 border-t bg-slate-50 z-10 border-slate-200 text-slate-900 flex items-center font-bold justify-between text-sm">
          <div></div>
          <Button onClick={handleSubmit} size="sm" data-testid={`${testIdPrefix}-apply`}>
            Áp dụng
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default PopoverCheckbox

PopoverCheckbox.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string, label: PropTypes.string })),
  className: PropTypes.string,
  testIdPrefix: PropTypes.string,
}

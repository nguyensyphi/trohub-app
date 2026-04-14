import { Controller, useForm } from "react-hook-form"
import PropTypes from "prop-types"
import { cn, formatNumberWithZero } from "@/lib/utils"
import { ArrowRight, LoaderCircle } from "lucide-react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { memo } from "react"
import Section from "../Section"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

const formSchema = z.object({
  first: z.string().length(1, { message: "" }),
  second: z.string().length(1, { message: "" }),
  third: z.string().length(1, { message: "" }),
  fourth: z.string().length(1, { message: "" }),
  fiveth: z.string().length(1, { message: "" }),
  sixth: z.string().length(1, { message: "" }),
})

const VerifyOtp = ({ seconds, minutes, onOTPSubmit, isLoading, isEmail = false }) => {
  const {
    handleSubmit,
    control,
    setFocus,
    formState: { errors },
  } = useForm({ resolver: zodResolver(formSchema) })
  const otpFields = ["first", "second", "third", "fourth", "fiveth", "sixth"]

  const handleInputChange = (e, fieldIndex) => {
    const value = e.target.value
    if (value.length === 1 && fieldIndex < otpFields.length - 1) {
      setFocus(otpFields[fieldIndex + 1])
    } else if (value.length === 0 && fieldIndex > 0) {
      setFocus(otpFields[fieldIndex - 1])
    }
  }

  const onSubmit = (data) => {
    const otp = Object.values(data).join("")
    onOTPSubmit(otp)
  }

  return (
    <Section title="Xác minh OTP">
      <div className="space-y-4">
        <p>
          {`Hệ thống đã gửi mã OTP tới ${
            isEmail ? "Email" : "SĐT"
          } vừa đang ký. Hãy check điện thoại của bạn và xác nhận OTP trước khi
          hết thời gian.`}
        </p>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center justify-center gap-4 text-slate-900 text-2xl font-bold">
            <span>{formatNumberWithZero(minutes)}</span>
            <span>:</span>
            <span>{formatNumberWithZero(seconds)}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            {otpFields.map((el, index) => (
              <Controller
                key={el}
                name={el}
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    onChange={(e) => {
                      if (e.target.value >= 10) return
                      field.onChange(e)
                      handleInputChange(e, index)
                    }}
                    autoFocus={index === 0}
                    className={cn(
                      "w-16 h-16 text-center border px-0 text-2xl border-slate-200 rounded-md",
                      errors[el] && "border-red-500"
                    )}
                  />
                )}
              />
            ))}
          </div>
          <div className="flex justify-center">
            <Button disabled={isLoading} size="sm">
              {isLoading && (
                <span className="animate-spin">
                  <LoaderCircle size={16} />
                </span>
              )}
              <span>Xác nhận</span>
              <ArrowRight size={16} />
            </Button>
          </div>
        </form>
      </div>
    </Section>
  )
}

export default memo(VerifyOtp)

VerifyOtp.propTypes = {
  className: PropTypes.string,
  seconds: PropTypes.number.isRequired,
  isLoading: PropTypes.bool,
  minutes: PropTypes.number.isRequired,
  onOTPSubmit: PropTypes.func.isRequired,
  isEmail: PropTypes.bool,
}

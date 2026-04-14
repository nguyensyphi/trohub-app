import { Form } from "@/components/ui/form"
import { CustomInput } from "@/components/forms"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, LoaderCircle } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useMeStore } from "@/zustand/useMeStore"
import { toast } from "sonner"
import useCountdownHook from "@/hooks/useCountDown"
import { apiSendOtpPhone, apiVerifyOtpPhone } from "@/apis/user"
import pathnames from "@/lib/pathnames"
import Section from "@/components/Section"
import { VerifyOtp } from "@/components/otp"

const formSchema = z.object({
  phone: z
    .string()
    .length(10, { message: "SĐT phải có 10 số" })
    .transform((val) => +val)
    .refine((val) => !isNaN(val), { message: "SĐT không hợp lệ." }),
})

//--------------------------------------------------------------------------

const ChangePhone = () => {
  const form = useForm({
    defaultValues: {
      phone: "",
    },
    resolver: zodResolver(formSchema),
  })
  const { minutes, seconds, startCountdown } = useCountdownHook({ initMinutes: 5 })
  const [step, setStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { getMe, me } = useMeStore()

  // Quay lại step 0 khi hết thời gian countdown
  useEffect(() => {
    if (seconds === 0 && minutes === 0) setStep(0)
  }, [seconds, minutes])

  useEffect(() => {
    if (me) form.setValue("phone", me.phone)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me])

  const onSubmit = async ({ phone }) => {
    const fullPhone = "+84" + Number(phone)
    setIsLoading(true)
    const loadingToast = toast.loading("Đang gửi OTP về SĐT của bạn...")
    const response = await apiSendOtpPhone({ phone: fullPhone })
    setIsLoading(false)
    if (response.data.success) {
      toast.success(response.data.msg, { id: loadingToast })
      setStep(1)
      startCountdown()
    } else toast.error(response.data.msg, { id: loadingToast })
  }

  const onOTPSubmit = useCallback(
    async (otp) => {
      // Handle sau khi nhập code OTP
      const fullPhone = "+84" + Number(form.watch("phone"))
      const payload = {
        phone: fullPhone,
        code: otp,
      }
      const response = await apiVerifyOtpPhone(payload)
      if (response.data.success) {
        toast.success(response.data.msg)
        getMe() // Update phone in profile
        const redirectPath = searchParams.get("redirect")
        if (redirectPath) navigate(redirectPath)
        else navigate("/" + pathnames.user.layout + pathnames.user.personal)
      } else {
        toast.error(response.data.msg)
      }
      setStep(0)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams]
  )

  return (
    <div className="w-[700px] max-w-full m-auto py-4 space-y-4">
      <div id="recaptcha-container"></div>
      <Section title="Cập nhật số điện thoại">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <CustomInput
              form={form}
              id="phone"
              label="Số điện thoại"
              placeholder="Nhập só điện thoại của bạn. VD: 07925001548"
              isRequired={true}
            />
            <div className="flex justify-center">
              <Button id="sign-in-button" disabled={isLoading} className={cn(isLoading && "px-3")} size="sm">
                {isLoading && (
                  <span className="animate-spin">
                    <LoaderCircle size={16} />
                  </span>
                )}
                <span>Tiếp tục</span>
                <ArrowRight size={16} />
              </Button>
            </div>
          </form>
        </Form>
      </Section>
      {step === 1 && (
        <VerifyOtp onOTPSubmit={onOTPSubmit} isLoading={isLoading} minutes={minutes} seconds={seconds} />
      )}
      <div id="recaptcha-container"></div>
    </div>
  )
}

export default ChangePhone

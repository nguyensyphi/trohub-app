import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, LoaderCircle } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import useCountdownHook from "@/hooks/useCountDown"
import { useMeStore } from "@/zustand/useMeStore"
import { apiSendMailOtp, apiVerifyEmail } from "@/apis/user"
import pathnames from "@/lib/pathnames"
import Section from "@/components/Section"
import { CustomInput } from "@/components/forms"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { VerifyOtp } from "@/components/otp"

const formSchema = z.object({
  email: z.string().email("Email không hợp lệ."),
})

const ChangeEmail = () => {
  const form = useForm({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(formSchema),
  })
  const { minutes, seconds, startCountdown } = useCountdownHook({ initMinutes: 5 })
  const [step, setStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { getMe, me } = useMeStore()

  useEffect(() => {
    if (me && me.email) form.setValue("email", me.email)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me])

  const onSubmit = async ({ email }) => {
    setIsLoading(true)
    const loadingToast = toast.loading("Đang gửi OTP về email của bạn...")
    const response = await apiSendMailOtp({ email })
    setIsLoading(false)
    if (response.data.success) {
      toast.success(response.data.msg, { id: loadingToast })
      setStep(1)
      startCountdown()
    } else toast.error(response.data.msg, { id: loadingToast })
  }

  const onOTPSubmit = useCallback(
    async (otp) => {
      const payload = {
        email: form.getValues("email"),
        otp,
      }
      const response = await apiVerifyEmail(payload)
      if (response.data.success) {
        toast.success(response.data.msg)
        getMe() // Update phone in profile
        navigate("/" + pathnames.user.layout + pathnames.user.personal)
      } else {
        toast.error(response.data.msg)
      }
      setStep(0)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <div className="w-[700px] max-w-full m-auto py-4 space-y-4">
      <Section title="Cập nhật email của bạn">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <CustomInput
              form={form}
              id="email"
              label="Địa chỉ email"
              placeholder="Nhập email của bạn. VD: example@gmail.com"
              isRequired={true}
            />
            <div className="flex justify-center">
              <Button disabled={isLoading} className={cn(isLoading && "px-3")} size="sm">
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
        <VerifyOtp
          onOTPSubmit={onOTPSubmit}
          isEmail={true}
          isLoading={isLoading}
          minutes={minutes}
          seconds={seconds}
        />
      )}
    </div>
  )
}

export default ChangeEmail

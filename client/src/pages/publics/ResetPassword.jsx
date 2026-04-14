import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, LoaderCircle } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { apiResetPasswordRequired } from "@/apis/user"
import Section from "@/components/Section"
import { CustomInput } from "@/components/forms"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import UpdatePassword from "./UpdatePassword"

const formSchema = z.object({
  email: z.string().email("Email không hợp lệ."),
})

const ResetPassword = () => {
  const form = useForm({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(formSchema),
  })

  const email = form.watch("email")
  const [step, setStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async ({ email }) => {
    setIsLoading(true)
    const loadingToast = toast.loading("Đang gửi OTP về email của bạn...")
    const response = await apiResetPasswordRequired({ email })
    setIsLoading(false)
    if (response.data.success) {
      toast.success(response.data.msg, { id: loadingToast })
      setStep(1)
    } else toast.error(response.data.msg, { id: loadingToast })
  }

  return (
    <div className="w-[700px] max-w-full m-auto py-4 space-y-4">
      {step === 0 && (
        <Section title="Khôi phục mật khẩu">
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
      )}
      {step === 1 && <UpdatePassword back={() => setStep(0)} email={email} />}
    </div>
  )
}

export default ResetPassword

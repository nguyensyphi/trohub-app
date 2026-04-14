// import React from "react"

import { useMeStore } from "@/zustand/useMeStore"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { EyeIcon, EyeOffIcon, LockIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { apiGoogleLogin } from "@/apis/auth"
import { toast } from "sonner"
import { useNavigate, useSearchParams } from "react-router-dom"

const formSchema = z
  .object({
    password: z.string(),
    confirmPassword: z.string(),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Mật khẩu không trùng khớp.",
    path: ["confirmPassword"],
  })

const SetupPassword = () => {
  const { googleData, setToken, setGoogleData } = useMeStore()
  const navigate = useNavigate()

  useEffect(() => {
    handleRegister()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })
  const [isShowPassword, setIsShowPassword] = useState(false)
  const [searchParams] = useSearchParams()

  const handleRegister = async (data) => {
    const payload = googleData
    if (data && data.password) payload.password = data.password
    const response = await apiGoogleLogin(payload)
    if (response.data.success) {
      toast.success(response.data.msg)
      setToken(response.data.accessToken)
      setGoogleData(null)
      handleRedirect()
    } else {
      if (data) toast.error(response.msg)
    }
  }
  const handleRedirect = () => {
    const redirectPath = searchParams.get("redirect")
    if (redirectPath) navigate(redirectPath)
    else navigate("/")
  }
  return (
    <>
      <p className="font-bold text-base">Bước cuối cùng</p>
      <p className="font-bold text-2xl mt-1 mb-6">Thiết lập mật khẩu</p>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleRegister)}>
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem className="relative">
                <FormControl>
                  <Input
                    className="pl-10"
                    {...field}
                    placeholder="Mật khẩu"
                    type={isShowPassword ? "text" : "password"}
                  />
                </FormControl>
                <div className="absolute -top-1 w-10 h-10 flex text-blue-600 items-center justify-center bg-transparent">
                  <LockIcon size={16} className="mb-[6px]" />
                </div>
                <div
                  onClick={() => setIsShowPassword(!isShowPassword)}
                  className="absolute -top-1 cursor-pointer right-0 w-10 h-10 flex text-slate-400 items-center justify-center bg-transparent"
                >
                  {isShowPassword ? (
                    <EyeIcon size={16} className="mb-[6px]" />
                  ) : (
                    <EyeOffIcon size={16} className="mb-[6px]" />
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="confirmPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem className="relative">
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Nhập lại mật khẩu"
                    type={isShowPassword ? "text" : "password"}
                    className="pl-10"
                  />
                </FormControl>
                <div className="absolute -top-1 w-10 h-10 flex text-blue-600 items-center justify-center bg-transparent">
                  <LockIcon size={16} className="mb-[6px]" />
                </div>
                <div
                  onClick={() => setIsShowPassword(!isShowPassword)}
                  className="absolute -top-1 cursor-pointer right-0 w-10 h-10 flex text-slate-400 items-center justify-center bg-transparent"
                >
                  {isShowPassword ? (
                    <EyeIcon size={16} className="mb-[6px]" />
                  ) : (
                    <EyeOffIcon size={16} className="mb-[6px]" />
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" type="submit">
            Xác nhận
          </Button>
        </form>
      </Form>
    </>
  )
}

export default SetupPassword

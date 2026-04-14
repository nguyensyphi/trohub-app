/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { EyeIcon, EyeOffIcon, LockIcon, Mail, PhoneCall, User2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGoogleLogin } from "@react-oauth/google"
import { useMeStore } from "@/zustand/useMeStore"
import { apiLoginWithEmail, apiLoginWithPhone, apiRegisterWithEmail, apiRegisterWithPhone } from "@/apis/auth"
import { toast } from "sonner"
import { apiGetGoogleCredentials } from "@/apis/external"
import SetupPassword from "./SetupPassword"
import pathnames from "@/lib/pathnames"

const formEmailSchema = z.object({
  email: z.string().email("Email không hợp lệ."),
  password: z.string().min(6, { message: "Mật khẩu tối thiểu 6 ký tự" }),
})
const formPhoneSchema = z.object({
  phone: z
    .string()
    .min(10, { message: "Số điện thoại không hợp lệ." })
    .refine((val) => !isNaN(val), { message: "Số điện thoại không hợp lệ." }),
  password: z.string().min(6, { message: "Mật khẩu tối thiểu 6 ký tự" }),
})

const Login = () => {
  const [isShowPassword, setIsShowPassword] = useState(false)
  const [isRegister, setIsRegister] = useState(false)
  const [isSetUpPassword, setIsSetUpPassword] = useState(false)
  const [activedTab, setActivedTab] = useState("email")
  const [activedSchema, setActivedSchema] = useState(formEmailSchema)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { setGoogleData, setToken } = useMeStore()

  useEffect(() => {
    let schema = activedTab === "email" ? formEmailSchema : formPhoneSchema
    if (isRegister)
      schema = schema.extend({ fullname: z.string().min(1, { message: "Tên không được bỏ trống." }) })
    setActivedSchema(schema)
  }, [activedTab, isRegister])

  const form = useForm({
    resolver: zodResolver(activedSchema),
    defaultValues: {
      email: "",
      phone: "",
      password: "",
      fullname: "",
    },
  })

  useEffect(() => {
    form.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRegister, activedTab])

  const onSubmit = async (data) => {
    const { isRemember, ...payload } = data
    let response
    if (isRegister) {
      response =
        activedTab === "email" ? await apiRegisterWithEmail(payload) : await apiRegisterWithPhone(payload)
      if (response.data.success) {
        toast.success(response.data.msg)
        setIsRegister(false)
      } else toast.error(response.data.msg)
    } else {
      response = activedTab === "email" ? await apiLoginWithEmail(payload) : await apiLoginWithPhone(payload)
      if (response.data.success) {
        toast.success(response.data.msg)
        setToken(response.data.accessToken)
        handleRedirect()
      } else toast.error(response.data.msg)
    }
  }

  const handleRedirect = () => {
    const redirectPath = searchParams.get("redirect")
    if (redirectPath) navigate(redirectPath)
    else navigate("/")
  }

  const handleLoginGoogle = useGoogleLogin({
    onSuccess: async (response) => {
      if (!response.access_token) return toast.error("Có lỗi, hãy thử lại nhé~")
      const credentialsRes = await apiGetGoogleCredentials(response.access_token)
      if (credentialsRes.status === 200) {
        toast.success("Đăng nhập thành công.")
        const payload = {
          fullname: credentialsRes.data.name,
          email: credentialsRes.data.email,
          avatar: credentialsRes.data.picture,
        }
        setGoogleData(payload)
        setIsSetUpPassword(true)
      }
    },
    onError: (error) => {
      console.log("Login failure:", error)
    },
  })

  return (
    <main className="h-full flex justify-center py-24" data-testid="login-page">
      <section className="w-[700px] bg-white border border-slate-200 h-fit rounded-md grid grid-cols-10" aria-label="Khối đăng nhập">
        <div className="col-span-4 flex items-center justify-center p-8">
          <img src="Login.svg" alt="banner" className="w-full object-contain" />
        </div>
        {!isSetUpPassword && (
          <div className="col-span-6 p-6">
            <p className="font-bold text-base">Xin chào bạn</p>
            <p className="font-bold text-2xl mt-1 mb-6">
              {isRegister ? "Đăng ký tài khoản mới" : "Đăng nhập để tiếp tục"}
            </p>
            <Form {...form}>
              <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} data-testid="auth-form">
                <Tabs value={activedTab} onValueChange={setActivedTab}>
                  <TabsList>
                    <TabsTrigger value="email" data-testid="auth-tab-email">
                      Email
                    </TabsTrigger>
                    <TabsTrigger value="phone" data-testid="auth-tab-phone">
                      Số điện thoại
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="email">
                    <FormField
                      name="email"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="relative">
                          <FormControl>
                            <Input
                              className="pl-10"
                              {...field}
                              placeholder="Email của bạn"
                              data-testid="auth-input-email"
                              aria-label="Email đăng nhập"
                            />
                          </FormControl>
                          <div className="absolute -top-1 w-10 h-10 flex items-center justify-center bg-transparent">
                            <Mail size={16} className="mb-[6px]" />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  <TabsContent value="phone">
                    <FormField
                      name="phone"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="relative">
                          <FormControl>
                            <Input
                              className="pl-10"
                              {...field}
                              placeholder="Số điện thoại của bạn"
                              data-testid="auth-input-phone"
                              aria-label="Số điện thoại đăng nhập"
                            />
                          </FormControl>
                          <div className="absolute -top-1 w-10 h-10 flex items-center justify-center bg-transparent">
                            <PhoneCall size={16} className="mb-[6px]" />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>
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
                          data-testid="auth-input-password"
                          aria-label="Mật khẩu đăng nhập"
                        />
                      </FormControl>
                      <div className="absolute -top-1 w-10 h-10 flex items-center justify-center bg-transparent">
                        <LockIcon size={16} className="mb-[6px]" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsShowPassword(!isShowPassword)}
                        className="absolute -top-1 cursor-pointer right-0 w-10 h-10 flex text-slate-400 items-center justify-center bg-transparent"
                        data-testid="auth-toggle-password"
                        aria-label="Ẩn hoặc hiện mật khẩu"
                      >
                        {isShowPassword ? (
                          <EyeIcon size={16} className="mb-[6px]" />
                        ) : (
                          <EyeOffIcon size={16} className="mb-[6px]" />
                        )}
                      </button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {isRegister && (
                  <FormField
                    name="fullname"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem className="relative">
                          <FormControl>
                            <Input
                              className="pl-10"
                              {...field}
                              placeholder="Tên đầy đủ"
                              data-testid="auth-input-fullname"
                              aria-label="Họ tên đăng ký"
                            />
                          </FormControl>
                          <div className="absolute -top-1 w-10 h-10 flex items-center justify-center bg-transparent">
                            <User2Icon size={16} className="mb-[6px]" />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <Button className="w-full" type="submit" data-testid="auth-submit-button">
                  {isRegister ? "Đăng ký" : "Đăng nhập"}
                </Button>
                {!isRegister && (
                  <div className="text-sm flex items-center justify-between my-2">
                    <Link
                      to={"/" + pathnames.publics.resetPassword}
                      className="cursor-pointer text-primary hover:underline"
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>
                )}
              </form>
            </Form>
            <div className="w-full h-6 flex items-center relative my-4">
              <div className="border-slate-200 border-t w-full h-[1px]"></div>
              <div className="absolute inset-0 bg-transparent w-fit mx-auto">
                <p className="text-slate-500 bg-white px-2 text-sm">Hoặc</p>
              </div>
            </div>
            <div className="space-y-4">
              <Button
                className="w-full"
                onClick={() => handleLoginGoogle()}
                variant="outline"
                data-testid="auth-google-button"
              >
                <img src="/Google.svg" alt="google logo" className="w-5 h-5 mr-3 object-cover" />
                <span>Đăng nhập với Google</span>
              </Button>
            </div>
            {!isRegister ? (
              <p className="text-sm mt-4 text-center">
                Bạn chưa là thành viên?{" "}
                <span
                  onClick={() => setIsRegister(true)}
                  className="text-primary underline cursor-pointer"
                  data-testid="auth-switch-register"
                >
                  Đăng ký
                </span>{" "}
                tại đây
              </p>
            ) : (
              <p className="text-sm mt-4 text-center">
                Bạn đã có tài khoản?{" "}
                <span
                  onClick={() => setIsRegister(false)}
                  className="text-red-600 font-bold hover:underline cursor-pointer"
                  data-testid="auth-switch-login"
                >
                  Đăng nhập
                </span>{" "}
                tại đây
              </p>
            )}
          </div>
        )}
        {isSetUpPassword && (
          <div className="col-span-6 p-8">
            <SetupPassword />
          </div>
        )}
      </section>
    </main>
  )
}

export default Login

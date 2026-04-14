import { useCallback, useEffect, useState } from "react"
import { apiGetMe, apiUpdateMe, apiUpdateRoleUpgrade } from "@/apis/user"
import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { FilePenLine } from "lucide-react"
import { toast } from "sonner"
import { useMeStore } from "@/zustand/useMeStore"
import Section from "@/components/Section"
import { CustomDropbox, CustomInput } from "@/components/forms"
import { generateDefaultAvatar } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useNavigate } from "react-router-dom"
import pathnames from "@/lib/pathnames"

const FormSchema = z.object({
  email: z.string().optional(),
  phone: z.string().optional(),
  fullname: z.string().min(1, { message: "Trường này là bắt buộc." }),
  avatar: z.array(z.string()).optional(),
  balance: z.number().optional(),
  role: z.string().optional(),
})

const Personal = () => {
  const [personalData, setPersonalData] = useState(null)
  const [isEdit, setIsEdit] = useState(false)
  const [update, setUpdate] = useState(false)
  const { setMe, logout } = useMeStore()
  const form = useForm({
    defaultValues: {
      email: "",
      phone: "",
      fullname: "",
      avatar: [],
      balance: 0,
      role: "",
    },
    resolver: zodResolver(FormSchema),
  })

  const navigate = useNavigate()

  const avatar = form.watch("avatar")
  const role = form.watch("role")

  useEffect(() => {
    const fetchPersonal = async () => {
      const response = await apiGetMe()
      if (response.status === 200) {
        setPersonalData(response.data.user)
      }
    }
    fetchPersonal()
  }, [update])

  const refresh = useCallback(() => setUpdate((prev) => !prev), [])

  useEffect(() => {
    if (personalData) {
      form.reset({
        email: personalData.email || "",
        phone: personalData.phone || "",
        fullname: personalData.fullname || "",
        avatar: [personalData.avatar],
        balance: personalData.balance,
        role: personalData.role,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personalData])

  const onSubmit = async (data) => {
    const response = await apiUpdateMe(data)
    if (response.data.success) {
      toast.success(response.data.msg)
      setMe(response.data.user)
      refresh()
      setIsEdit(false)
    } else toast.error(response.data.msg)
  }

  const onSelect = (data) => {
    if (data && data.length > 0) {
      form.setValue("avatar", [...data.map((el) => el.link)])
    }
  }

  const onRemove = (link) => {
    const currentMedia = [...avatar]
    form.setValue(
      "avatar",
      currentMedia.filter((el) => el !== link)
    )
  }

  const handleUpgrade = async () => {
    const response = await apiUpdateRoleUpgrade()
    if (response.data.success) {
      toast.success(response.data.msg)
      logout()
      navigate("/" + pathnames.publics.login)
    } else toast.error(response.data.msg)
  }

  return (
    <div className="w-[700px] max-w-full mx-auto my-4">
      <Section title="Thông tin cá nhân">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-10 gap-8">
            <div className="space-y-4 col-span-7">
              <CustomInput readOnly={!isEdit} form={form} label="Tên đầy đủ" id="fullname" />
              <CustomInput readOnly={true} form={form} label="Email" id="email" />
              <CustomInput readOnly={true} form={form} label="Số điện thoại" id="phone" />
              <CustomInput readOnly={true} form={form} label="Tài khoản" id="balance" />
              <div className="space-y-2">
                <CustomInput readOnly={true} form={form} label="Loại tài khoản" id="role" />
                {role === "Thành viên" && (
                  <Dialog>
                    <DialogTrigger>
                      <p className="text-xs">
                        Bạn muốn đăng tin?{" "}
                        <Dialog>
                          <DialogTrigger>
                            <span className="text-xs ml-2 underline cursor-pointer text-blue-600">
                              Nâng cấp tài khoản thành chủ trọ!
                            </span>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle className="pb-3 border-b">Thông báo</DialogTitle>
                              <DialogDescription className="pt-3">
                                <p>
                                  Đề nâng cấp thành chủ trọ và có thể đăng tin thì bạn phải thỏa mãn các điều
                                  kiện:
                                </p>
                                <ul className="list-disc ml-12">
                                  <li>
                                    Email và SĐT phải được xác minh{" "}
                                    <span>
                                      {personalData?.phoneVerified && personalData?.emailVerified ? (
                                        <span className="text-green-500 text-xs">(Đã thỏa)</span>
                                      ) : (
                                        <span className="text-red-500 text-xs">(Chưa thỏa)</span>
                                      )}
                                    </span>
                                  </li>
                                  <li>
                                    Số dư tài khoản lớn hơn 0{" "}
                                    <span>
                                      {personalData?.balance > 0 ? (
                                        <span className="text-green-500 text-xs">(Đã thỏa)</span>
                                      ) : (
                                        <span className="text-red-500 text-xs">(Chưa thỏa)</span>
                                      )}
                                    </span>
                                  </li>
                                </ul>
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="grid place-content-center">
                              <Button
                                disabled={
                                  !personalData?.phoneVerified ||
                                  !personalData?.emailVerified ||
                                  personalData?.balance === 0
                                }
                                onClick={handleUpgrade}
                              >
                                Nâng cấp
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </p>
                    </DialogTrigger>
                  </Dialog>
                )}
              </div>
            </div>
            <div className="flex col-span-3 flex-col gap-2">
              <p className="font-bold text-sm">Ảnh đại diện</p>
              <img
                src={personalData?.avatar || generateDefaultAvatar(personalData?.fullname?.toLowerCase())}
                className="rounded-full w-32 h-32 object-cover"
                alt="Avatar"
              />
              {isEdit && (
                <CustomDropbox
                  onSelect={onSelect}
                  errors={form.formState.errors}
                  onRemove={onRemove}
                  media={avatar}
                  className="grid-cols-1 min-h-fit"
                />
              )}
            </div>
            {isEdit && (
              <div className="flex items-center gap-4">
                <Button type="submit">
                  <span>Cập nhật</span>
                </Button>
                <Button onClick={() => setIsEdit(false)} variant="destructive" type="button">
                  <span>Hủy bỏ</span>
                </Button>
              </div>
            )}
          </form>
        </Form>
        {!isEdit && (
          <Button onClick={() => setIsEdit(true)} variant="outline" className="w-fit px-6" size="icon">
            <FilePenLine size={16} />
            <span>Cập nhật thông tin</span>
          </Button>
        )}
      </Section>
    </div>
  )
}

export default Personal

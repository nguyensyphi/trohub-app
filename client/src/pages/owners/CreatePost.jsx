import { apiCreateNewPost } from "@/apis/post"
import { CustomCheckbox, CustomEditor, CustomInput } from "@/components/forms"
import CustomDropBox from "@/components/forms/CustomDropbox"
import CustomSelect from "@/components/forms/CustomSelect"
import CustomAddressOption from "@/components/layouts/CustomAddressOption"
import Section from "@/components/Section"
import CustomTooltip from "@/components/tooltips/Tooltip"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import useCountdownHook from "@/hooks/useCountDown"
import { convenients, genders, postTypes, priorities } from "@/lib/constant"
import pathnames from "@/lib/pathnames"
import { useMeStore } from "@/zustand/useMeStore"
import { zodResolver } from "@hookform/resolvers/zod"
import { Info } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { createSearchParams, useLocation, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { z } from "zod"

const FormSchema = z.object({
  provinceId: z.string().min(1, { message: "Trường này là bắt buộc." }),
  province: z.string(),
  district: z.string().optional(),
  ward: z.string().optional(),
  districtId: z.string().optional(),
  wardId: z.string().optional(),
  address: z.string().min(1, { message: "Trường này là bắt buộc." }),
  addressBonus: z.string().optional(),
  price: z.number({
    required_error: "Trường này là bắt buộc.",
    invalid_type_error: "Mức giá phải là số.",
  }),
  total: z.number({
    required_error: "Trường này là bắt buộc.",
    invalid_type_error: "Mức giá phải là số.",
  }),
  orderedDays: z
    .number({
      required_error: "Trường này là bắt buộc.",
      invalid_type_error: "Mức giá phải là số.",
    })
    .refine((val) => parseInt(val) >= 3, { message: "Số ngày hiển thị phải tối thiểu là 3 ngày." }),
  size: z
    .number({
      required_error: "Trường này là bắt buộc.",
      invalid_type_error: "Mức giá phải là số.",
    })
    .refine((val) => val > 0, { message: "Diện tích phải lớn hơn 0" }),
  media: z
    .array(z.string().url({ message: "Link media không hợp lệ." }))
    .min(3, { message: "Tải ít nhất 3 ảnh / videos." }),
  title: z.string().min(1, { message: "Trường này là bắt buộc." }),
  description: z.string().min(1, { message: "Trường này là bắt buộc." }),
  fullname: z.string().min(1, { message: "Trường này là bắt buộc." }),
  phone: z.string(),
  email: z.string().email({ message: "Email không hợp lệ." }),
  bedroom: z
    .number({
      invalid_type_error: "Mức giá phải là số.",
    })
    .optional(),
  bathroom: z
    .number({
      invalid_type_error: "Mức giá phải là số.",
    })
    .optional(),
  convenient: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
  postType: z.string().min(1, { message: "Trường này là bắt buộc." }),
  gender: z.string().min(1, { message: "Trường này là bắt buộc." }),
  priority: z.string().min(1, { message: "Trường này là bắt buộc." }),
})

const CreatePost = () => {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      provinceId: "",
      province: "",
      districtId: "",
      district: "",
      wardId: "",
      ward: "",
      address: "",
      addressBonus: "",
      price: 0,
      size: 0,
      media: [],
      title: "",
      description: "",
      bedroom: 0,
      bathroom: 0,
      fullname: "",
      phone: "",
      email: "",
      convenient: [],
      gender: "",
      postType: "",
      orderedDays: 0,
      total: 0,
      priority: "0",
    },
  })
  const { seconds, startCountdown } = useCountdownHook({ initSeconds: 9 })
  const media = form.watch("media")
  const convenient = form.watch("convenient")
  const orderedDays = form.watch("orderedDays")
  const priority = form.watch("priority")
  const { me } = useMeStore()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!me || !me.phone) startCountdown()
    if (me) {
      form.setValue("email", me.email || "")
      form.setValue("fullname", me.fullname || "")
      form.setValue("phone", me.phone || "")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me])

  useEffect(() => {
    if (seconds <= 0) handleRedirect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds])

  const handleRedirect = () => {
    navigate({
      pathname: "/" + pathnames.user.layout + pathnames.user.changePhone,
      search: createSearchParams({ redirect: location.pathname }).toString(),
    })
  }

  useEffect(() => {
    if (!isNaN(orderedDays) && priority) {
      form.setValue("total", orderedDays * priorities.find((el) => el.value === priority)?.price)
    } else form.setValue("total", 0)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderedDays, priority])

  const onSelect = (data) => {
    if (data && data.length > 0) {
      const currentMedia = [...media]
      form.setValue("media", [...currentMedia, ...data.map((el) => el.link)])
    }
  }

  const onRemove = (link) => {
    const currentMedia = [...media]
    form.setValue(
      "media",
      currentMedia.filter((el) => el !== link)
    )
  }

  const onSubmit = async (data) => {
    // Thêm ngày hết hạn 1 tuấn
    data.expiredDate = null

    // Remove unnessessory data
    delete data.districtId
    delete data.phone
    delete data.wardId
    delete data.provinceId
    delete data.fullname
    delete data.email

    const response = await apiCreateNewPost(data)
    if (response.data.success) {
      toast.success(response.data.msg)
      navigate("/" + pathnames.owner.layout + pathnames.owner.managePost)
    } else toast.error(response.data.msg)
  }

  const handleSelectCheckbox = (val) => {
    const hasValue = convenient.some((el) => el.value === val.value)
    if (hasValue)
      form.setValue(
        "convenient",
        convenient.filter((el) => el.value !== val.value)
      )
    else form.setValue("convenient", [...convenient, val])
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-[700px] max-w-full m-auto py-4 space-y-4">
          <Section title="Thông tin cơ bản">
            <div className="flex items-center justify-between gap-4">
              <CustomSelect
                isRequired={true}
                form={form}
                id="postType"
                options={postTypes}
                label="Loại tin đăng"
                placeholder="Chọn"
              />
            </div>
            <CustomAddressOption form={form} />
          </Section>
          <Section title="Thông tin bài viết">
            <CustomInput
              form={form}
              id="title"
              label="Tiêu đề"
              placeholder="VD: Bán căn hộ chung cư chính chủ tại Hồ Chí Minh"
              isRequired={true}
            />
            <CustomEditor
              form={form}
              placeholder="Nhập mô tả chung về phòng trọ của bạn,"
              id="description"
              label="Mô tả"
              isRequired={true}
            />
          </Section>
          <Section title="Thông tin phòng trọ">
            <div className="grid grid-cols-6 gap-4">
              <CustomInput
                form={form}
                id="size"
                label="Diện tích"
                placeholder="Nhập diện tích. VD: 100"
                isRequired={true}
                type="number"
                className="col-span-3"
              />
              <CustomInput
                form={form}
                id="price"
                label="Mức giá"
                placeholder="Nhập mức giá. VD: 1000000"
                isRequired={true}
                type="number"
                className="col-span-3"
              />
              <CustomSelect
                isRequired={true}
                form={form}
                id="priority"
                options={priorities}
                label="Gói tin đăng"
                placeholder="Chọn"
                className="col-span-2"
                info={
                  <CustomTooltip
                    explain={
                      <span className="flex flex-col max-w-[250px] p-2 gap-2">
                        <span>Các gói tin đăng càng cao sẽ được ưu tiên hiển thị trước!</span>
                        {priorities.map((el) => (
                          <span className="font-normal" key={el.id}>
                            <span className="text-sm">{`${el.label}: ${Number(
                              el.price
                            ).toLocaleString()} đ`}</span>
                          </span>
                        ))}
                      </span>
                    }
                  >
                    <Info size={16} className="text-blue-500" />
                  </CustomTooltip>
                }
              />
              <CustomInput
                form={form}
                id="orderedDays"
                label="Thời hạn tin đăng"
                placeholder="Tối thiệu 3 ngày"
                isRequired={true}
                type="number"
                className="col-span-2"
              />
              <CustomInput
                form={form}
                id="total"
                label="Tổng tiền thanh toán"
                type="number"
                className="col-span-2"
                readOnly={true}
                info={
                  <CustomTooltip explain="Tổng tiền thanh toán = Số tiền gói tin đăng x Số ngày hạn tin đăng">
                    <Info size={16} className="text-blue-500" />
                  </CustomTooltip>
                }
              />
              <CustomInput
                className="col-span-2"
                form={form}
                id="bedroom"
                label="Số phòng ngủ"
                placeholder="VD: 0"
                type="number"
              />
              <CustomInput
                form={form}
                id="bathroom"
                label="Số phòng tắm"
                placeholder="VD: 0"
                type="number"
                className="col-span-2"
              />
              <CustomSelect
                isRequired={true}
                form={form}
                id="gender"
                options={genders}
                label="Đối tượng mong muốn"
                placeholder="Chọn"
                className="col-span-2"
              />
              <CustomCheckbox
                options={convenients.map((el) => ({
                  label: el,
                  value: el,
                }))}
                label="Tiện nghi"
                values={convenient}
                onChangeValues={handleSelectCheckbox}
                limit={10}
              />
            </div>
          </Section>
          <Section title="Tải hình ảnh và video">
            <CustomDropBox
              onSelect={onSelect}
              errors={form.formState.errors}
              onRemove={onRemove}
              media={media}
              isMultiple={true}
            />
          </Section>
          <Section title="Thông tin liên hệ">
            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                form={form}
                id="fullname"
                label="1. Tên đầy đủ"
                placeholder="Nhập tên đầy đủ của bạn"
                isRequired={true}
                readOnly={true}
              />
              <CustomInput
                form={form}
                id="phone"
                label="2. Số điện thoại"
                placeholder="Nhập SĐT của bạn"
                isRequired={true}
                readOnly={true}
              />
              <CustomInput
                form={form}
                id="email"
                readOnly={true}
                label="3. Email"
                placeholder="Nhập email của bạn"
              />
            </div>
          </Section>
          <Section title="Thông tin thanh toán">
            <div className="mt-4 space-y-4">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Gói tin đăng:</span>
                <span>
                  {priorities.find((el) => el.value === form.getValues("priority"))?.label || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Đơn giá:</span>
                <span>
                  {Number(
                    priorities.find((el) => el.value === form.getValues("priority"))?.price
                  ).toLocaleString() + "/tin" || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Số ngày đặt:</span>
                <span>{form.getValues("orderedDays") || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Ngày hết hạn:</span>
                <span>{`Sau ${form.getValues("orderedDays")} ngày tính từ ngày duyệt bài`}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Tổng tiền:</span>
                <span>
                  {Number(
                    orderedDays * priorities.find((el) => el.value === priority)?.price
                  ).toLocaleString() + " đ" || "N/A"}
                </span>
              </div>
            </div>
          </Section>
          <div className="grid place-content-center">
            <Button>Đăng bài</Button>
          </div>
        </form>
      </Form>
      <Dialog open={!me || !me.phone || !me.phoneVerified}>
        <DialogContent className="p-0">
          <DialogHeader>
            <DialogTitle className="p-6 border-b border-slate-200">Thông báo</DialogTitle>
            <DialogDescription className="p-6">
              Để đăng được tin thì bắt buộc phải xác minh số điện thoại.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="px-6 bg-slate-100 py-3 flex justify-end items-center gap-6 border-t border-slate-200">
            <Button onClick={handleRedirect} size="sm">
              Đi tới cập nhật <span className="ml-1">{`(${seconds})`}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CreatePost

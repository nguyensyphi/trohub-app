import { apiUpdatePostByUser } from "@/apis/post"
import { CustomCheckbox, CustomEditor, CustomInput } from "@/components/forms"
import CustomDropBox from "@/components/forms/CustomDropbox"
import CustomSelect from "@/components/forms/CustomSelect"
import CustomAddressOption from "@/components/layouts/CustomAddressOption"
import Section from "@/components/Section"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { convenients, genders, postTypes } from "@/lib/constant"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import PropTypes from "prop-types"

const FormSchema = z.object({
  provinceId: z.string().optional(),
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
  roomStatus: z.string().min(1, { message: "Trường này là bắt buộc." }),
})

// eslint-disable-next-line react/prop-types
const UpdatePost = ({ post, setEditPost, mutate }) => {
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
      convenient: [],
      gender: "",
      postType: "",
      roomStatus: "",
    },
  })
  const media = form.watch("media")
  const convenient = form.watch("convenient")

  useEffect(() => {
    if (post) {
      form.reset({
        postType: post.postType || "",
        provinceId: "",
        province: post.province || "",
        districtId: "",
        district: post.district || "",
        wardId: "",
        ward: post.ward || "",
        address: post.address || "",
        addressBonus: "",
        price: +post.price || 0,
        size: +post.size || 0,
        media: post.media || [],
        convenient: post.convenient || [],
        title: post.title || "",
        description: post.description || "",
        gender: post.gender || "",
        roomStatus: post.roomStatus || "",
        bedroom: +post.bedroom || 0,
        bathroom: +post.bathroom || 0,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post])

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
    // Remove unnessessory data
    delete data.districtId
    delete data.wardId
    delete data.provinceId

    const response = await apiUpdatePostByUser(data, post.id)
    if (response.data.success) {
      toast.success(response.data.msg)
      setEditPost(null)
      mutate()
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

  // console.log(form.getValues())

  return (
    <>
      <Form {...form}>
        <form className="w-[700px] max-w-full m-auto py-4 space-y-4">
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
                className="col-span-2"
              />
              <CustomInput
                form={form}
                id="price"
                label="Mức giá"
                placeholder="Nhập mức giá. VD: 1000000"
                isRequired={true}
                type="number"
                className="col-span-2"
              />
              <CustomSelect
                isRequired={true}
                form={form}
                id="roomStatus"
                options={["Còn trống", "Đã thuê"].map((el) => ({ label: el, value: el }))}
                label="Trạng thái phòng"
                placeholder="Chọn"
                className="col-span-2"
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
          <div onClick={form.handleSubmit(onSubmit)} className="flex items-center justify-center">
            <Button>Cập nhật tin</Button>
          </div>
        </form>
      </Form>
    </>
  )
}

export default UpdatePost
UpdatePost.propTypes = {
  post: PropTypes.any.isRequired,
  setEditPost: PropTypes.func.isRequired,
}

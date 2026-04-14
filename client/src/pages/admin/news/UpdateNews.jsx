import { apiUpdateNews } from "@/apis/news"
import { CustomDropbox, CustomEditor, CustomInput } from "@/components/forms"
import Section from "@/components/Section"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import PropTypes from "prop-types"
import { useEffect } from "react"

const FormSchema = z.object({
  media: z.array(z.string().url({ message: "Link anh không hợp lệ." })).length(1, { message: "Tải 1 ảnh." }),
  title: z.string().min(1, { message: "Trường này là bắt buộc." }),
  content: z.string().min(1, { message: "Trường này là bắt buộc." }),
})

const UpdateNews = ({ setEditNews, news, refresh }) => {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      media: [],
      title: "",
      content: "",
    },
  })

  const media = form.watch("media")

  useEffect(() => {
    if (news) {
      form.reset({
        title: news.title,
        content: news.content,
        media: [news.avatar],
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [news])

  const onSubmit = async (data) => {
    const { media, ...payload } = data
    payload.avatar = media[0]
    const response = await apiUpdateNews(news.id, payload)
    if (response.data.success) {
      toast.success(response.data.msg)
      form.reset()
      setEditNews(null)
      refresh()
    } else toast.error(response.data.msg)
  }

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
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[700px] max-w-full m-auto py-4 space-y-4">
        <Section title="Tạo mới tin tức">
          <CustomInput
            form={form}
            id="title"
            label="Tiêu đề"
            placeholder="VD: Cách thuê trọ giá rẻ tại Hồ Chí Minh"
            isRequired={true}
          />
          <CustomEditor
            form={form}
            placeholder="Nhập nội dung"
            id="content"
            label="Mô tả"
            isRequired={true}
          />
          <CustomDropbox
            onSelect={onSelect}
            errors={form.formState.errors}
            onRemove={onRemove}
            media={media}
            isMultiple={false}
          />
          <div className="flex items-center justify-center">
            <Button>Đăng tin</Button>
          </div>
        </Section>
      </form>
    </Form>
  )
}

export default UpdateNews
UpdateNews.propTypes = {
  news: PropTypes.any,
  setEditNews: PropTypes.func,
  refresh: PropTypes.func,
}

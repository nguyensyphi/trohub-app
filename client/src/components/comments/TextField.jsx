import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import classnames from "@/lib/classnames"
import PropTypes from "prop-types"
import { apiCreateNewComment } from "@/apis/post"
import { toast } from "sonner"

const FormSchema = z.object({
  content: z.string().min(1, { message: "Bạn phải nhập comment trước." }),
})

const TextField = ({ idPost, onMutate, isReply = false, idParent, onResetReply }) => {
  const form = useForm({
    defaultValues: {
      content: "",
    },
    resolver: zodResolver(FormSchema),
  })

  const onSubmit = async (data) => {
    const payload = {
      idPost,
      content: data.content,
    }
    if (isReply && idParent) payload.idParent = idParent
    const response = await apiCreateNewComment(payload)
    if (response.data.success) {
      toast.success(response.data.msg)
      onMutate()
      form.reset()
      if (onResetReply) onResetReply()
    } else toast.error(response.data.msg)
  }
  return (
    <Form {...form}>
      <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)} data-testid="comment-form">
        <FormField
          name="content"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  className={classnames.resetOutline}
                  {...field}
                  placeholder="Nhập nhận xét của bạn ở đây..."
                  data-testid={isReply ? "reply-textarea" : "comment-textarea"}
                  aria-label={isReply ? "Nội dung trả lời" : "Nội dung bình luận"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-end">
          <Button type="submit" data-testid={isReply ? "reply-submit-button" : "comment-submit-button"}>
            {!isReply ? "Gửi bình luận" : "Trả lời"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default TextField
TextField.propTypes = {
  idPost: PropTypes.number.isRequired,
  idParent: PropTypes.number,
  onMutate: PropTypes.func.isRequired,
  isReply: PropTypes.bool,
  onResetReply: PropTypes.func,
}

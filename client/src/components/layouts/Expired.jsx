import { useMeStore } from "@/zustand/useMeStore"
import PropTypes from "prop-types"
import ConditionRender from "./ConditionRender"
import { Form } from "../ui/form"
import { CustomInput } from "../forms"
import { useForm } from "react-hook-form"
import { Button } from "../ui/button"
import { shortNumber } from "@/lib/utils"
import moment from "moment"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { apiExpirePost } from "@/apis/user"
import { toast } from "sonner"

const FormSchema = z.object({
  days: z.number({
    required_error: "Trường này là bắt buộc.",
    invalid_type_error: "Mức giá phải là số.",
  }),
})

const Expired = ({ idPost, onCloseDialog, refresh }) => {
  const { me, getMe } = useMeStore()
  const form = useForm({
    defaultValues: {
      days: 1,
    },
    resolver: zodResolver(FormSchema),
  })

  const handlePayment = async (data) => {
    const total = data.days * parseInt(import.meta.env.VITE_PRICE_OF_POST_PER_DAY)
    if (total > me?.balance) return toast.info("Số dư không đủ để gia hạn.")
    data.total = total
    data.idPost = idPost
    const response = await apiExpirePost(data)
    if (response.data.success) {
      toast.success(response.data.msg)
      getMe()
      onCloseDialog()
      refresh()
    } else toast.error(response.data.msg)
  }

  return (
    <div className="">
      <p className="text-lg border-b p-4 font-bold">
        Gia hạn tin đăng <span className="text-primary">{`#${idPost}`}</span>
      </p>
      <div className="p-4 space-y-4">
        <ConditionRender show={me?.balance === 0}>
          <p className="text-center px-6 py-2 text-sm bg-blue-100 text-blue-600 border border-blue-500 rounded-md">
            Số dư trong tài khoản không đủ để thực hiện gia hạn. Bạn hãy nạp tiền trước!
            <span className="italic block">{`(Lưu ý: Giá ${Number(import.meta.env.VITE_PRICE_OF_POST_PER_DAY).toLocaleString()}đ cho 1 ngày)`}</span>
          </p>
        </ConditionRender>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handlePayment)} className="space-y-4">
            <CustomInput
              className="col-span-7"
              form={form}
              label="Số ngày muốn gia hạn"
              id="days"
              placeholder="VD: 7"
              type="number"
            />
            <div className="space-y-2 text-sm">
              <div className="col-span-3">{`Số tiền phải trả: ${shortNumber(
                form.watch("days") * 15000
              )} đồng`}</div>
              <div className="col-span-3">{`Ngày hết hạn tiếp theo: ${moment()
                .add(form.watch("days"), "days")
                .format("DD/MM/YYYY")}`}</div>
            </div>
            <div className="grid place-content-center mt-8">
              <Button disabled={me?.balance === 0} type="submit">
                Thanh toán
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default Expired
Expired.propTypes = {
  idPost: PropTypes.number.isRequired,
  refresh: PropTypes.func,
  onCloseDialog: PropTypes.func.isRequired,
}

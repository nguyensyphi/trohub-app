import PropTypes from "prop-types"
import { Form } from "@/components/ui/form"
import { CustomInput } from "@/components/forms"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import Section from "@/components/Section"
import { apiDepositMoney, apiDepositMoneyMomo } from "@/apis/user"

const PaymentMethod = ({ text, imageUrl }) => (
  <div className="px-4 cursor-pointer hover:bg-slate-50 h-full py-2 rounded-md bg-white flex items-center gap-4 border border-blue-600">
    <img src={imageUrl} alt="VN Pay" className="w-10 object-contain" />
    <p className="text-blue-600 font-bold">{text}</p>
  </div>
)

const formSchema = z.object({
  amount: z
    .number({ invalid_type_error: "Số tiền không hợp lệ." })
    .int({ message: "Số tiền phải là số nguyên." })
    .refine((val) => val >= 10000 && !isNaN(val), { message: "Số tiền tối thiểu 10.000" }),
})

const DepositVnpay = () => {
  const form = useForm({
    defaultValues: {
      amount: 0,
    },
    resolver: zodResolver(formSchema),
  })

  const handleDeposit = async (data, method = "vnpay") => {
    const response = method === "momo" ? await apiDepositMoneyMomo(data) : await apiDepositMoney(data)
    if (response.data.success) {
      window.open(response.data.paymentUrl, "_self")
    } else toast.error(response.data.msg)
  }

  const onSubmit = async (data) => {
    await handleDeposit(data, "vnpay")
  }

  return (
    <div className="w-[700px] max-w-full m-auto py-4 space-y-4">
      <Section title="Nạp tiền online (VNPay / MoMo)">
        <div className="space-y-4">
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <CustomInput type="number" form={form} id="amount" label="Số tiền (vnđ)" />
              <div className="flex items-center gap-3">
                <Button size="sm" type="submit">
                  Thanh toán VNPay
                </Button>
                <Button size="sm" type="button" variant="outline" onClick={form.handleSubmit((data) => handleDeposit(data, "momo"))}>
                  Thanh toán MoMo
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </Section>
    </div>
  )
}

export default DepositVnpay
PaymentMethod.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
}

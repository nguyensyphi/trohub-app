import { apiUserDeposit } from "@/apis/user"
import { PaypalButton } from "@/components/layouts"
import pathnames from "@/lib/pathnames"
import { shortNumber } from "@/lib/utils"
import { useMeStore } from "@/zustand/useMeStore"
import { useEffect } from "react"
import { Navigate, useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "sonner"

const PaymentOnBoarding = () => {
  const [searchParams] = useSearchParams()
  const { me, getMe } = useMeStore()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = "Trohub - Thanh toán Paypal"
  }, [])

  if (!me) {
    toast.warning("Bạn chưa đăng nhập.")
    return <Navigate to="/" />
  }

  const onSuccess = async () => {
    const response = await apiUserDeposit({ amount: searchParams.get("amount") })
    if (response.data.success) {
      toast.success(response.data.msg)
      getMe()
      setTimeout(() => {
        if (searchParams.get("redirect")) navigate(searchParams.get("redirect"))
        else navigate("/" + pathnames.owner.balanceInfo)
      }, 500)
    } else toast.error(response.data.msg)
  }

  return (
    <div className="w-screen h-screen overflow-hidden flex items-center justify-center flex-col">
      <img src="/payment.svg" alt="Payment" className="w-40" />
      <p className="py-4">
        Thanh toán cho khoản tiền:{" "}
        <span className="font-bold">{shortNumber(searchParams.get("amount"))}</span> VNĐ{" "}
        <span>{`(${
          Math.round((searchParams.get("amount") * 100) / +searchParams.get("rate")) / 100
        } USD)`}</span>
      </p>
      {+searchParams.get("amount") && (
        <PaypalButton
          onSuccess={onSuccess}
          number={Math.round((searchParams.get("amount") * 100) / +searchParams.get("rate")) / 100}
        />
      )}
    </div>
  )
}

export default PaymentOnBoarding

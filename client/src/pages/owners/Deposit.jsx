import { apiGetExchangeRate } from "@/apis/external"
import Section from "@/components/Section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import classnames from "@/lib/classnames"
import pathnames from "@/lib/pathnames"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { toast } from "sonner"

const Deposit = () => {
  const [rateUsd, setRateUsd] = useState(0)
  const [number, setNumber] = useState(0)
  const location = useLocation()
  useEffect(() => {
    const fetchRateMoney = async () => {
      const response = await apiGetExchangeRate()
      if (response.status === 200) {
        setRateUsd(response.data.conversion_rates.VND)
      } else setRateUsd(24000)
    }
    fetchRateMoney()
  }, [])

  const handlePayment = () => {
    if (!number || number === 0) return toast.warning("Vui lòng nhập số tiền!")
    window.open(
      pathnames.paymentOnBoarding +
        "?amount=" +
        number +
        `&redirect=${location.pathname.toString()}&rate=${rateUsd}`,
      "_blank"
    )
  }

  return (
    <div className={cn("space-y-4 p-4")}>
      <Section className="w-[700px]" title="Nạp tiền vào tài khoản">
        <div>
          <p className="p-4 text-sm text-blue-600 bg-blue-50 border border-blue-600 rounded-md w-4/5 mx-auto">
            NOTE: Hệ thống hiện đang hỗ trợ duy nhất công thanh toán bằng Paypal, nên sẽ thông qua hoán đổi
            tiền tệ USD-VND theo tỷ lệ được cập nhật mới nhất theo thị trường là 1 USD ={" "}
            <span className="font-bold">{Math.round(rateUsd) || 0}</span> VND
          </p>
          <div className="my-6 space-y-2">
            <Label>Nhập số tiền bạn muốn nạp (VND):</Label>
            <Input
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className={cn(classnames.resetOutline)}
              placeholder="VD: 1000000"
              type="number"
            />
            <small>
              Số tiền phải thanh toán:{" "}
              <span className="font-bold">{Math.round((number * 100) / rateUsd) / 100}</span> USD
            </small>
          </div>
          <Button onClick={handlePayment}>Xác nhận thanh toán</Button>
        </div>
      </Section>
    </div>
  )
}

export default Deposit

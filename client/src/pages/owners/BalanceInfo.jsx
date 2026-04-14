import Section from "@/components/Section"
import { Button } from "@/components/ui/button"
import pathnames from "@/lib/pathnames"
import { cn, shortNumber } from "@/lib/utils"
import { useMeStore } from "@/zustand/useMeStore"
import { Link } from "react-router-dom"

const BalanceInfo = () => {
  const { me } = useMeStore()
  return (
    <div className={cn("space-y-4 p-4")}>
      <Section className="w-[700px]" title="Thông tin số dư">
        <div>
          <p>Số tiền hiện tại trong tài khoản:</p>
          <p className="flex items-end gap-3">
            <span className="text-[48px] text-primary font-bold">{shortNumber(me.balance)}</span>
            <span className="relative bottom-[14px]">vnđ</span>
          </p>
          <p className="text-xs italic my-4">
            <span className="font-bold">NOTE:</span> Nếu muốn gia hạn tin đăng thì bạn phải đảm bảo đủ số dư
            trong tài khoản.
          </p>
          <Button onClick={(e) => e.stopPropagation()}>
            <Link to={"/" + pathnames.user.layout + pathnames.user.depositVnpay}>Đi tới nạp tiền</Link>
          </Button>
        </div>
      </Section>
    </div>
  )
}

export default BalanceInfo

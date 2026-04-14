import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import pathnames from "@/lib/pathnames"
import { BadgeCheck, CircleX } from "lucide-react"
import Confetti from "react-confetti"
import { useNavigate, useParams } from "react-router-dom"
import { useWindowSize } from "react-use"

const PaymentNotice = () => {
  const { width, height } = useWindowSize()
  const { code } = useParams()
  const navigate = useNavigate()
  return (
    <div className="h-screen bg-slate-100 grid place-content-center">
      {code === "00" && (
        <Confetti
          initialVelocityY={{ min: 1, max: 15 }}
          recycle={false}
          numberOfPieces={500}
          gravity={0.03}
          width={width}
          height={height}
        />
      )}
      {code === "00" && (
        <Card>
          <CardHeader className="grid place-content-center pb-2">
            <CardTitle className="my-4 grid place-content-center">
              <BadgeCheck className="text-green-600" size={28} />
            </CardTitle>
            <CardDescription className="text-2xl font-bold">Thanh toán thành công!</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center">Quá trình thanh toán của bạn đã hoàn tất.</p>
          </CardContent>
          <CardFooter className="flex items-center justify-center">
            <Button onClick={() => navigate("/" + pathnames.user.layout + pathnames.user.balanceInfo)}>
              Về trang cá nhân
            </Button>
          </CardFooter>
        </Card>
      )}
      {code !== "00" && (
        <Card>
          <CardHeader className="grid place-content-center pb-2">
            <CardTitle className="my-4 grid place-content-center">
              <CircleX className="text-red-600" size={28} />
            </CardTitle>
            <CardDescription className="text-2xl font-bold">Thanh toán không thành công!</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center">Quá trình thanh toán của bạn không thành công.</p>
          </CardContent>
          <CardFooter className="flex items-center justify-center">
            <Button onClick={() => navigate("/" + pathnames.user.layout + pathnames.user.balanceInfo)}>
              Về trang cá nhân
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

export default PaymentNotice

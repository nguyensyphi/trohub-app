import { useGetExpiredHistory } from "@/apis/user"
import { ConditionRender } from "@/components/layouts"
import { Pagination } from "@/components/paginations"
import Section from "@/components/Section"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import pathnames from "@/lib/pathnames"
import { cn } from "@/lib/utils"
import { ReceiptText } from "lucide-react"
import moment from "moment"
import { useState } from "react"
import { Link } from "react-router-dom"

const ExpiredHistory = () => {
  const { data } = useGetExpiredHistory()
  const [isShowDialog, setIsShowDialog] = useState(false)
  return (
    <div className={cn("space-y-4 p-4")}>
      <Section title="Lịch sử thanh toán gia hạn">
        <div className="h-full space-y-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Ngày thanh toán</TableHead>
                <TableHead className="w-[150px]">Mã hóa đơn</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="w-[150px]">Số tiền</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <ConditionRender show={data && data.payments}>
                {data?.payments?.map((el) => (
                  <TableRow key={el.id}>
                    <TableCell className="font-medium">{moment(el.createdAt).format("DD/MM/YY")}</TableCell>
                    <TableCell className="font-medium">{el.idInvoice}</TableCell>
                    <TableCell>{el.status}</TableCell>
                    <TableCell>{Number(el.total).toLocaleString().replaceAll(",", ".") + "đ"}</TableCell>
                    <TableCell className="text-right">
                      <Dialog open={isShowDialog} onOpenChange={setIsShowDialog}>
                        <DialogTrigger asChild>
                          <Button title="Xuất hóa đơn" variant="outline" size="sm">
                            <ReceiptText size={16} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg text-sm mx-auto p-6 bg-white rounded-lg border">
                          <DialogHeader className="text-center border-b pb-4">
                            <DialogTitle className="text-xl font-semibold">{`Hóa đơn #${el.idInvoice}`}</DialogTitle>
                            <DialogDescription className="text-sm text-gray-500">{`Ngày tạo: ${moment(
                              el.createdAt
                            ).format("DD/MM/YYYY")}`}</DialogDescription>
                          </DialogHeader>

                          <div className="mt-4 space-y-4">
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-700">Người thanh toán:</span>
                              <span>{el.rUser?.fullname}</span>
                            </div>

                            <div className="flex justify-between">
                              <span className="font-medium text-gray-700">ID bài đăng:</span>
                              <span>{el.idPost}</span>
                            </div>

                            <div className="flex justify-between gap-8">
                              <span className="font-medium w-fit flex-none whitespace-nowrap inline-block text-gray-700">
                                Tựa đề bài đăng:
                              </span>
                              <Link
                                to={"/" + pathnames.publics.detailPost + el.idPost}
                                className="text-right text-primary hover:underline"
                              >
                                {el.rPost?.title}
                              </Link>
                            </div>

                            <div className="flex justify-between">
                              <span className="font-medium text-gray-700">Số ngày gia hạn:</span>
                              <span>{el.days} ngày</span>
                            </div>

                            <div className="flex justify-between">
                              <span className="font-medium text-gray-700">Ngày hết hạn tiếp theo:</span>
                              <span>{moment(el.rPost?.expiredDate).format("DD/MM/YYYY")}</span>
                            </div>

                            <div className="flex justify-between">
                              <span className="font-medium text-gray-700">Trạng thái:</span>
                              <span
                                className={`${
                                  el.status === "Thành công" ? "text-green-600" : "text-red-600"
                                } font-semibold`}
                              >
                                {el.status}
                              </span>
                            </div>

                            <div className="flex justify-between">
                              <span className="font-medium text-gray-700">Tổng tiền:</span>
                              <span className="font-semibold text-lg">
                                {Number(el.total).toLocaleString().replaceAll(",", ".") + "đ"}
                              </span>
                            </div>
                          </div>

                          <div className="mt-6 text-center">
                            <Button
                              onClick={() => setIsShowDialog(false)}
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              Đóng
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </ConditionRender>
            </TableBody>
          </Table>
          {data?.pagination && <Pagination {...data.pagination} />}
        </div>
      </Section>
    </div>
  )
}

export default ExpiredHistory

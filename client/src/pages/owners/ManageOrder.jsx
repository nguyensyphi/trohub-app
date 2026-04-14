import { apiDeleteOrder, apiPublicPost, useGetOrdersByOwner } from "@/apis/post"
import { ConditionRender } from "@/components/layouts"
import Section from "@/components/Section"
import CustomTooltip from "@/components/tooltips/Tooltip"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import classnames from "@/lib/classnames"
import { sortBy, statusArray } from "@/lib/constant"
import pathnames from "@/lib/pathnames"
import { cn, shortNumber } from "@/lib/utils"
import { useMeStore } from "@/zustand/useMeStore"
import { Eye, Rss, Trash2 } from "lucide-react"
import moment from "moment"
import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "sonner"

const ManageOrder = () => {
  const [status, setStatus] = useState("Tất cả")
  const [sort, setSort] = useState("updatedAt,desc")
  const [showOrderId, setShowOrderId] = useState(null)
  const { me, getMe } = useMeStore()

  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()

  const { data, mutate } = useGetOrdersByOwner(searchParams)

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams.toString())

    // Set limit and title
    newParams.set("limit", "6")
    newParams.set("page", "1")

    // Set status
    if (status && status !== "Tất cả") {
      newParams.delete("status")
      newParams.append("status", status)
    } else {
      newParams.delete("status")
    }

    // Set sort
    if (sort) {
      const orderOffset = sort.split(",")
      newParams.set("sort", orderOffset[0])
      newParams.set("order", orderOffset[1])
    } else {
      newParams.delete("sort")
      newParams.delete("order")
    }

    // Cập nhật searchParams và gọi API
    setSearchParams(newParams)
    navigate({
      pathname: location.pathname,
      search: newParams.toString(),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, status, sort])

  const handlePaymentAndPublic = async ({ orderedDays, id, idPost, total }) => {
    if (me?.balance < total) {
      return toast.info("Số dư không đủ để thanh toán. Vui lòng nạp tiền vào tài khoản trước!")
    }
    const response = await apiPublicPost(id, { orderedDays, idPost, total })
    if (response.data.success) {
      toast.success(response.data.msg)
      mutate()
      getMe()
    } else toast.error(response.data.msg)
  }

  const handleDeleteOrder = async (id) => {
    const response = await apiDeleteOrder(id)
    if (response.data.success) {
      toast.success(response.data.msg)
      mutate()
    } else toast.error(response.data.msg)
  }

  return (
    <div className={cn("space-y-4 h-full p-4")}>
      <Section title="Quản lý hóa đơn">
        <div className="relative space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm font-medium leading-none">
                Sắp xếp:
              </label>
              <Select defaultValue="createdAt,desc" value={sort} onValueChange={setSort}>
                <SelectTrigger className={cn("w-[150px] h-8", classnames.resetOutline)}>
                  <SelectValue placeholder="Mới nhất" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {sortBy.map((el) => (
                      <SelectItem key={el.value} value={el.value}>
                        {el.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm font-medium leading-none">
                Trạng thái:
              </label>
              <Select defaultValue="createdAt,desc" value={status} onValueChange={setStatus}>
                <SelectTrigger className={cn("w-[150px] h-8", classnames.resetOutline)}>
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {statusArray.map((el) => (
                      <SelectItem key={el.value} value={el.value}>
                        {el.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Mã hóa đơn</TableHead>
                <TableHead>Tin đăng</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Số ngày đặt</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead className="w-[150px]">Trạng thái tin đăng</TableHead>
                <TableHead className="w-[150px]">Trạng thái thanh toán</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.orders?.map((el) => (
                <TableRow key={el.id}>
                  <TableCell>{el.idInvoice}</TableCell>
                  <TableCell className="line-clamp-1 leading-[60px]">{el.rPost?.title}</TableCell>
                  <TableCell>{moment(el.createdAt).format("DD/MM/YY")}</TableCell>
                  <TableCell>{el.orderedDays}</TableCell>
                  <TableCell className="whitespace-nowrap">{shortNumber(el.total)}</TableCell>
                  {/* <TableCell>
                    {el.confirmedDate ? moment(el.confirmedDate).format("DD/MM/YY") : "N/A"}
                  </TableCell>
                  <TableCell>{el.expiredDate ? moment(el.expiredDate).format("DD/MM/YY") : "N/A"}</TableCell> */}
                  <TableCell
                    className={cn(
                      el.rPost?.status === "Từ chối"
                        ? "text-red-500"
                        : el.rPost?.status === "Đã duyệt"
                        ? "text-green-500"
                        : "text-slate-500"
                    )}
                  >
                    {el.rPost?.status}
                  </TableCell>
                  <TableCell
                    className={cn(
                      el.status === "Thất bại"
                        ? "text-red-500"
                        : el.status === "Thành công"
                        ? "text-green-500"
                        : "text-orange-500"
                    )}
                  >
                    {el.status}
                  </TableCell>
                  <TableCell className="text-right flex items-center justify-end gap-4">
                    {el.rPost?.status === "Đã duyệt" && el.status === "Đang chờ" && (
                      <CustomTooltip explain="Thanh toán và công khai tin đăng">
                        <Rss
                          onClick={() =>
                            handlePaymentAndPublic({
                              idPost: el.idPost,
                              id: el.id,
                              orderedDays: el.orderedDays,
                              total: el.total,
                            })
                          }
                          size={14}
                          className="text-green-500 cursor-pointer"
                        />
                      </CustomTooltip>
                    )}
                    <ConditionRender show={el.status === "Thành công"}>
                      <CustomTooltip explain="Xem chi tiết hóa đơn">
                        <Dialog
                          open={showOrderId === el.id}
                          onOpenChange={(open) => (open ? setShowOrderId(el.id) : setShowOrderId(null))}
                        >
                          <DialogTrigger>
                            <Eye
                              onClick={() => setShowOrderId(el.id)}
                              size={14}
                              className="text-blue-500 cursor-pointer"
                            />
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
                                <span className="font-medium text-gray-700">Số ngày đặt:</span>
                                <span>{el.orderedDays} ngày</span>
                              </div>

                              <div className="flex justify-between">
                                <span className="font-medium text-gray-700">Ngày duyệt tin:</span>
                                <span>{moment(el.confirmedDate).format("DD/MM/YYYY")}</span>
                              </div>

                              <div className="flex justify-between">
                                <span className="font-medium text-gray-700">Ngày bắt đầu:</span>
                                <span>
                                  {moment(
                                    new Date(el.expiredDate) - el.orderedDays * 24 * 3600 * 1000
                                  ).format("DD/MM/YYYY")}
                                </span>
                              </div>

                              <div className="flex justify-between">
                                <span className="font-medium text-gray-700">Ngày hết hạn tiếp theo:</span>
                                <span>{moment(el.expiredDate).format("DD/MM/YYYY")}</span>
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
                                onClick={() => setShowOrderId(null)}
                                variant="outline"
                                size="sm"
                                className="w-full"
                              >
                                Đóng
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </CustomTooltip>
                    </ConditionRender>
                    <Trash2 onClick={() => handleDeleteOrder(el.id)} size={14} className="text-red-500" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Section>
    </div>
  )
}

export default ManageOrder

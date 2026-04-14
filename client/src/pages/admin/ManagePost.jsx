import { apiDeletePostAdmin, apiUpdateStatusAdmin, useGetPostByAdmin } from "@/apis/post"
import CustomSelect from "@/components/forms/CustomSelect"
import { Pagination } from "@/components/paginations"
import Section from "@/components/Section"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
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
import { cn } from "@/lib/utils"
import { Edit, LoaderCircle, Trash2 } from "lucide-react"
import moment from "moment"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

const FormSchema = z.object({
  status: z.string().min(1, { message: "Trường này là bắt buộc." }),
})

const ManagePost = () => {
  const [status, setStatus] = useState("Tất cả")
  const [sort, setSort] = useState("updatedAt,desc")
  const [editPost, setEditPost] = useState(null)

  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    defaultValues: {
      status: "",
    },
    resolver: zodResolver(FormSchema),
  })

  const { data, mutate } = useGetPostByAdmin(searchParams)

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

  useEffect(() => {
    if (editPost) {
      form.setValue("status", editPost.status)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editPost])

  const handleDeletePost = async (id) => {
    const response = await apiDeletePostAdmin(id)
    if (response.data.success) {
      toast.success(response.data.msg)
      mutate()
    } else toast.error(response.data.msg)
  }

  const handleUpdateStatus = async ({ idPost, data }) => {
    setIsLoading(true)
    const response = await apiUpdateStatusAdmin(idPost, data)
    setIsLoading(false)
    if (response.data.success) {
      toast.success(response.data.msg)
      setEditPost(null)
      mutate()
    } else toast.error(response.data.msg)
  }

  return (
    <div className={cn("space-y-4 h-full p-4")}>
      <Section title="Quản lý tin đăng Admin">
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
                <TableHead className="w-[50px]">STT</TableHead>
                <TableHead>Tên tin đăng</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Tác giả</TableHead>
                <TableHead>Ngày hết hạn</TableHead>
                <TableHead className="w-[150px]">Trạng thái</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.posts?.map((el, idx) => (
                <TableRow key={el.id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell className="line-clamp-1 leading-[60px]">{el.title}</TableCell>
                  <TableCell>{moment(el.createdAt).format("DD/MM/YY")}</TableCell>
                  <TableCell>{el.postedBy?.fullname}</TableCell>
                  <TableCell>
                    {el.expiredDate ? moment(el.expiredDate).format("DD/MM/YYYY") : "N/A"}
                  </TableCell>
                  <TableCell
                    className={cn(
                      el.status === "Từ chối"
                        ? "text-red-500"
                        : el.status === "Đã duyệt"
                        ? "text-green-500"
                        : "text-slate-500"
                    )}
                  >
                    {el.status}
                  </TableCell>
                  <TableCell className="text-right flex items-center justify-end gap-4">
                    <Dialog
                      open={editPost?.id === el.id}
                      onOpenChange={(open) => (open ? setEditPost(el) : setEditPost(null))}
                    >
                      <DialogTrigger>
                        <Edit onClick={() => setEditPost(el)} size={14} className="text-blue-500" />
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="border-b pb-4">
                            Cập nhật trạng thái tin đăng{" "}
                            <span className="font-bold text-primary">{`ID ${el.id}`}</span>
                          </DialogTitle>
                          <div className="p-4 space-y-4">
                            <Form {...form}>
                              <CustomSelect
                                id="status"
                                form={form}
                                label="Trạng thái"
                                options={statusArray.filter((el) => el.label !== "Tất cả")}
                              />
                              <div className="grid place-content-center">
                                <Button
                                  onClick={form.handleSubmit((data) =>
                                    handleUpdateStatus({
                                      idPost: el.id,
                                      data: { ...data, idOrder: el.rOrder?.id },
                                    })
                                  )}
                                  disabled={isLoading}
                                >
                                  {isLoading && <LoaderCircle className="animate-spin" size={16} />}
                                  Cập nhật
                                </Button>
                              </div>
                            </Form>
                          </div>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                    <Trash2 onClick={() => handleDeletePost(el.id)} size={14} className="text-red-500" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {data?.pagination && <Pagination {...data.pagination} />}
        </div>
      </Section>
    </div>
  )
}

export default ManagePost

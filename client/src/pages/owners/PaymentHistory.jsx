import { useGetPaymentHistory } from "@/apis/user"
import { ConditionRender } from "@/components/layouts"
import { Pagination } from "@/components/paginations"
import Section from "@/components/Section"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import moment from "moment"

const PaymentHistory = () => {
  const { data } = useGetPaymentHistory()

  return (
    <div className={cn("space-y-4 p-4")}>
      <Section className="h-full" title="Lịch sử nạp tiền">
        <div className="h-full space-y-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-fit">Ngày thanh toán</TableHead>
                <TableHead className="w-fit">Mã hóa đơn</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Phương thức</TableHead>
                <TableHead className="text-right">Số tiền</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <ConditionRender show={data && data.payments}>
                {data?.payments?.map((el) => (
                  <TableRow key={el.id}>
                    <TableCell className="font-medium">{moment(el.createdAt).format("DD/MM/YY")}</TableCell>
                    <TableCell className="font-medium">{el.idInvoice}</TableCell>
                    <TableCell>{el.status}</TableCell>
                    <TableCell>{el.method}</TableCell>
                    <TableCell className="text-right">
                      {Number(el.amount).toLocaleString().replaceAll(",", ".") + "đ"}
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

export default PaymentHistory

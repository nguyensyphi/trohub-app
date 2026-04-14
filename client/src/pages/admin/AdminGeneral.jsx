/* eslint-disable no-unsafe-optional-chaining */
import { useEffect, useState } from "react"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
} from "chart.js"
import { Line, Pie } from "react-chartjs-2"
import { apiGetDashboard } from "@/apis/user"
import {
  cn,
  getDaysInMonth,
  getDaysInRange,
  getMonthInYear,
  getMonthsInRange,
  shortNumber,
} from "@/lib/utils"
import Section from "@/components/Section"
import { EyeIcon, List, User2, Wallet } from "lucide-react"
ChartJS.register(ArcElement, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale)
const AdminGeneral = () => {
  const [data, setData] = useState(null)
  const [isMonth, setIsMonth] = useState(false)
  const [customTime, setCustomTime] = useState({
    from: "",
    to: "",
  })
  const [chartData, setChartData] = useState([])
  const fetchDashboard = async (params) => {
    const response = await apiGetDashboard(params)
    if (response.data.success) setData(response.data.data)
  }
  useEffect(() => {
    const type = isMonth ? "month" : "day"
    const params = { type }
    if (customTime.from) params.from = customTime.from
    if (customTime.to) params.to = customTime.to
    fetchDashboard(params)
  }, [isMonth, customTime])

  useEffect(() => {
    const number = isMonth
      ? getMonthsInRange(customTime?.from, customTime?.to)
      : getDaysInRange(customTime?.from, customTime?.to)
    const daysInMonth = getDaysInMonth(customTime?.to, number)
    const monthsInYear = getMonthInYear(customTime?.to, number)
    const rawData = isMonth ? monthsInYear : daysInMonth
    const editedData = rawData.map((el) => {
      return {
        createdPost: data?.posts?.some((i) => i.date === el)
          ? data?.posts.find((i) => i.date === el)?.createdPost
          : 0,
        date: el,
      }
    })
    setChartData(editedData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.posts])

  const options = {
    responsive: true,
    pointRadius: 0,
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: { display: true },
        grid: { color: "rgba(0,0,0,0.1)", drawTicks: false },
        min:
          Math.min(...chartData?.map((el) => +el.createdPost)) - 5 < 0
            ? 0
            : Math.min(...chartData?.map((el) => +el.createdPost)) - 5,
        max: Math.max(...chartData?.map((el) => +el.createdPost)) + 5,
        border: { dash: [20, 0] },
      },
      x: {
        ticks: { color: "black" },
        grid: { color: "transparent" },
      },
    },
    plugins: {
      legend: false,
    },
    hover: {
      mode: "dataset",
      intersect: false,
    },
  }

  const handleCustomTime = () => {
    setCustomTime({ from: "", to: "" })
  }
  const pieData = {
    labels: ["Người chưa đăng ký", "Người đã đăng ký"],
    datasets: [
      {
        label: "Lượt truy cập",
        data: [data?.anonymous, data?.registed],
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  }
  return (
    <section className={cn("space-y-4 p-4")}>
      <Section title="Tổng quan">
        <div className="py-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1 bg-blue-500 p-4 border rounded-md flex items-center justify-between gap-4">
              <span className="text-3xl font-bold text-slate-50">{data?.createdUser}</span>
              <span className="flex text-white flex-col gap-2 items-end">
                <span>
                  <User2 className="text-white" size={20} />
                </span>
                <span>Thành viên mới</span>
              </span>
            </div>
            <div className="col-span-1 bg-orange-500 p-4 border rounded-md flex items-center justify-between gap-4">
              <span className="text-3xl font-bold text-slate-50">{shortNumber(+data?.totalIncomes)}</span>
              <span className="flex text-white flex-col gap-2 items-end">
                <span>
                  <Wallet size={20} />
                </span>
                <span>Thu nhập</span>
              </span>
            </div>
            <div className="col-span-1 bg-green-500 p-4 border rounded-md flex items-center justify-between gap-4">
              <span className="text-3xl font-bold text-slate-50">
                {data?.posts?.reduce((sum, el) => sum + Number(el.createdPost), 0)}
              </span>
              <span className="flex text-slate-50 flex-col gap-2 items-end">
                <span>
                  <List size={24} />
                </span>
                <span>Bài đăng mới</span>
              </span>
            </div>
            <div className="col-span-1 bg-yellow-500 p-4 border rounded-md flex items-center justify-between gap-4">
              <span className="text-3xl font-bold text-slate-50">{data?.anonymous + data?.registed}</span>
              <span className="flex text-slate-50 flex-col gap-2 items-end">
                <span>
                  <EyeIcon size={20} />
                </span>
                <span>Lượt truy cập</span>
              </span>
            </div>
          </div>
        </div>
        <div className="mt-6 px-4 grid grid-cols-10 gap-4">
          <div className="col-span-7 h-fit border flex flex-col gap-4 relative rounded-md flex-auto p-4">
            <span className="font-bold">{`Số tin đăng mới thống kê theo ${isMonth ? "tháng" : "ngày"}`}</span>
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-8">
                <div className="flex items-center font-thin gap-8">
                  <span className="flex items-center gap-2">
                    <label htmlFor="from">Từ</label>
                    <input
                      type="date"
                      value={customTime.from}
                      onChange={(e) => setCustomTime((prev) => ({ ...prev, from: e.target.value }))}
                      id="from"
                    />
                  </span>
                  <span className="flex items-center gap-2">
                    <label htmlFor="from">Đến</label>
                    <input
                      type="date"
                      value={customTime.to}
                      onChange={(e) => setCustomTime((prev) => ({ ...prev, to: e.target.value }))}
                      id="to"
                    />
                  </span>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-md border-blue-500 text-blue-500 border`}
                    onClick={handleCustomTime}
                  >
                    Default
                  </button>
                </div>
              </span>
              <span className="flex items-center">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md border ${
                    isMonth ? "" : "text-white font-semibold bg-primary"
                  }`}
                  onClick={() => setIsMonth(false)}
                >
                  Ngày
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md border ${
                    isMonth ? "text-white font-semibold bg-primary" : ""
                  }`}
                  onClick={() => setIsMonth(true)}
                >
                  Tháng
                </button>
              </span>
            </div>
            {chartData ? (
              <div className="chart-container">
                <Line
                  options={options}
                  data={{
                    labels: chartData?.map((el) => el.date),
                    datasets: [
                      {
                        data: chartData?.map((el) => +el.createdPost),
                        borderColor: "#e35050",
                        tension: 0.2,
                        borderWidth: 2,
                        pointBackgroundColor: "white",
                        pointHoverRadius: 4,
                        pointBorderColor: "#e35050",
                        pointHoverBorderWidth: 4,
                      },
                    ],
                  }}
                />
              </div>
            ) : (
              <span>Không có tin đăng nào.</span>
            )}
          </div>
          <div className="col-span-3 rounded-md border p-4">
            <span className="font-bold gap-8">Số người truy cập chưa đăng ký và đã đăng ký</span>
            <div>
              <Pie data={pieData} />;
            </div>
          </div>
        </div>
      </Section>
    </section>
  )
}

export default AdminGeneral

import { FilePenLine, LayoutList, Newspaper, ReceiptText, UserRound, UsersRound, Wallet } from "lucide-react"
import pathnames from "./pathnames"

export const navigations = [
  {
    pathname: "",
    label: "Trang chủ",
    id: 1,
  },
  {
    pathname: pathnames.publics.layout + pathnames.publics.chothuephongtro,
    label: "Cho thuê phòng trọ",
    id: 2,
  },
  {
    pathname: pathnames.publics.layout + pathnames.publics.nhachothue,
    label: "Nhà cho thuê",
    id: 3,
  },
  {
    pathname: pathnames.publics.layout + pathnames.publics.chothuecanho,
    label: "Cho thuê căn hộ",
    id: 4,
  },
  {
    pathname: pathnames.publics.layout + pathnames.publics.news,
    label: "Tin tức",
    id: 5,
  },
]
export const userMenu = [
  {
    id: 3,
    label: "Cá nhân",
    path: pathnames.user.layout + pathnames.user.personal,
    icon: <UserRound size="14" />,
    hasSubs: true,
    subs: [
      {
        id: 31,
        label: "Thông tin cá nhân",
        path: pathnames.user.layout + pathnames.user.personal,
      },
      {
        id: 32,
        label: "Cập nhật số điện thoại",
        path: pathnames.user.layout + pathnames.user.changePhone,
      },
      {
        id: 33,
        label: "Cập nhật email",
        path: pathnames.user.layout + pathnames.user.changeEmail,
      },
      {
        id: 34,
        label: "Tin đăng yêu thích",
        path: pathnames.user.layout + pathnames.user.wishlist,
      },
      {
        id: 35,
        label: "Tin đăng đã xem",
        path: pathnames.user.layout + pathnames.user.seenPost,
      },
    ],
  },
  {
    id: 5,
    label: "Quản lý số dư",
    path: pathnames.user.layout + pathnames.user.balanceInfo,
    icon: <Wallet size="14" />,
    hasSubs: true,
    subs: [
      {
        id: 41,
        label: "Thông tin số dư",
        path: pathnames.user.layout + pathnames.user.balanceInfo,
      },
      {
        id: 42,
        label: "Lịch sử thanh toán",
        path: pathnames.user.layout + pathnames.user.paymentHistory,
      },
      {
        id: 43,
        label: "Lịch sử gia hạn",
        path: pathnames.user.layout + pathnames.user.expiredHistory,
      },
      {
        id: 44,
        label: "Nạp tiền VNPay",
        path: pathnames.user.layout + pathnames.user.depositVnpay,
      },
      // {
      //   id: 45,
      //   label: "Nạp tiền Paypal",
      //   path: pathnames.user.layout + pathnames.user.deposit,
      // },
    ],
  },
]
export const ownerMenu = [
  ...userMenu,
  {
    id: -20,
    label: "Quản lý hóa đơn",
    path: pathnames.owner.layout + pathnames.owner.manageOrder,
    icon: <ReceiptText size="14" />,
    hasSubs: false,
  },
  {
    id: 4,
    label: "Tin đăng của bạn",
    path: pathnames.owner.layout + pathnames.owner.managePost,
    icon: <FilePenLine size="14" />,
    hasSubs: true,
    subs: [
      {
        id: 42,
        label: "Tạo mới tin đăng",
        path: pathnames.owner.layout + pathnames.owner.createPost,
      },
      {
        id: 43,
        label: "Quản lý tin đăng",
        path: pathnames.owner.layout + pathnames.owner.managePost,
      },
    ],
  },
]
export const adminMenu = [
  {
    id: 1,
    label: "Tổng quan",
    path: pathnames.admin.layout + pathnames.admin.general,
    icon: <LayoutList size="14" />,
    hasSubs: false,
  },
  ...userMenu,
  {
    id: -2,
    label: "Quản lý thành viên",
    path: pathnames.admin.layout + pathnames.admin.manageUser,
    icon: <UsersRound size="14" />,
    hasSubs: false,
  },
  {
    id: 4,
    label: "Quản lý tin đăng",
    path: pathnames.admin.layout + pathnames.owner.managePost,
    icon: <FilePenLine size="14" />,
    hasSubs: false,
  },
  {
    id: 4555,
    label: "Tin tức",
    path: pathnames.admin.layout + pathnames.admin.manageNews,
    icon: <Newspaper size="14" />,
    hasSubs: true,
    subs: [
      {
        id: 401,
        label: "Tạo mới tin tức",
        path: pathnames.admin.layout + pathnames.admin.createNews,
      },
      {
        id: 402,
        label: "Quản lý tin tức",
        path: pathnames.admin.layout + pathnames.admin.manageNews,
      },
    ],
  },
]
export const provinceTops = [
  { id: "01", path: "/jpg/hanoi.jpg", name: "Hà nội" },
  { id: "79", path: "/jpg/hcm.jpg", name: "Hồ Chí Minh" },
  { id: "48", path: "/jpg/danang.jpg", name: "Đà nẵng" },
  { id: "74", path: "/jpg/binhduong.jpg", name: "Bình Dương" },
  { id: "56", path: "/jpg/nhatrang.jpg", name: "Nha Trang" },
  { id: "75", path: "/jpg/dongnai.jpg", name: "Đồng Nai" },
]
export const sizes = [
  {
    id: -1,
    label: "Tất cả diện tích",
    value: "ALL",
  },
  {
    id: 1,
    label: "Dưới 20 m²",
    value: JSON.stringify([0, 20]),
  },
  {
    id: 2,
    label: "Từ 20 - 30 m²",
    value: JSON.stringify([20, 30]),
  },
  {
    id: 3,
    label: "Từ 30 - 50 m²",
    value: JSON.stringify([30, 50]),
  },
  {
    id: 4,
    label: "Từ 50 - 70 m²",
    value: JSON.stringify([50, 70]),
  },
  {
    id: 5,
    label: "Từ 70 - 100 m²",
    value: JSON.stringify([70, 100]),
  },
  {
    id: 6,
    label: "Từ 100 - 130 m²",
    value: JSON.stringify([100, 130]),
  },
  {
    id: 7,
    label: "Từ 130 - 150 m²",
    value: JSON.stringify([130, 150]),
  },
  {
    id: 50,
    label: "Trên 150 m²",
    value: JSON.stringify(["gt", 150]),
  },
]
export const prices = [
  {
    id: -1,
    label: "Tất cả mức giá",
    value: "ALL",
  },
  {
    id: 1,
    label: "Dưới 1 triệu",
    value: JSON.stringify([0, Math.pow(10, 6)]),
  },
  {
    id: 2,
    label: "Từ 1 - 2 triệu",
    value: JSON.stringify([1 * Math.pow(10, 6), 2 * Math.pow(10, 6)]),
  },
  {
    id: 3,
    label: "Từ 2 - 3 triệu",
    value: JSON.stringify([2 * Math.pow(10, 6), 3 * Math.pow(10, 6)]),
  },
  {
    id: 4,
    label: "Từ 3 - 5 triệu",
    value: JSON.stringify([3 * Math.pow(10, 6), 5 * Math.pow(10, 6)]),
  },
  {
    id: 5,
    label: "Từ 5 - 7 triệu",
    value: JSON.stringify([5 * Math.pow(10, 6), 7 * Math.pow(10, 6)]),
  },
  {
    id: 6,
    label: "Từ 7 - 10 triệu",
    value: JSON.stringify([7 * Math.pow(10, 6), 10 * Math.pow(10, 6)]),
  },
  {
    id: 7,
    label: "Từ 10 - 15 triệu",
    value: JSON.stringify([10 * Math.pow(10, 6), 15 * Math.pow(10, 6)]),
  },
  {
    id: 50,
    label: "Trên 15 triệu",
    value: JSON.stringify(["gt", 15 * Math.pow(10, 6)]),
  },
]
export const convenients = [
  "Điều hòa",
  "Máy giặt",
  "Wifi miễn phí",
  "Nhà để xe",
  "Thiết bị báo cháy",
  "Hệ thống cách âm",
]
export const sortBy = [
  {
    value: "updatedAt,asc",
    label: "Cũ nhất",
  },
  {
    value: "updatedAt,desc",
    label: "Mới nhất",
  },
  {
    value: "expiredDate,desc",
    label: "Thời gian hết hạn",
  },
  {
    value: "price,asc",
    label: "Giá tăng dần",
  },
  {
    value: "price,desc",
    label: "Giá giảm dần",
  },
  {
    value: "title,asc",
    label: "Từ A đến Z",
  },
  {
    value: "title,desc",
    label: "Từ Z đến A",
  },
]
export const statusArray = ["Tất cả", "Đã duyệt", "Đang chờ duyệt", "Từ chối"].map((el) => ({
  label: el,
  value: el,
}))
export const genders = [
  { label: "Tất cả", value: "Tất cả" },
  { label: "Nam", value: "Nam" },
  { label: "Nữ", value: "Nữ" },
  { label: "Khác", value: "Khác" },
]
export const provincesArr = [
  {
    idProvince: "01",
    name: "Thành phố Hà Nội",
  },
  {
    idProvince: "79",
    name: "Thành phố Hồ Chí Minh",
  },
  {
    idProvince: "31",
    name: "Thành phố Hải Phòng",
  },
  {
    idProvince: "48",
    name: "Thành phố Đà Nẵng",
  },
  {
    idProvince: "92",
    name: "Thành phố Cần Thơ",
  },
  {
    idProvince: "02",
    name: "Tỉnh Hà Giang",
  },
  {
    idProvince: "04",
    name: "Tỉnh Cao Bằng",
  },
  {
    idProvince: "06",
    name: "Tỉnh Bắc Kạn",
  },
  {
    idProvince: "08",
    name: "Tỉnh Tuyên Quang",
  },
  {
    idProvince: "10",
    name: "Tỉnh Lào Cai",
  },
  {
    idProvince: "11",
    name: "Tỉnh Điện Biên",
  },
  {
    idProvince: "12",
    name: "Tỉnh Lai Châu",
  },
  {
    idProvince: "14",
    name: "Tỉnh Sơn La",
  },
  {
    idProvince: "15",
    name: "Tỉnh Yên Bái",
  },
  {
    idProvince: "17",
    name: "Tỉnh Hoà Bình",
  },
  {
    idProvince: "19",
    name: "Tỉnh Thái Nguyên",
  },
  {
    idProvince: "20",
    name: "Tỉnh Lạng Sơn",
  },
  {
    idProvince: "22",
    name: "Tỉnh Quảng Ninh",
  },
  {
    idProvince: "24",
    name: "Tỉnh Bắc Giang",
  },
  {
    idProvince: "25",
    name: "Tỉnh Phú Thọ",
  },
  {
    idProvince: "26",
    name: "Tỉnh Vĩnh Phúc",
  },
  {
    idProvince: "27",
    name: "Tỉnh Bắc Ninh",
  },
  {
    idProvince: "30",
    name: "Tỉnh Hải Dương",
  },
  {
    idProvince: "33",
    name: "Tỉnh Hưng Yên",
  },
  {
    idProvince: "34",
    name: "Tỉnh Thái Bình",
  },
  {
    idProvince: "35",
    name: "Tỉnh Hà Nam",
  },
  {
    idProvince: "36",
    name: "Tỉnh Nam Định",
  },
  {
    idProvince: "37",
    name: "Tỉnh Ninh Bình",
  },
  {
    idProvince: "38",
    name: "Tỉnh Thanh Hóa",
  },
  {
    idProvince: "40",
    name: "Tỉnh Nghệ An",
  },
  {
    idProvince: "42",
    name: "Tỉnh Hà Tĩnh",
  },
  {
    idProvince: "44",
    name: "Tỉnh Quảng Bình",
  },
  {
    idProvince: "45",
    name: "Tỉnh Quảng Trị",
  },
  {
    idProvince: "46",
    name: "Tỉnh Thừa Thiên Huế",
  },
  {
    idProvince: "49",
    name: "Tỉnh Quảng Nam",
  },
  {
    idProvince: "51",
    name: "Tỉnh Quảng Ngãi",
  },
  {
    idProvince: "52",
    name: "Tỉnh Bình Định",
  },
  {
    idProvince: "54",
    name: "Tỉnh Phú Yên",
  },
  {
    idProvince: "56",
    name: "Tỉnh Khánh Hòa",
  },
  {
    idProvince: "58",
    name: "Tỉnh Ninh Thuận",
  },
  {
    idProvince: "60",
    name: "Tỉnh Bình Thuận",
  },
  {
    idProvince: "62",
    name: "Tỉnh Kon Tum",
  },
  {
    idProvince: "64",
    name: "Tỉnh Gia Lai",
  },
  {
    idProvince: "66",
    name: "Tỉnh Đắk Lắk",
  },
  {
    idProvince: "67",
    name: "Tỉnh Đắk Nông",
  },
  {
    idProvince: "68",
    name: "Tỉnh Lâm Đồng",
  },
  {
    idProvince: "70",
    name: "Tỉnh Bình Phước",
  },
  {
    idProvince: "72",
    name: "Tỉnh Tây Ninh",
  },
  {
    idProvince: "74",
    name: "Tỉnh Bình Dương",
  },
  {
    idProvince: "75",
    name: "Tỉnh Đồng Nai",
  },
  {
    idProvince: "77",
    name: "Tỉnh Bà Rịa - Vũng Tàu",
  },
  {
    idProvince: "80",
    name: "Tỉnh Long An",
  },
  {
    idProvince: "82",
    name: "Tỉnh Tiền Giang",
  },
  {
    idProvince: "83",
    name: "Tỉnh Bến Tre",
  },
  {
    idProvince: "84",
    name: "Tỉnh Trà Vinh",
  },
  {
    idProvince: "86",
    name: "Tỉnh Vĩnh Long",
  },
  {
    idProvince: "87",
    name: "Tỉnh Đồng Tháp",
  },
  {
    idProvince: "89",
    name: "Tỉnh An Giang",
  },
  {
    idProvince: "91",
    name: "Tỉnh Kiên Giang",
  },
  {
    idProvince: "93",
    name: "Tỉnh Hậu Giang",
  },
  {
    idProvince: "94",
    name: "Tỉnh Sóc Trăng",
  },
  {
    idProvince: "95",
    name: "Tỉnh Bạc Liêu",
  },
  {
    idProvince: "96",
    name: "Tỉnh Cà Mau",
  },
]
export const priorities = [
  {
    id: 1,
    label: "Kim Cương",
    value: "5",
    price: "100000",
  },
  {
    id: 2,
    label: "Bạch Kim",
    value: "4",
    price: "80000",
  },
  {
    id: 3,
    label: "Vàng",
    value: "3",
    price: "60000",
  },
  {
    id: 4,
    label: "Bạc",
    value: "2",
    price: "40000",
  },
  {
    id: 5,
    label: "Đồng",
    value: "1",
    price: "20000",
  },
  {
    id: 6,
    label: "Thường",
    value: "0",
    price: "10000",
  },
]
export const postTypes = [
  {
    id: 1,
    label: "Cho thuê phòng trọ",
    value: "Cho thuê phòng trọ",
  },
  {
    id: 2,
    label: "Nhà cho thuê",
    value: "Nhà cho thuê",
  },
  {
    id: 3,
    label: "Cho thuê căn hộ",
    value: "Cho thuê căn hộ",
  },
]
export const statusArr = ["Đã duyệt", "Đang chờ duyệt", "Từ chối"].map((el) => ({
  label: el,
  value: el,
}))
export const roomStatuses = ["Còn trống", "Đã thuê"].map((el) => ({
  label: el,
  value: el,
}))
export const expiredStatusArr = ["Tất cả", "Còn hạn", "Hết hạn"].map((el) => ({ value: el, label: el }))
export const votes = [
  { txt: "Rất tệ", star: 1 },
  { txt: "Tệ", star: 2 },
  { txt: "Bình thường", star: 3 },
  { txt: "Tốt", star: 4 },
  { txt: "Rất tốt", star: 5 },
]
export const swrOptions = {
  revalidateOnFocus: true, // Không re-fetch khi mất focus
  revalidateOnReconnect: true, // Không re-fetch khi reconnect mạng
  revalidateIfStale: true, // Không re-fetch nếu dữ liệu cũ
  shouldRetryOnError: true, // Chỉ re-fetch khi có lỗi
  revalidateOnMount: true, // Chỉ gọi API lần đầu khi component mount
}

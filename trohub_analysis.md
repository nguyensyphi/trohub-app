# 🏠 TrọHub — Tài Liệu Phân Tích & Cẩm Nang Bảo Vệ Đồ Án

> **Dành cho:** Người quản lý dự án chuẩn bị thuyết trình trước hội đồng giảng viên  
> **Phân tích bởi:** Đọc toàn bộ mã nguồn thực tế của dự án

---

## PHẦN 1: BỨC TRANH TOÀN CẢNH (Executive Summary)

### 🎯 Dự án TrọHub làm gì?

**TrọHub** là một **nền tảng thị trường bất động sản cho thuê trực tuyến** — nói nôm na là "chợ trọ kỹ thuật số". Nó kết nối ba nhóm người dùng trong một hệ sinh thái khép kín:

| Vai trò | Tên trong hệ thống | Họ làm gì? |
|---|---|---|
| 🛡️ **Quản trị viên** | `Quản trị viên` | Duyệt bài đăng, quản lý người dùng, theo dõi doanh thu toàn sàn |
| 🏠 **Chủ trọ** | `Chủ trọ` | Đăng bài cho thuê phòng/nhà/căn hộ, nạp tiền, gia hạn bài đăng |
| 👤 **Người thuê** | `Thành viên` | Tìm kiếm phòng, lưu yêu thích, xem bài đăng, đánh giá, bình luận |

**3 loại bất động sản được hỗ trợ:**
- 🛏️ Cho thuê phòng trọ
- 🏘️ Nhà cho thuê  
- 🏢 Cho thuê căn hộ

---

### ⚙️ Công nghệ cốt lõi & Lý do lựa chọn

#### Frontend (Giao diện người dùng)
- **React 18 + Vite** — *"Dùng React như dùng LEGO: mỗi nút bấm, mỗi thẻ phòng, mỗi modal đều là một mảnh ghép độc lập. Khi cập nhật giá, chỉ ô giá thay đổi, trang không cần tải lại từ đầu — trải nghiệm mượt mà như app di động."*
- **TailwindCSS + ShadCN/Radix UI** — Thư viện giao diện chuyên nghiệp, có sẵn các thành phần như Dialog, Dropdown, Slider để xây dựng UI nhanh và đẹp.
- **React Router DOM v6** — Điều hướng trang. Mỗi URL tương ứng với một màn hình cụ thể (trang chủ, trang tìm kiếm, trang chi tiết tin...).
- **Zustand** — Quản lý trạng thái đăng nhập người dùng. *"Giống như bộ nhớ ngắn hạn của ứng dụng — ai đang đăng nhập, token là gì, lưu vào đây để mọi trang đều biết."*
- **Axios + SWR** — Giao tiếp với server. SWR tự động làm mới dữ liệu khi cần.

#### Backend (Máy chủ xử lý)
- **Node.js + Express.js** — *"Express là người trực tổng đài: nhận mọi yêu cầu từ giao diện, phân loại và chuyển đến đúng bộ phận xử lý."*
- **Sequelize ORM** — Lớp trung gian giữa code và database. Thay vì viết SQL thô, ta viết JavaScript thân thiện.
- **JWT (JSON Web Token)** — Hệ thống thẻ thành viên điện tử. *"Như thẻ từ khách sạn: đăng nhập một lần, nhận thẻ, mỗi lần ra vào phòng (gọi API) chỉ cần quẹt thẻ."*
- **Bcryptjs** — Mã hóa mật khẩu trước khi lưu vào DB.
- **Nodemailer** — Gửi email thông báo tự động (duyệt bài, OTP reset mật khẩu).
- **Twilio** — Gửi OTP xác minh số điện thoại qua SMS.
- **node-cron** — Lịch trình tự động: mỗi ngày lúc 20:16 quét và thông báo bài đăng hết hạn.

#### Database (Cơ sở dữ liệu)
- **PostgreSQL** — *"Tủ hồ sơ điện tử cực kỳ có trật tự: dữ liệu được lưu thành bảng, có quan hệ rõ ràng giữa người dùng, bài đăng, hóa đơn..."*

#### Thanh toán
- **VNPay** — Cổng thanh toán nội địa (nạp tiền bằng thẻ ATM, Internet Banking Việt Nam).
- **PayPal** — Cổng thanh toán quốc tế (được tích hợp nhưng hiện ở trạng thái vô hiệu hóa trong routes).

#### Lưu trữ file
- **Dropbox API** — Upload ảnh nhà trọ lên cloud, lưu link URL vào database.

---

## PHẦN 2: KIẾN TRÚC HỆ THỐNG & CẤU TRÚC THƯ MỤC

### 🏗️ Mô hình kiến trúc: Client-Server + MVC Pattern

TrọHub chạy theo mô hình **Client-Server** kết hợp **MVC (Model-View-Controller)** ở phía Backend:

```
[NGƯỜI DÙNG] → [React App - PORT 5173] ←→ [Express Server - PORT 8888] ←→ [PostgreSQL DB]
```

**Ưu điểm của mô hình này:**
- **Tách biệt rõ ràng**: Frontend và Backend là hai project độc lập, có thể phát triển song song.
- **Bảo mật hơn**: Database chỉ giao tiếp với Backend, không bao giờ bị lộ ra ngoài.
- **Dễ mở rộng**: Muốn làm thêm app mobile? Chỉ cần dùng lại Backend API, không cần viết lại logic.

---

### 📁 Cấu trúc thư mục — Phân bổ "Phòng ban Công ty"

#### 🏢 SERVER (Toàn bộ bộ máy vận hành)

```
server/
├── index.js          ← 🚪 CỔNG VÀO CÔNG TY (cấu hình server, kết nối DB, chạy lịch trình tự động)
├── configs/          ← ⚙️ BAN GIÁM ĐỐC (cài đặt kết nối database)
├── routes/           ← 📋 LỄ TÂN (nhận và phân loại yêu cầu từ khách hàng)
├── middlewares/      ← 🔒 BẢO VỆ AN NINH (kiểm tra token, phân quyền)
├── controllers/      ← 🧠 CHUYÊN GIA XỬ LÝ (logic nghiệp vụ chính)
├── models/           ← 🗄️ KHO HỒ SƠ (định nghĩa cấu trúc dữ liệu)
├── migrations/       ← 🏗️ BẢN VẼ THI CÔNG (tạo bảng trong database)
├── seeders/          ← 📦 KHO DỮ LIỆU MẪU (dữ liệu thử nghiệm)
└── utils/            ← 🛠️ PHÒNG KỸ THUẬT (gửi mail, helpers, template email)
```

**Chi tiết các file controllers (não của hệ thống):**

| File | Vai trò |
|---|---|
| `auth.controller.js` | Xử lý đăng ký / đăng nhập (Phone, Email, Google) |
| `user.controller.js` | Quản lý profile, nạp tiền, OTP, wishlist, dashboard Admin |
| `post.controller.js` | Đăng bài, tìm kiếm, duyệt bài, bình luận, đánh giá sao |
| `payment.controller.js` | Tích hợp VNPay, tạo URL thanh toán, xử lý callback |
| `order.controller.js` | Quản lý đơn đăng bài (công khai / hủy tin) |
| `new.controller.js` | Quản lý tin tức / blog trên sàn |

---

#### 💻 CLIENT (Giao diện người dùng)

```
client/src/
├── main.jsx          ← 🚀 Điểm khởi động ứng dụng
├── App.jsx           ← 🎭 Khung sườn chính (bọc theme, router)
├── routes.jsx        ← 🗺️ BẢN ĐỒ URL (định nghĩa tất cả đường dẫn)
├── pages/            ← 📱 CÁC PHÒNG BAN GIAO DỊCH
│   ├── publics/      ← Trang công khai (Homepage, Tìm kiếm, Chi tiết tin, Đăng nhập)
│   ├── users/        ← Trang cá nhân (Hồ sơ, Đổi email, Đổi SĐT, Wishlist)
│   ├── owners/       ← Dashboard Chủ trọ (Đăng tin, Quản lý tin, Nạp tiền)
│   └── admin/        ← Dashboard Admin (Thống kê, Duyệt bài, Quản lý user, Tin tức)
├── components/       ← 🧩 BỘ PHẬN DÙNG CHUNG (Header, Sidebar, Form, Map, Chart...)
├── apis/             ← 📡 BỘ PHẬN LIÊN LẠC với Server
├── zustand/          ← 🧠 BỘ NHỚ TOÀN CỤC (trạng thái đăng nhập, bộ lọc tìm kiếm)
├── hooks/            ← ♻️ LOGIC TÁI SỬ DỤNG (custom React hooks)
└── lib/              ← 📚 TỦ SÁCH TIỆN ÍCH (danh sách URL, helper functions)
```

---

## PHẦN 3: LUỒNG DỮ LIỆU & CƠ SỞ DỮ LIỆU

### 🗃️ Các Thực thể (Entities) cốt lõi

| Entity (Bảng) | Ý nghĩa |
|---|---|
| **User** | Tài khoản người dùng (Admin / Chủ trọ / Thành viên) |
| **Post** | Bài đăng cho thuê phòng/nhà/căn hộ |
| **Order** | Đơn hàng đăng bài (trạng thái duyệt, ngày hết hạn tin) |
| **Payment** | Lịch sử nạp tiền vào ví (VNPay / PayPal) |
| **Expired** | Lịch sử gia hạn bài đăng |
| **Rating** | Đánh giá sao của người dùng cho từng bài đăng |
| **Comment** | Bình luận dưới bài đăng |
| **Wishlist** | Danh sách bài đăng yêu thích của người dùng |
| **SeenPost** | Danh sách bài đăng đã xem của người dùng |
| **News** | Tin tức / bài viết blog trên nền tảng |
| **View** | Bộ đếm lượt truy cập (khách vãng lai vs. thành viên đăng nhập) |

---

### 🔗 Mối quan hệ giữa các Entities

```
User (1) ──────────── (N) Post          [1 Chủ trọ đăng nhiều bài]
Post (1) ──────────── (1) Order         [1 bài đăng = 1 đơn hàng thanh toán phí đăng]
Post (1) ──────────── (N) Rating        [1 bài đăng có nhiều lượt đánh giá sao]
Post (1) ──────────── (N) Comment       [1 bài đăng có nhiều bình luận]
User (1) ──────────── (N) Wishlist      [1 người dùng lưu nhiều tin yêu thích]
User (1) ──────────── (N) SeenPost      [1 người dùng xem nhiều bài]
User (1) ──────────── (N) Payment       [1 người dùng có nhiều lần nạp tiền]
User (1) ──────────── (N) Expired       [1 Chủ trọ gia hạn nhiều lần]
Expired (N) ─────────── (1) Post        [Nhiều lần gia hạn cho 1 bài đăng]
```

---

### 🔄 Ví dụ luồng dữ liệu: **Luồng Đăng & Duyệt Bài Trọ**

Đây là luồng nghiệp vụ trung tâm và phức tạp nhất của TrọHub. Hãy hình dung như quy trình nộp hồ sơ xin việc:

**BƯỚC 1 — Chủ trọ điền form đăng bài** (`CreatePost.jsx`)
> Chủ trọ nhập thông tin: tiêu đề, địa chỉ (tích hợp API OpenStreetMap chọn tỉnh/quận/xã), giá thuê, diện tích, số phòng ngủ, nhà vệ sinh, tiện nghi, upload ảnh lên Dropbox, chọn loại giới tính nhận.

**BƯỚC 2 — Nhấn "Đăng bài"** → Gửi request lên server
> `post.controller.js` → `createNewPost()`  
> Server nhận dữ liệu, tạo bản ghi `Post` mới với trạng thái ban đầu chưa xác định, đồng thời **tự động tạo bản ghi `Order`** với trạng thái `"Đang chờ"`.

**BƯỚC 3 — Admin vào bảng điều khiển xem danh sách chờ duyệt** (`ManagePost.jsx` - admin)
> `post.controller.js` → `getAdminPosts()` trả về danh sách bài kèm thông tin Order.

**BƯỚC 4 — Admin nhấn "Duyệt"**
> `post.controller.js` → `updateStatusPostByAdmin()`  
> Hệ thống thực hiện **3 việc song song**:
> - Cập nhật `Post.status = "Đã duyệt"`
> - Cập nhật `Order.confirmedDate = [ngày hôm nay]`
> - Gửi **email thông báo tự động** đến địa chỉ email của Chủ trọ

**BƯỚC 5 — Chủ trọ nhận email, vào dashboard "Công khai bài"** (`ManageOrder.jsx`)
> `order.controller.js` → `publicPost()`  
> Hệ thống thực hiện **3 việc cùng lúc**:
> - Cập nhật `Order.status = "Thành công"` và đặt `Order.expiredDate`
> - Cập nhật `Post.expiredDate` (= ngày hiện tại + số ngày đăng ký)
> - **Trừ tiền** trong ví của Chủ trọ (`User.balance -= total`)

**BƯỚC 6 — Bài đăng xuất hiện công khai trên sàn**
> `post.controller.js` → `getPostPublics()` chỉ hiển thị bài có `status = "Đã duyệt"` và `expiredDate >= [hôm nay]`.

**BƯỚC 7 — Cron Job hàng ngày lúc 20:16** (`server/index.js`)
> Hệ thống tự động quét toàn bộ bài đăng có `expiredDate < [hôm nay]` và gửi email nhắc chủ trọ gia hạn.

---

## PHẦN 4: PHÂN TÍCH CHỨC NĂNG CỐT LÕI

### ✨ Tính năng 1: Hệ thống Xác thực Đa phương thức

**Ý nghĩa nghiệp vụ:** Cho phép đăng nhập bằng 3 cách: Email, Số điện thoại, Google OAuth — đảm bảo mọi tệp khách hàng đều được tiếp cận.

**File phụ trách chính:** `auth.controller.js`, `verify-token.midd.js`, `Login.jsx`

**Điểm thông minh để "khoe" với hội đồng:**
> Hệ thống dùng **JWT (JSON Web Token)** với thời hạn 7 ngày. Token được ký bằng khóa bí mật (`JWT_SECRET`) chỉ server mới biết. Mỗi yêu cầu từ client phải gửi kèm token này trong header `Authorization: Bearer [token]`. Middleware `verifyToken` sẽ giải mã và xác thực token trước khi cho phép truy cập tài nguyên bảo vệ.
>  
> Đặc biệt, hệ thống có **`verifyTokenNotRequire`** — một middleware thông minh: nó cố giải mã token nhưng nếu không có token thì vẫn cho qua. Điều này cho phép cùng một API endpoint phục vụ cả khách vãng lai lẫn thành viên đăng nhập với hành vi khác nhau (ví dụ: xem bài đăng ai cũng được, nhưng chỉ thành viên mới được lưu vào "đã xem").
>  
> Mật khẩu được mã hóa bằng **Bcrypt với 10 salt rounds** — tiêu chuẩn bảo mật ngành.

---

### ✨ Tính năng 2: Hệ thống Phân quyền 3 Cấp

**Ý nghĩa nghiệp vụ:** Kiểm soát chặt chẽ ai được làm gì trong hệ thống — tránh nhầm lẫn và lạm quyền.

**File phụ trách chính:** `verify-token.midd.js`, `contants.js`, `user.controller.js`

**Điểm thông minh để "khoe" với hội đồng:**
> Ba middleware bảo vệ: `verifyToken` (phải đăng nhập), `isAdmin` (phải là Quản trị viên), `isOwner` (phải là Chủ trọ) được xếp thành lớp như "ổ khóa cửa".
>  
> Đặc biệt, **quy trình nâng cấp lên Chủ trọ** (`updateRoleOwner`) có logic thông minh: chỉ cho phép nâng cấp khi người dùng đồng thời thỏa mãn 3 điều kiện — đã xác minh email (`emailVerified = true`) VÀ đã xác minh số điện thoại (`phoneVerified = true`) VÀ số dư ví > 0. Điều này buộc người dùng phải "cam kết" trước khi trở thành chủ trọ, giảm spam và tăng chất lượng người đăng bài.

---

### ✨ Tính năng 3: Hệ thống Tìm kiếm & Lọc Nâng cao

**Ý nghĩa nghiệp vụ:** Người thuê trọ có thể lọc phòng theo nhiều tiêu chí phức tạp cùng lúc mà không cần reload trang.

**File phụ trách chính:** `post.controller.js` → `getPostPublics()`, `SearchLayout.jsx`, `useSearchStore.js`

**Điểm thông minh để "khoe" với hội đồng:**
> Backend xử lý bộ lọc giá và diện tích theo cú pháp động: tham số `price` được gửi lên dưới dạng JSON (`["gt", 5000000]` = "lớn hơn 5 triệu", hoặc `[2000000, 5000000]` = "từ 2 đến 5 triệu"). Server phân tích JSON này và ánh xạ sang Sequelize operator tương ứng (`Op.gt`, `Op.between`).
>  
> Tương tự với tiện nghi (`convenient`): người dùng có thể chọn nhiều tiện nghi, server dùng `Op.or` + `Op.iLike` để tìm bài đăng có chứa BẤT KỲ tiện nghi nào trong danh sách được chọn.
>  
> Toàn bộ bộ lọc được đồng bộ vào **Zustand store** (`useSearchStore.js`), giúp trạng thái tìm kiếm được duy trì ngay cả khi điều hướng giữa các trang.
>  
> Ngoài ra, `utils/helpers.js` có hàm `textToNumbers()` phân tích ngôn ngữ tự nhiên tiếng Việt ("dưới 3 triệu", "lớn hơn 2 triệu") thành dãy số — nền tảng cho tính năng tìm kiếm bằng giọng nói/văn bản.

---

### ✨ Tính năng 4: Hệ thống Ví điện tử & Thanh toán Tích hợp

**Ý nghĩa nghiệp vụ:** Chủ trọ nạp tiền vào ví trên sàn, dùng ví đó để thanh toán phí đăng bài và gia hạn tin.

**File phụ trách chính:** `payment.controller.js`, `user.controller.js` → `deposit()` / `expirePost()`, `DepositVnpay.jsx`

**Điểm thông minh để "khoe" với hội đồng:**
> Tích hợp **VNPay sandbox** theo đúng tài liệu kỹ thuật của VNPay. Quy trình:
> 1. Client yêu cầu nạp tiền → Server tạo URL thanh toán với chữ ký HMAC-SHA512 (mã hóa chống giả mạo)
> 2. User được redirect sang cổng VNPay để thanh toán
> 3. Sau khi thanh toán, VNPay redirect về URL callback của server
> 4. Server **xác minh chữ ký HMAC-SHA512** để đảm bảo response không bị giả mạo
> 5. Nếu hợp lệ: tăng `User.balance` và tạo bản ghi `Payment` — **hai thao tác thực hiện song song** bằng `Promise.all()` để tối ưu hiệu năng
>  
> Logic **rollback an toàn**: nếu tạo Payment thất bại, hệ thống tự động hoàn lại số dư người dùng (`User.decrement`).

---

### ✨ Tính năng 5: Hệ thống Đánh giá Sao Thông minh

**Ý nghĩa nghiệp vụ:** Tăng độ tin cậy của bài đăng, giúp người thuê đưa ra quyết định tốt hơn.

**File phụ trách chính:** `post.controller.js` → `ratingPost()`, model `Rating`

**Điểm thông minh để "khoe" với hội đồng:**
> Tính năng này giải quyết bài toán "mỗi người chỉ được đánh giá 1 lần" và "điểm trung bình phải cập nhật realtime":
> 1. Kiểm tra xem user đã từng đánh giá bài này chưa (`Rating.findOne`)
> 2. Nếu đã có → **cập nhật** điểm cũ (không tạo thêm)
> 3. Nếu chưa → **tạo mới** bản ghi Rating
> 4. Sau đó dùng **SQL Aggregate Function** `AVG()` qua Sequelize để tính điểm trung bình của tất cả lượt đánh giá
> 5. Làm tròn 1 chữ số thập phân (`Math.round(avg * 10) / 10`)
> 6. Cập nhật ngược lại trường `averageStar` vào bảng `Post`
>  
> Điều này đảm bảo điểm sao hiển thị trên bài đăng luôn chính xác, không bị gian lận bằng cách đánh giá nhiều lần.

---

## PHẦN 5: CẨM NANG SINH TỒN TRƯỚC HỘI ĐỒNG

### 🎓 Q&A — 5 Câu hỏi "Hóc búa" & Trả lời Chuẩn bị Sẵn

---

**❓ CÂU HỎI 1 (Bảo mật): "Hệ thống của bạn xử lý bảo mật như thế nào? Nếu tôi lấy được token của người dùng khác, tôi có thể làm gì?"**

**✅ Trả lời dành cho bạn:**
> "Thưa thầy/cô, TrọHub bảo vệ bằng nhiều lớp. Thứ nhất, **mật khẩu được mã hóa một chiều bằng Bcrypt** — ngay cả Admin cũng không đọc được mật khẩu gốc. Thứ hai, **JWT token có thời hạn 7 ngày**, sau đó tự động vô hiệu. Thứ ba, tất cả API nhạy cảm đều qua middleware `verifyToken` — và quan trọng hơn, các thao tác thay đổi dữ liệu còn kiểm tra thêm `WHERE idUser = uid` — tức là token của user A chỉ có thể chỉnh sửa dữ liệu của user A, không thể đụng vào dữ liệu user B. Về hạn chế, chúng tôi nhận thức được rằng hệ thống chưa triển khai HTTPS, refresh token, hay rate limiting — đây là hướng cải thiện tiếp theo trong môi trường production."

---

**❓ CÂU HỎI 2 (Kiến trúc): "Tại sao chọn Monolith thay vì Microservices? Hệ thống có thể mở rộng không?"**

**✅ Trả lời dành cho bạn:**
> "Thưa thầy/cô, TrọHub hiện áp dụng kiến trúc **Monolith Client-Server** — đây là lựa chọn phù hợp với quy mô đồ án và giai đoạn MVP. Microservices phù hợp với hệ thống có hàng triệu người dùng và đội ngũ phát triển lớn; với phạm vi này, Monolith cho phép phát triển nhanh, debug dễ và deploy đơn giản hơn. Về khả năng mở rộng, hệ thống đã được thiết kế theo hướng RESTful API, Frontend và Backend hoàn toàn tách biệt. Nếu cần scale, chúng tôi có thể: (1) Scale riêng Backend bằng load balancer, (2) Tách module Payment thành service độc lập khi có nhu cầu, (3) Thêm Redis cache cho các API tìm kiếm thường xuyên."

---

**❓ CÂU HỎI 3 (Dữ liệu): "Khi 1000 người cùng tìm kiếm và lọc đồng thời, hiệu năng database như thế nào?"**

**✅ Trả lời dành cho bạn:**
> "Thưa thầy/cô, hiện tại API tìm kiếm (`getPostPublics`) đã áp dụng **phân trang (Pagination)** — mỗi request chỉ trả về tối đa 5-10 bài thay vì dump toàn bộ dữ liệu. Bài đăng được sắp xếp theo `priority` DESC, đảm bảo bài trả phí cao hiển thị trước. Về hướng cải thiện có thể đề xuất: thêm **database index** trên các cột thường xuyên WHERE/ORDER như `status`, `expiredDate`, `province`, `district`; áp dụng **query caching với Redis**; và nếu dữ liệu lớn, cân nhắc **full-text search** với Elasticsearch. Đây là roadmap kỹ thuật cho giai đoạn phát triển tiếp theo."

---

**❓ CÂU HỎI 4 (Nghiệp vụ): "Điều gì xảy ra nếu VNPay gửi callback 2 lần do lỗi mạng? Hệ thống có nạp tiền nhân đôi không?"**

**✅ Trả lời dành cho bạn:**
> "Thưa thầy/cô, đây là câu hỏi rất hay liên quan đến tính **idempotency** trong thanh toán. Hiện tại, mỗi giao dịch VNPay tạo một `idInvoice` duy nhất bằng `randomstring`. Hạn chế hiện tại là hệ thống chưa kiểm tra xem `idInvoice` đó đã tồn tại trong bảng Payment chưa trước khi tạo mới — đây là điểm cần cải thiện. Giải pháp đúng đắn là thêm bước kiểm tra `Payment.findOne({ where: { idInvoice } })` trước khi xử lý, tức là **chỉ nạp tiền nếu invoice chưa từng được xử lý**. Chúng tôi đã nhận ra vấn đề này và sẽ patch trong phiên bản tiếp theo."

---

**❓ CÂU HỎI 5 (Thiết kế hệ thống): "Hệ thống xử lý việc chủ trọ đăng bài nhưng chưa thanh toán ra sao? Và cơ chế kiểm duyệt có thể bị vượt qua không?"**

**✅ Trả lời dành cho bạn:**
> "Thưa thầy/cô, luồng nghiệp vụ được thiết kế theo mô hình **'Đăng trước, duyệt sau, trả tiền khi công khai'**. Cụ thể: khi Chủ trọ tạo bài, hệ thống tạo đồng thời `Post` và `Order` với trạng thái 'Đang chờ' — **chưa trừ tiền**. Tiền chỉ bị trừ tại bước `publicPost` khi chủ trọ chủ động nhấn 'Công khai bài'. API `publicPost` được bảo vệ bởi middleware `isOwner` và kiểm tra `idUser = uid`, đảm bảo chỉ đúng chủ của bài đó mới được công khai. Bài chỉ hiển thị trên trang công khai khi đồng thời đáp ứng 2 điều kiện: `status = 'Đã duyệt'` (qua kiểm duyệt Admin) VÀ `expiredDate >= hôm nay` (đã thanh toán). Đây là thiết kế **double-gate** — hai cổng bảo vệ độc lập."

---

## 📊 Tóm tắt Kiến trúc Tổng thể

```
┌─────────────────────────────────────────────────────────┐
│                    NGƯỜI DÙNG                           │
│         (Trình duyệt web - Chrome, Firefox...)          │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS requests
                     ▼
┌─────────────────────────────────────────────────────────┐
│               REACT CLIENT (PORT 5173)                  │
│  Vite + React 18 + TailwindCSS + Shadcn/Radix           │
│  Zustand (state) │ Axios (HTTP) │ React Router (URL)    │
│  ┌──────────┬──────────┬──────────────────────────┐    │
│  │ Public   │ User     │ Owner  │ Admin            │    │
│  │ Pages    │ Pages    │ Pages  │ Pages            │    │
│  └──────────┴──────────┴──────────────────────────┘    │
└────────────────────┬────────────────────────────────────┘
                     │ REST API calls
                     ▼
┌─────────────────────────────────────────────────────────┐
│              EXPRESS SERVER (PORT 8888)                  │
│  ┌──────────────────────────────────────────────────┐   │
│  │ MIDDLEWARE LAYER                                 │   │
│  │  verifyToken │ isAdmin │ isOwner │ validateDTO   │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │ CONTROLLER LAYER                                 │   │
│  │  auth │ user │ post │ payment │ order │ news     │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │ MODEL LAYER (Sequelize ORM)                      │   │
│  │  User│Post│Order│Payment│Rating│Comment│Expired  │   │
│  └──────────────────────────────────────────────────┘   │
│  ⏰ CRON JOB: Báo cáo bài đăng hết hạn mỗi ngày 20:16 │
└────────────────────┬────────────────────────────────────┘
                     │ SQL queries
                     ▼
┌─────────────────────────────────────────────────────────┐
│            PostgreSQL DATABASE                           │
│  11 bảng dữ liệu, quan hệ chuẩn hóa 3NF                │
└─────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
   ┌──────────┐        ┌──────────┐        ┌──────────┐
   │  VNPay   │        │  Twilio  │        │ Nodemailer│
   │ (Nạp ví) │        │ (OTP SMS)│        │ (Email)  │
   └──────────┘        └──────────┘        └──────────┘
```

---

> **💡 Lời khuyên cuối:** Khi hội đồng hỏi về "điểm yếu", hãy **chủ động thừa nhận 2-3 điểm cải thiện** (HTTPS, rate limiting, idempotency thanh toán) và đề xuất hướng giải quyết. Điều này thể hiện bạn hiểu thực sự hệ thống của mình và có tư duy kỹ sư trưởng thành — quan trọng hơn nhiều so với phủ nhận vấn đề.

# Hướng dẫn cài đặt chạy web trên máy tính Local

Để chạy được web phải cần 3 yếu tố:

- 1 postgres server - database chạy local _(Cái này lên mạng tải postgressql về máy và cài đặt như bình thường.)_
- 1 server _(xử lý logic phía sau trang web)_
- 1 client _(hiển thị giao diện UI)_

### 1. Cài đặt server postgres - Database

Truy cập vào link [download này](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads) để tại postgres vê. Sau đó cài đặt bình thường nếu chưa có postgres trên máy, có thể xem hướng dẫn trên mạng.
Lúc cài cần nhớ username và password đẻ truy cập vào server. Thường thì username là `postgres` nếu không tự custom gì, còn mật khẩu thì từ đặt.

_NOTE: Sau khi cài xong check xem postgres server đã chạy lên chưa, vào services cúa máy để tìm, nếu chưa running thì start nó lên_

Tiếp theo, cần tạo một database postgres và đặt tên cho nó. Tên gì cũng được ví dụ `trohub`. Các bước tạo mới 1 DB thì có thể google hoặc làm theo như sau:

- Tìm kiếm trên máy `psql` _(cái này sẽ được cài trong lúc cài postgres server)_, mở `psql` lên, sau đó cứ bấm `Enter` cho tới khi nó bắt nhập `password` thì nhập vào _(lưu ý, lúc nhập mật khẩu nó không hiện đâu, cứ nhập đúng mk rồi `Enter` là được, có thể gg)._
- Sau khi đăng nhập xong, gõ câu lệnh sau để tạo mới database: `CREATE DATABASE trohub;`, trong đó `trohub` là tên database, đặt sao cũng được.

### 2. Cài và chạy server nodejs

Khúc này nếu máy chưa có cài nodejs thì tải và cài trước nhé. Có thể vào terminal và chạy lệnh `node -v` để check xem có node chưa và `npm -v` để check xem có cài `npm` chưa.

Sau khi đã cài nodejs (npm) thì tiền hành cài yarn cho máy. `npm install -g yarn`. Có thể tham khảo hưỡng dẫn trên mạng. Sau khi cài xong kiểm tra xem máy đã có yarn chưa `yarn -v`.

Mở source code lên, **mở terminal đứng tại forder server**.

Trước tiên chạy lệnh `yarn` để tại thư viện cần thiết. Nếu lỗi thì có thể thử `yarn --force`.

Trong forder server, tạo một file mới đặt tên là `.env`, sau đó mở file `.env.example` lên và copy hết trong đó đem qua paste lại vào file `.env`.

Sau đó, điền hết thông tin vào file `.env`.

Tiếp theo, mở terminal forder server chạy server lên bằng lệnh: `yarn dev`.

Sau khi server chạy lên thành công thì tới bước khởi tạo bảng cho database, và insert dữ liệu `yarn mockup`.

Kết thúc chạy thàng công server

### 3. Chạy client Reactjs

Mở source code lên, **mở terminal đứng tại forder client**.

Trước tiên chạy lệnh `yarn` để tại thư viện cần thiết. Nếu lỗi thì có thể thử `yarn --force`.

Tiếp theo, mở terminal forder client chạy server lên bằng lệnh: `yarn dev`.

Tương tự server, client cũng có file .env, tạo file .evn ở client forder

Truy cập `http://localhost:5173` để mở website.

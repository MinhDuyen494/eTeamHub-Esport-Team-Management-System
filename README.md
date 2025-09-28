# eTeamHub - Hệ thống Quản lý Đội E-sport

## Giới thiệu dự án

**eTeamHub** là hệ thống quản lý đội tuyển E-sport hiện đại, hỗ trợ các đội trong việc tổ chức, vận hành và theo dõi hoạt động.
Dự án cung cấp giải pháp toàn diện cho việc quản lý thành viên, lịch trình luyện tập & thi đấu, điểm danh, phân quyền vai trò, thông báo nội bộ real-time, cũng như báo cáo và thống kê hoạt động.
Mục tiêu của dự án là **nâng cao hiệu quả quản lý** và giúp phát triển đội nhóm chuyên nghiệp hơn.

## Các tính năng chính

- **Quản lý Đội hình (Roster Management)**
  - Tạo, chỉnh sửa, xóa đội
  - Mời, thêm, xóa thành viên
  - Quản lý vai trò thành viên (Leader, Player)
- **Quản lý Lịch trình (Schedule Management)**
  - Tạo, sửa, xóa sự kiện luyện tập/thi đấu
  - Theo dõi trạng thái tham gia của thành viên
- **Xác thực & Phân quyền**
  - Đăng ký, đăng nhập, đăng xuất
  - Phân quyền theo vai trò (Admin, Leader, Player)
- **Các chức năng khác**
  - Quản lý lời mời tham gia đội (Team Invites)
  - Quản lý điểm danh (Attendance)
  - Thông báo (Notifications) real-time
  - Báo cáo & Thống kê (Reports & Analytics)

## Công nghệ sử dụng (Technology Stack)

| Layer    | Technology                                              |
| -------- | ------------------------------------------------------- |
| Backend  | NestJS, TypeScript, TypeORM, PostgreSQL, Jest (Testing) |
| Frontend | React, TypeScript, Ant Design, Axios, Vite              |

**Backend**

- NestJS: Framework Node.js mạnh mẽ, hỗ trợ module hóa và RESTful API
- TypeScript: Ngôn ngữ lập trình chính, an toàn kiểu dữ liệu
- TypeORM: ORM ánh xạ dữ liệu giữa ứng dụng và PostgreSQL
- PostgreSQL: Hệ quản trị cơ sở dữ liệu quan hệ
- Jest: Framework kiểm thử tự động cho backend

**Frontend**

- React: Thư viện xây dựng giao diện người dùng
- TypeScript: Ngôn ngữ lập trình chính cho frontend
- Ant Design: Bộ UI components chuyên nghiệp
- Axios: HTTP client giao tiếp với backend
- Vite: Công cụ build và phát triển frontend nhanh chóng

## Yêu cầu môi trường

Để cài đặt và chạy dự án, bạn cần chuẩn bị các thành phần sau:

- Node.js >= 18
- npm (hoặc Yarn) mới nhất
- PostgreSQL >= 14

## Hướng dẫn Cài đặt & Cấu hình

### 1. Sao chép repository

```bash
git clone https://github.com/MinhDuyen494/eTeamHub-Esport-Team-Management-System.git
cd eTeamHub-Esport-Team-Management-System
```

### 2. Cài đặt dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd ../frontend
npm install
```

### 3. Cấu hình môi trường (Backend)

Tạo file `.env` trong thư mục `backend/` dựa trên `.env.example`.
Ví dụ nội dung:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=yourpassword
DATABASE_NAME=eteamhub
JWT_SECRET=your_jwt_secret
```

⚠️ Đảm bảo đã khởi tạo database PostgreSQL trước khi chạy.

### Chạy dự án

#### Backend (NestJS)

```bash
cd backend
npm run start:dev
```

Mặc định chạy tại: http://localhost:3000

#### Frontend (React)

```bash
cd frontend
npm run dev
```

Mặc định chạy tại: http://localhost:5173

## Cấu trúc thư mục

```
├── backend/    # Source code backend (NestJS, TypeScript)
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   └── ...
├── frontend/   # Source code frontend (React, TypeScript)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── README.md
└── ...
```

- backend/: Mã nguồn & cấu hình API server, database, các module nghiệp vụ
- frontend/: Giao diện người dùng (UI), components, assets tĩnh

## Liên hệ & Đóng góp

- Tạo issue hoặc pull request nếu bạn muốn đóng góp hoặc phát hiện lỗi
- Mọi ý kiến đóng góp đều được hoan nghênh để phát triển hệ thống tốt hơn!
- Liên hệ: GitHub - MinhDuyen494

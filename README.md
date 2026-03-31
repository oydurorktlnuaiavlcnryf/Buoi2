# Quản Lý Posts & Comments - NNPTUD Buổi 2

## Thông tin sinh viên

| Thông tin | Chi tiết |
|-----------|----------|
| **Họ tên** | Trần Biện Minh Tâm |
| **MSSV** | 2280614642 |
| **Môn học** | Nhập Môn Phát Triển Ứng Dụng |
| **Bài tập** | Buổi 2 - CRUD với JSON Server |

## Mô tả

Ứng dụng quản lý Posts và Comments sử dụng **JSON Server** làm REST API và **Bootstrap 5** cho giao diện.

### Tính năng Posts

1. **Hiển thị dữ liệu**: Load data từ `db.json` qua API, hiển thị bảng Bootstrap
2. **Tìm kiếm realtime**: Thanh tìm kiếm theo tên, sử dụng hàm `onChanged()` (oninput)
3. **Sắp xếp**: 4 nút sắp xếp (Tên ↑↓, Views ↑↓)
4. **Xóa mềm (Soft Delete)**: Thêm `isDeleted: true` vào đối tượng thay vì xóa cứng
5. **Hiển thị post đã xóa**: Gạch ngang (line-through) cho các post bị xóa mềm
6. **Khôi phục post**: Nút khôi phục post đã xóa mềm
7. **ID tự tăng**: ID = maxId + 1, lưu dạng chuỗi, không cần nhập khi tạo mới
8. **CRUD đầy đủ**: Thêm, Sửa, Xóa mềm post

### Tính năng Comments

1. **Hiển thị comments**: Bảng Bootstrap riêng cho comments
2. **CRUD đầy đủ**: Thêm, Sửa, Xóa comment
3. **ID tự tăng**: Tương tự posts
4. **Liên kết Post ID**: Mỗi comment gắn với 1 post

### Công nghệ

- **Frontend**: HTML, JavaScript, Bootstrap 5
- **Backend**: JSON Server (fake REST API)
- **Data**: `db.json`

## Hướng dẫn chạy

```bash
# 1. Cài đặt dependencies
npm install json-server

# 2. Chạy JSON Server
npx json-server db.json

# 3. Mở trình duyệt
# Mở file index.html
```

## Cấu trúc project

```
├── index.html          # Giao diện chính (Bootstrap 5)
├── main.js             # Logic: CRUD Posts & Comments, Search, Sort, Soft Delete
├── db.json             # Dữ liệu (JSON Server)
├── package.json        # Dependencies
└── README.md           # File này
```
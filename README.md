# Quản Lý Posts - NNPTUD Buổi 2

## Thông tin sinh viên

| Thông tin | Chi tiết |
|-----------|----------|
| **Họ tên** | Trần Biện Minh Tâm |
| **MSSV** | 2280614642 |
| **Môn học** | Nhập Môn Phát Triển Ứng Dụng |
| **Bài tập** | Buổi 2 - CRUD với JSON Server |

## Mô tả

Ứng dụng quản lý Posts sử dụng **JSON Server** làm REST API và **Bootstrap 5** cho giao diện.

### Tính năng

1. **Hiển thị dữ liệu**: Load data từ `db.json` qua API, hiển thị bảng Bootstrap
2. **Tìm kiếm realtime**: Thanh tìm kiếm theo tên, sử dụng hàm `onChanged()` (oninput)
3. **Sắp xếp**: 4 nút sắp xếp
   - Tên tăng dần (A-Z)
   - Tên giảm dần (Z-A)
   - Views tăng dần
   - Views giảm dần
4. **CRUD**: Thêm, sửa, xóa post

### Công nghệ

- **Frontend**: HTML, JavaScript, Bootstrap 5
- **Backend**: JSON Server (fake REST API)
- **Data**: `db.json`

## Hướng dẫn chạy

```bash
# 1. Cài đặt dependencies
npm install

# 2. Chạy JSON Server
npx json-server db.json

# 3. Mở trình duyệt
# Mở file index.html hoặc truy cập http://localhost:3000
```

## Cấu trúc project

```
├── index.html          # Giao diện chính (Bootstrap 5)
├── main.js             # Logic: Load, Search, Sort, CRUD
├── db.json             # Dữ liệu (JSON Server)
├── package.json        # Dependencies
└── README.md           # File này
```
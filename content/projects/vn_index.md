---
title: "VN-Index Tracker – Bảng Dữ Liệu Biến Động Thị Trường"
slug: "vn-index"
city: "saigon"
neon_accent: "#10B981"
detail: "Hệ thống theo dõi và trực quan hóa chỉ số chứng khoán Việt Nam qua API mở • Đồ án học phần."
poster: "/img/Saigon_3.jpg"
Project: 2
date: "2025-11-20"
tags: ["Next.js", "TypeScript", "REST API", "Data Visualization", "Tailwind", "Finance"]
dispatch_code: "HỒ SƠ: FIN-DATA/VNINDEX"
stamp_seal: "HỌC PHẦN"
brief: "Khai thác API tài chính mở để chuẩn hóa, xử lý và trực quan hóa dòng tiền cùng biến động chỉ số thị trường chứng khoán Việt Nam thời gian thực."
---

# VN-Index Tracker: Giám Sát Thị Trường Chứng Khoán Thời Gian Thực

Đồ án học phần chuyên sâu về khai thác dữ liệu từ các API tài chính mở nhằm xây dựng nền tảng theo dõi và trực quan hóa toàn diện thị trường chứng khoán Việt Nam.

---

### 1. Mục Tiêu Đồ Án & Bài Toán Xử Lý Dữ Liệu

Dự án tập trung vào việc làm chủ dòng dữ liệu tài chính biến động liên tục và phức tạp:

- **Khai thác API dữ liệu mở (Financial Data Pipeline):** Thiết lập luồng fetch dữ liệu tự động, chuẩn hóa dữ liệu thô (raw data) từ các nguồn mở về chỉ số VN-Index, HNX, UPCoM cùng khối lượng giao dịch.
- **Trực quan hóa đồ thị kỹ thuật (Data Visualization):** Chuyển đổi dữ liệu số học thành hệ thống biểu đồ đường, nến (Candlestick chart) và bảng nhiệt (Heatmap) trực quan, giúp người xem dễ dàng phân tích xu hướng thị trường.
- **Tối ưu tần suất truy xuất:** Xử lý cơ chế caching và throttling dữ liệu hợp lý để tránh nghẽn luồng truy vấn API ngoài, duy trì trạng thái dữ liệu chính xác nhất.

---

### 2. Kiến Trúc Kỹ Thuật & Đóng Góp Frontend

- **Giao diện bảng điện tử tân thời:** Thiết kế UI mang cảm hứng bảng điện chứng khoán kết hợp độ tương phản sắc nét, làm nổi bật các trạng thái sắc màu tăng (xanh lá) / giảm (đỏ) / đứng giá (vàng).
- **Tối ưu trải nghiệm tải và phản hồi (Zero-Lag UX):** Quản lý trạng thái bất đồng bộ nhịp nhàng, chia nhỏ các component render đồ thị để ngăn chặn hiện tượng giật khung hình khi chỉ số cập nhật liên tục.
- **Tổ chức kiến trúc Frontend – Backend rành mạch:** Tách bạch rõ ràng giữa tầng fetch dữ liệu (Data Access Layer), tầng xử lý logic số học và tầng hiển thị giao diện.

---

### 3. Khung Hình Giao Diện & Biểu Đồ

<div className="my-6 flex flex-col items-center rounded-sm border-2 border-[#2e3328] bg-[#0b0d0a] p-2.5">
  <img 
    src="/img/Saigon_3.jpg" 
    alt="Giao diện theo dõi biến động chỉ số VN-Index và biểu đồ tài chính" 
    className="h-auto w-full max-w-[760px] rounded-xs object-cover" 
  />
  <p className="mt-2.5 font-mono text-[13px] italic text-[#a8b399]">// BẢN GHI: Trực quan hóa dữ liệu chỉ số thị trường chứng khoán theo thời gian thực</p>
</div>

---

### 4. Giá Trị Thu Nhận

- Thành thạo kỹ năng xử lý dữ liệu ngoại vi (Fetch, parse, validate, cache và render data phức tạp).
- Rèn luyện tư duy tổ chức mã nguồn có cấu trúc, cân bằng giữa bài toán hiệu năng xử lý số liệu và độ mượt mà của giao diện.

---

[Xem mã nguồn trên GitHub](https://github.com)
[Quay lại danh mục dự án](/projects)
-
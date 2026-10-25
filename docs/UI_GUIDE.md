# UI GUIDE — MINH KỲ ACADEMY

> DRAFT chờ duyệt. Lấy cảm hứng **bố cục & luồng** từ ảnh tham chiếu; **nhận diện riêng** của Minh Kỳ. Không dùng logo, mascot, hình minh họa, hệ màu đỏ–hồng hay chứng chỉ mẫu của đơn vị khác.

## 1. Nguyên tắc

1. Rõ việc phải làm: hạn, quá hạn, trạng thái luôn nhìn thấy sớm.
2. Gọn, nhiều khoảng trắng, thẻ bo góc trên nền xám nhạt.
3. Mobile-first cho learner (nhân viên showroom/gara dùng điện thoại).
4. Mọi màn hình dữ liệu có đủ loading / empty / error / success.
5. Không nút giả: tính năng chưa làm thì ẩn bằng feature flag, không hiển thị "sắp ra mắt" như đã hoàn thành.

## 2. Design tokens (đề xuất, chờ xác nhận Q1)

### Màu (light; dark mode để sau MVP)

| Token                | Hex                   | Dùng cho                               |
| -------------------- | --------------------- | -------------------------------------- |
| `--primary`          | `#0F766E`             | Nút chính, link, mục sidebar đang chọn |
| `--primary-hover`    | `#0D655E`             | Hover/active                           |
| `--primary-soft`     | `#E6F4F2`             | Nền mục chọn, badge nhẹ                |
| `--accent`           | `#D97706`             | Điểm nhấn: cảnh báo hạn, chứng chỉ     |
| `--background`       | `#F5F7F8`             | Nền trang                              |
| `--surface`          | `#FFFFFF`             | Thẻ, sidebar, modal                    |
| `--foreground`       | `#0F172A`             | Chữ chính                              |
| `--muted-foreground` | `#64748B`             | Chữ phụ                                |
| `--border`           | `#E2E8F0`             | Viền thẻ, đường kẻ                     |
| `--success` / soft   | `#15803D` / `#DCFCE7` | Hoàn thành, đạt                        |
| `--info` / soft      | `#1D4ED8` / `#DBEAFE` | Đang học                               |
| `--warning` / soft   | `#B45309` / `#FEF3C7` | Sắp đến hạn                            |
| `--danger` / soft    | `#B91C1C` / `#FEE2E2` | Quá hạn, không đạt, lỗi                |

Tương phản chữ/nền ≥ 4.5:1 (kiểm tra bằng công cụ khi triển khai). Trạng thái không chỉ dựa vào màu: luôn kèm icon/nhãn.

Ánh xạ sang biến CSS của shadcn (`--background`, `--card`, `--primary`, `--ring`…) ở M1; giá trị HSL tính từ bảng trên.

### Chữ

- Font: **Be Vietnam Pro** (hỗ trợ tiếng Việt tốt) qua `next/font`, fallback system-ui.
- Cỡ: Display 28/36 · H1 24/32 · H2 20/28 · H3 16/24 semibold · Body 14/22 · Small 12/18. Cỡ chữ tối thiểu 14 trên mobile cho nội dung chính.

### Hình khối & khoảng cách

- Thang spacing 4px. Gutter trang 16 (mobile) / 24 (desktop).
- Bo góc: thẻ 12px, nút/ô nhập 8px, badge full. (Khác ảnh tham chiếu dùng ô tìm kiếm/nút dạng pill — giữ bản sắc riêng.)
- Đổ bóng: `sm` rất nhẹ cho thẻ; modal `lg`.
- Icon: Lucide, 16/20px, stroke 1.75.

### Layout

- AppShell: sidebar 248px (thu gọn 72px), mobile = drawer; nội dung `max-w-[1280px]`.
- Header trang: tiêu đề + mô tả phụ + vùng hành động.
- Player: toàn màn hình với outline bên phải (collapsible), thanh Bài trước / Bài tiếp theo dưới. Mobile: outline thành sheet.
- Màn hình thi: header tối giản (thoát, timer, Nộp bài), thẻ câu hỏi giữa, bảng điều hướng câu bên phải (desktop) / sheet dưới (mobile).

## 3. Sidebar theo portal

**Learner** — Trang chủ · _Khám phá_: Thư viện khóa học · _Học tập của tôi_: Chương trình, Khóa học của tôi, Kỳ thi · _Thành tích_: Chứng chỉ · (ẩn: Đào tạo tại chỗ, Khảo sát) · chân: thẻ người dùng + đăng xuất.
**Manager** — Tổng quan · Nhân viên · Quá hạn · Kết quả thi.
**Admin** — Tổng quan · _Tổ chức_: Đơn vị, Chức danh, Nhân viên · _Nội dung_: Khóa học, Chương trình, Ngân hàng câu hỏi · _Thi_: Bài thi, Lượt thi · _Vận hành_: Phân công, Báo cáo, Chứng chỉ · _Hệ thống_: Nhật ký, Cài đặt.
Người có nhiều vai trò thấy nút chuyển portal.

## 4. Thành phần chính

| Thành phần           | Quy tắc                                                                                                                                |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `StatCard`           | Nhãn, số lớn, đơn vị phụ, icon; clickable → trang liệt kê                                                                              |
| `CourseCard`         | Ảnh bìa tỷ lệ 16:9 (placeholder do Minh Kỳ tạo), tag hình thức, tiêu đề (2 dòng), đối tượng, thanh tiến độ nếu đã học                  |
| `StatusBadge`        | Chưa bắt đầu (xám) · Đang học (info) · Hoàn thành (success) · Sắp đến hạn (warning) · Quá hạn / Không đạt (danger) · Đã nộp, Vắng thi… |
| `ProgressBar`        | Có nhãn %, `aria-valuenow`                                                                                                             |
| `DataTable`          | Phân trang server, sắp xếp, bộ lọc, trạng thái rỗng/lỗi, cuộn ngang trên mobile hoặc chuyển thẻ                                        |
| `ConfirmDialog`      | Tiêu đề, mô tả, hành động chính/hủy; hành động nguy hiểm màu danger                                                                    |
| `EmptyState`         | Hình đơn giản, tiêu đề, mô tả, nút hành động nếu có                                                                                    |
| `QuestionPalette`    | Ô số: chưa làm (viền), đã làm (primary-soft), đang xem (viền primary), đánh dấu (chấm amber); tóm tắt Đã làm/Chưa làm/Đánh dấu         |
| `ExamTimer`          | Từ `deadline_at` server; đổi màu warning < 5 phút, danger < 1 phút; `aria-live` thông báo mốc                                          |
| `CertificatePreview` | Mẫu cấu hình được; tải PDF                                                                                                             |

## 5. Mẫu trạng thái

- **Loading**: skeleton cùng hình dạng nội dung.
- **Empty**: giải thích vì sao trống + việc tiếp theo ("Bạn chưa được phân công khóa nào…").
- **Error**: thông điệp tiếng Việt dễ hiểu + nút Thử lại; không lộ chi tiết kỹ thuật/secret.
- **Success**: toast ngắn; thao tác quan trọng có màn hình kết quả.

## 6. Ngôn ngữ & định dạng

Tiếng Việt, xưng hô trung tính ("Bạn"). Ngày `dd/MM/yyyy`, giờ `HH:mm`; luôn chuyển từ UTC sang Asia/Ho_Chi_Minh ở một hàm định dạng duy nhất. Không hiển thị điểm/tỷ lệ nếu chưa có dữ liệu (hiện "—", không phải 0).

## 7. Responsive & truy cập

- Breakpoint: 360 · 768 · 1024 · 1280. Vùng chạm ≥ 44px.
- Điều hướng bàn phím, focus rõ, label cho mọi input, `prefers-reduced-motion`.
- Màn hình thi: chọn đáp án bằng chạm toàn hàng; cảnh báo trước khi rời trang.

## 8. Hình ảnh & tài sản

Logo tạm dạng chữ "Minh Kỳ Academy" cho tới khi có logo chính thức. Ảnh bìa mặc định: gradient/hình hình học do Minh Kỳ tạo. Không dùng tài nguyên từ ảnh tham chiếu.

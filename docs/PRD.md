# PRD — MINH KỲ ACADEMY

> Trạng thái: **DRAFT chờ duyệt** (2026-10-25). Chưa có source code ứng dụng.
> Nguồn: brief của Chủ tịch + khảo sát 17 ảnh tham chiếu trong `references/lms-vingroup/` (chỉ lấy cảm hứng UX; không dùng logo, hình, tên khóa học hay màu của đơn vị khác).

## 1. Mục tiêu

Hệ thống LMS nội bộ cho hệ sinh thái Minh Kỳ Group: đào tạo, học tập, thi online, theo dõi tuân thủ đào tạo bắt buộc.

Đơn vị mẫu (dữ liệu demo, không hardcode trong code): Ô tô VinFast, Xe máy điện VinFast/TAILG, Gara sửa chữa ô tô, Phụ tùng, Văn phòng.

Chỉ số thành công MVP:

- 100% nhân viên được phân công nhìn thấy việc phải học/thi và hạn trên dashboard.
- Quản lý xem được tiến độ, quá hạn, tỷ lệ đạt của đội trong phạm vi phụ trách mà không cần xuất Excel thủ công.
- Kết quả thi tin cậy: chấm điểm, thời gian và đáp án do server kiểm soát.

## 2. Vai trò (RBAC + phạm vi)

| Vai trò                  | Portal                             | Phạm vi dữ liệu                                |
| ------------------------ | ---------------------------------- | ---------------------------------------------- |
| Learner (Nhân viên)      | `/app`                             | Chỉ dữ liệu của chính mình                     |
| Manager (Quản lý)        | `/manager` (+ `/app` của bản thân) | Cây đơn vị/chi nhánh được gán (gồm đơn vị con) |
| Training Admin (Đào tạo) | `/admin`                           | Theo đơn vị được gán (mặc định toàn tổ chức)   |
| System Admin             | `/admin`                           | Toàn hệ thống, quản lý user/role/audit         |

Quyền lấy từ bảng `user_role_assignments(user, role, scope_unit)` — không dùng `user_metadata`. Một người có thể có nhiều vai trò ở nhiều phạm vi.

## 3. Phạm vi

**MVP:** Authentication, Organization/Branch, Learner Dashboard, Course Catalog, Course Management, Learning Progress, Question Bank, Timed MCQ Exam, Auto Grading, Admin Dashboard. Kèm (đã nêu trong brief): chương trình bắt buộc, chứng chỉ, portal Manager.

**Chưa triển khai:** SCORM runtime, AI sinh câu hỏi, OJT phức tạp, native mobile. Mục menu _Đào tạo tại chỗ_, _Khảo sát_ hiển thị ở sitemap nhưng **ẩn** (feature flag) trong MVP, không để nút giả (xem `UI_GUIDE.md`).

## 4. Khảo sát ảnh tham chiếu

Ánh xạ file → pattern → quyết định cho Minh Kỳ. Tên file theo thứ tự trong `references/lms-vingroup/`.

| #   | Màn hình (ảnh)                   | Pattern quan sát                                                                                                                                                                                                              | Quyết định Minh Kỳ                                                                                                                                                            |
| --- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 01  | Trang chủ learner                | Banner chào + 3 thẻ số (Đang học / Hoàn thành / Chứng chỉ); "Khóa học của tôi"; "Thư viện khóa học"; cột phải: widget KPI giờ học và "Sắp diễn ra"; sidebar nhóm Khám phá / Học tập của tôi / Thành tích; user ở chân sidebar | Giữ bố cục 2 cột + sidebar nhóm. Thay widget "KPI giờ học" bằng **"Việc cần làm"** (hạn học/thi gần nhất, quá hạn) — hữu ích hơn cho tuân thủ. Banner gọn, không minh họa lớn |
| 02  | Thư viện khóa học                | Ô tìm kiếm lớn, nút lọc, chuyển lưới/danh sách; thẻ có ảnh bìa, tag hình thức (Tự học/Kết hợp), tiêu đề, đối tượng                                                                                                            | Giữ. Lọc: đơn vị, danh mục, hình thức, trạng thái đăng ký. Phân trang server                                                                                                  |
| 03  | Chương trình                     | Tab trạng thái có số đếm (Chưa bắt đầu / Đang học / Hoàn thành / Không hoàn thành); thẻ "N bắt buộc", "Đã đăng ký", số khóa, số bài kiểm tra                                                                                  | Giữ làm **Chương trình bắt buộc**. "Không hoàn thành" = quá hạn chưa xong                                                                                                     |
| 04  | Đào tạo tại chỗ (OJT)            | Tab OJT/Đánh giá/Phê duyệt; empty state                                                                                                                                                                                       | **Ngoài MVP**; chỉ giữ chỗ trong sitemap                                                                                                                                      |
| 05  | Kỳ thi của tôi                   | Danh sách theo nhóm; trạng thái (Vắng thi); ca thi, ngày giờ, số câu, thời lượng, điểm đạt, nút Kết quả                                                                                                                       | Giữ. Trạng thái: Sắp thi, Đang mở, Đang làm, Đã nộp, Vắng thi, Hết hạn                                                                                                        |
| 06  | Thông tin kỳ thi                 | Thẻ thông tin (khung giờ, số câu, thời lượng, điểm đạt, số lượt, **cách tính điểm: lấy điểm cao nhất**); hướng dẫn quan trọng; điều kiện tham gia                                                                             | Giữ nguyên cấu trúc. Cách tính điểm cấu hình: cao nhất / lần cuối / lần đầu                                                                                                   |
| 07  | Khảo sát                         | Search + empty state                                                                                                                                                                                                          | Ngoài MVP                                                                                                                                                                     |
| 08  | Chứng chỉ của tôi                | Nhóm "Còn hiệu lực"; mã chứng chỉ; hiệu lực vĩnh viễn; nút Xem chi tiết                                                                                                                                                       | Giữ. Mã `MKA-YYYY-XXXXXX`                                                                                                                                                     |
| 09  | Chi tiết chứng chỉ               | Modal xem trước chứng chỉ; mã, đơn vị cấp, ngày cấp, thời hạn; Tải PDF; link khóa học                                                                                                                                         | Giữ. Mẫu chứng chỉ thương hiệu Minh Kỳ (do Admin cấu hình)                                                                                                                    |
| 10  | Chi tiết khóa học (chưa đăng ký) | Banner tiêu đề + số bài/học phần/giờ; Kỹ năng đạt được; Mục tiêu; **Điều kiện hoàn thành**; Nội dung bài học; cột phải "Đăng ký lớp" (mã lớp, thời gian)                                                                      | Giữ cấu trúc nội dung. Đăng ký lớp có thời gian cố định để Phase 2; MVP: nút **Đăng ký học** cho khóa tự học                                                                  |
| 11  | Xác nhận đăng ký                 | Modal xác nhận 2 nút                                                                                                                                                                                                          | Giữ (confirm dialog)                                                                                                                                                          |
| 12  | Khóa học của tôi (0%)            | Tag Tự học/Đang học; thanh tiến độ; nút Bắt đầu học; tab Nội dung / Thông tin chung                                                                                                                                           | Giữ. Nút đổi thành **Tiếp tục học** khi đã có tiến độ                                                                                                                         |
| 13  | Màn hình bài thi trong player    | Tiêu đề bài + số câu; thẻ Số câu / Thời lượng / Điểm đạt / Số lượt; Lưu ý (tự nộp khi hết giờ; đáp án đúng không hiển thị); nút Bắt đầu làm bài                                                                               | Giữ. Thông tin hiển thị do server trả về                                                                                                                                      |
| 14  | Làm bài thi                      | Header timer + Nộp bài; thẻ câu hỏi (loại, điểm, Đánh dấu); phương án A–D; **bảng điều hướng câu** (đã làm / chưa làm / đánh dấu); Câu trước/Câu sau                                                                          | Giữ toàn bộ. Timer hiển thị theo `deadline_at` từ server, không tin đồng hồ client                                                                                            |
| 15  | Player video                     | Banner "chỉ xem lại, tiến độ không cập nhật"; trình phát tự dựng, thanh tiến độ; cột phải outline bài học có trạng thái; Bài trước/Bài tiếp theo                                                                              | Giữ. Video qua signed URL; lưu vị trí xem                                                                                                                                     |
| 16  | Chi tiết khóa học (có học phần)  | Học phần → bài học; loại nội dung; bắt buộc (*); **khóa bài học theo thứ tự** (icon khóa); đếm x/y bài                                                                                                                        | Giữ: học phần → bài, tuần tự tùy chọn                                                                                                                                         |
| 17  | Player SCORM                     | Khung SCORM + outline                                                                                                                                                                                                         | **Ngoài MVP**. Player MVP: video, PDF, văn bản                                                                                                                                |

Điểm không sao chép: logo/mascot/hình minh họa, hệ màu đỏ-hồng, chứng chỉ mẫu, tên khóa học, nội dung SCORM. Mọi tài sản hình ảnh do Minh Kỳ tạo riêng.

## 5. Yêu cầu chức năng (MVP)

### Chung

- FR-A1 Đăng nhập email + mật khẩu (Supabase Auth); quên/đặt lại mật khẩu; **không đăng ký công khai** — tài khoản do Admin tạo/mời.
- FR-A2 Đăng xuất; hết phiên chuyển về login; chuyển portal theo vai trò.
- FR-A3 Ngôn ngữ tiếng Việt; ngày `dd/MM/yyyy`, giờ 24h, múi giờ Asia/Ho_Chi_Minh; lưu `timestamptz` (UTC).

### Learner

- FR-L1 Dashboard: thẻ số, việc cần làm (quá hạn/sắp đến hạn), khóa đang học, chương trình bắt buộc, kỳ thi sắp tới.
- FR-L2 Thư viện: tìm kiếm, lọc, lưới/danh sách; chỉ thấy khóa được xuất bản và đúng đối tượng/đơn vị.
- FR-L3 Chi tiết khóa học, đăng ký tự học, nhận khóa được phân công.
- FR-L4 Chương trình bắt buộc: tab trạng thái, tiến độ tổng hợp, hạn.
- FR-L5 Học: video, PDF, văn bản; tiến độ tự lưu; bài tuần tự bị khóa tới khi đủ điều kiện; học lại không ghi đè hoàn thành.
- FR-L6 Thi trắc nghiệm có giờ (mục 6); xem kết quả theo chính sách của bài thi.
- FR-L7 Chứng chỉ: tự cấp khi đạt điều kiện hoàn thành khóa; xem, tải PDF.

### Admin

- FR-D1 Tổ chức: cây đơn vị/chi nhánh, chức danh, nhân viên (tạo, mời, vô hiệu hóa, gán đơn vị/chức danh/vai trò + phạm vi), import CSV (post-M7 nếu cần).
- FR-D2 Khóa học: tạo/sửa/xuất bản/lưu trữ; học phần, bài học (video/PDF/văn bản/bài thi); thứ tự; bắt buộc; điều kiện hoàn thành; đối tượng hiển thị.
- FR-D3 Chương trình: gom nhiều khóa, đánh dấu bắt buộc, hạn.
- FR-D4 Ngân hàng câu hỏi: ngân hàng → câu hỏi (1 đáp án / nhiều đáp án / đúng-sai), độ khó, thẻ, ảnh; trạng thái nháp/đã duyệt; sửa câu hỏi **không** ảnh hưởng lượt thi đã diễn ra.
- FR-D5 Bài thi: cấu hình thời lượng, điểm đạt, số lượt, cách tính điểm, khung giờ mở/đóng, xáo trộn, chính sách hiển thị kết quả/đáp án, nguồn câu hỏi (cố định hoặc rút ngẫu nhiên theo quy tắc).
- FR-D6 Phân công học/thi cho cá nhân / đơn vị / chức danh, có hạn; theo dõi trạng thái.
- FR-D7 Lượt thi: xem danh sách, chi tiết bài làm, mở thêm lượt (có lý do, có audit).
- FR-D8 Báo cáo: tiến độ, tỷ lệ đạt, quá hạn theo đơn vị/khóa; xuất CSV theo quyền.
- FR-D9 Dashboard Admin, nhật ký audit.

### Manager

- FR-M1 Dashboard đội: tổng nhân viên, % hoàn thành, quá hạn, tỷ lệ đạt.
- FR-M2 Danh sách nhân viên trong phạm vi + chi tiết tiến độ/kết quả từng người.
- FR-M3 Danh sách quá hạn; kết quả thi theo bài thi. Chỉ đọc; không sửa điểm.

## 6. Thi trắc nghiệm có giờ — quy tắc cốt lõi

1. Bắt đầu lượt thi chỉ qua server; server kiểm tra: đã được phân công, trong khung giờ, còn lượt, không có lượt đang làm (nếu có → tiếp tục lượt đó).
2. Server tạo **snapshot** câu hỏi, thứ tự, phương án, điểm từng câu, cấu hình bài thi. Sửa/xóa câu hỏi gốc sau đó không đổi lượt đã tạo.
3. `deadline_at = min(started_at + thời lượng, giờ đóng bài thi)` do server tính; mọi lần lưu đáp án/nộp bài kiểm tra lại.
4. Client **không** nhận đáp án đúng, trước và sau khi nộp (trừ khi chính sách bài thi cho phép xem lại, và chỉ sau khi nộp).
5. Hết giờ: server tự nộp (vừa khi có request vừa bằng job quét định kỳ), chấm với đáp án đã lưu; nộp muộn sau hạn + dung sai nhỏ bị từ chối, giữ đáp án đã lưu.
6. Nộp bài **idempotent**: nộp lặp/retry trả cùng kết quả, không chấm hai lần.
7. Chấm điểm: câu 1 đáp án đúng/sai; nhiều đáp án = đúng khi chọn đúng toàn bộ (MVP không chấm điểm từng phần); điểm = tổng điểm đạt / tổng điểm; đạt khi ≥ điểm đạt.
8. Điểm bài thi theo cách tính cấu hình (cao nhất / gần nhất / đầu tiên).

## 7. Yêu cầu phi chức năng

- Bảo mật: RLS mọi bảng exposed; không `service_role` ở client; secret chỉ server; file private + signed URL ngắn hạn; audit log; kiểm tra quyền ở server cho mọi thao tác ghi.
- Hiệu năng: danh sách phân trang server; chỉ mục theo bộ lọc; trang learner chính tải < 2.5s trên 4G (đo ở M9).
- Mobile: mọi màn hình learner dùng được ≥ 360px; làm bài thi dùng được trên điện thoại.
- Khả dụng: loading / empty / error / success cho mọi màn hình dữ liệu; a11y cơ bản (focus, aria, tương phản AA).
- Vận hành: migration trong git; seed demo tách khỏi dữ liệu thật; CI chạy lint/typecheck/test/build; không đụng production khi chưa được phê duyệt.

## 8. Giả định & điểm cần Chủ tịch xác nhận

| #   | Nội dung                                           | Mặc định đề xuất                                                                                 |
| --- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Q1  | Nhận diện thương hiệu (logo, màu)                  | Màu **teal/emerald + amber** (xem `UI_GUIDE.md`), logo tạm dạng chữ; thay khi có logo chính thức |
| Q2  | Đăng nhập                                          | Email + mật khẩu, Admin mời; SSO/Google để sau                                                   |
| Q3  | "Đăng ký lớp" có thời gian cố định (như ảnh 10–11) | Dời sang sau MVP; MVP dùng phân công + hạn                                                       |
| Q4  | Chứng chỉ                                          | Cấp khi hoàn thành khóa; mặc định vô thời hạn, cho phép cấu hình hạn                             |
| Q5  | Chấm nhiều đáp án                                  | Đúng toàn bộ mới được điểm                                                                       |
| Q6  | Project Supabase / Vercel để dùng                  | Chưa chọn; **sẽ hỏi trước khi kết nối**, M0–M3 chạy hoàn toàn local/mock                         |
| Q7  | Nhân viên thuộc nhiều đơn vị                       | Cho phép 1 đơn vị chính + các gán vai trò theo phạm vi                                           |

## 9. Rủi ro chính

| Rủi ro                         | Giảm thiểu                                                                               |
| ------------------------------ | ---------------------------------------------------------------------------------------- |
| Lộ đáp án qua API/RLS          | Đáp án ở bảng riêng không cấp quyền cho learner; chấm trong RPC; test truy cập trực tiếp |
| Gian lận thời gian             | Đồng hồ server, `deadline_at`, kiểm tra mọi request, job nộp tự động                     |
| Phân quyền phạm vi sai         | Hàm `has_permission(perm, unit)` dùng chung, test ma trận quyền (pgTAP + integration)    |
| Làm UI mock xong phải viết lại | Tầng repository có interface chung; mock và Supabase là hai implementation               |
| Video lớn/streaming            | MVP dùng Storage + signed URL; HLS/CDN chuyên dụng để sau khi đo nhu cầu                 |

# CLAUDE.md — MINH KỲ ACADEMY (LMS)

> Hướng dẫn làm việc lâu dài cho dự án LMS đào tạo/thi online của Minh Kỳ Group. Không chứa secret.

## 1. Vai trò và cách làm việc

- Bạn là kiến trúc sư kiêm kỹ sư full-stack. Chủ dự án: Nguyễn Quốc Kỳ; giao tiếp **tiếng Việt**, trình bày thẳng, ngắn gọn, có bằng chứng kiểm tra.
- Không bịa dữ liệu/kết quả test/trạng thái triển khai. Không tuyên bố hoàn tất khi mới có UI/mock.
- Tự quyết các lựa chọn kỹ thuật thông thường; chỉ hỏi khi ảnh hưởng nghiệp vụ, quyền truy cập hoặc không thể đảo ngược.
- **Cổng duyệt:** không viết source code ứng dụng trước khi thiết kế (docs/) được duyệt; không nối Supabase/triển khai trước khi UI mock được duyệt; không thay đổi production khi chưa được phê duyệt rõ ràng; không tự chọn project Supabase/Vercel có sẵn.

## 2. Tài liệu (đọc trước khi làm)

`docs/PRD.md` · `docs/ARCHITECTURE.md` · `docs/DATABASE.md` · `docs/IMPLEMENTATION_PLAN.md` · `docs/UI_GUIDE.md`. Khi triển khai bổ sung `docs/PROGRESS.md` (đã xong/đang làm/còn thiếu/bằng chứng test), `docs/DECISIONS.md`, `docs/DEPLOYMENT.md`. Cập nhật tài liệu khi yêu cầu đổi. Ảnh tham chiếu ở `references/lms-vingroup/` chỉ để nghiên cứu UX — **không** sao chép logo, hình, màu hay nội dung độc quyền.

## 3. Công nghệ

Next.js App Router, React, TypeScript strict (không `any`, không tắt kiểm tra), Tailwind, shadcn/ui, Lucide, React Hook Form + Zod, Supabase (Postgres/Auth/Storage/RLS), Vercel, Vitest, Playwright. Dùng bản stable, khóa phiên bản, commit lockfile. Kiểm tra docs chính thức và `--help`/phiên bản đã cài trước khi dùng API/CLI có thể đã đổi — không đoán.

## 4. Bất biến bảo mật (bắt buộc)

- RLS cho **mọi** bảng exposed; mặc định từ chối; `anon` không có quyền.
- Quyền lấy từ `user_role_assignments` (RBAC + phạm vi đơn vị). **Không** dùng `user_metadata` để quyết định quyền.
- Không đưa `service_role`/secret vào client, `NEXT_PUBLIC_*`, git, log, ảnh chụp hay chat. Server-only, tách module.
- Đáp án đúng nằm ở bảng riêng, learner không có quyền đọc (RLS không che cột). Chấm điểm/hạn thi/bắt đầu/nộp bài chỉ qua RPC server, đồng hồ DB, idempotent, snapshot theo lượt thi, tự nộp khi hết giờ.
- `SECURITY DEFINER` chỉ cho tập RPC cố định, `search_path` rỗng, kiểm tra `auth.uid()` và quyền bên trong; có test truy cập trái phép.
- Storage mặc định private + signed URL ngắn hạn; kiểm tra loại/kích thước tệp.
- Audit log append-only cho thao tác quản trị nhạy cảm. Không log dữ liệu cá nhân không cần thiết.
- Ẩn UI không phải phân quyền; luôn kiểm tra ở server/DB và test bằng ID trực tiếp.

## 5. Quy tắc lập trình

- Tổ chức theo miền (`src/features/<miền>`); component không gọi Supabase trực tiếp mà qua `repo`. Tránh file/component khổng lồ và abstraction thừa.
- Validate cả client và server (Zod) và bằng constraint DB. Thao tác ghi quan trọng dùng transaction/khóa/ràng buộc.
- Danh sách phân trang phía server; có index phù hợp bộ lọc. Không tải toàn bộ để lọc ở trình duyệt.
- Không hardcode dữ liệu nghiệp vụ (đơn vị, khóa học, vai trò…) — dùng DB/seed. Dữ liệu demo/mock tách khỏi dữ liệu thật; build production không cho phép nguồn mock.
- Không xóa cứng dữ liệu đào tạo/kết quả; dùng lưu trữ (`archived_at`) và audit.
- Giao diện: tiếng Việt, `dd/MM/yyyy`, Asia/Ho_Chi_Minh (một hàm định dạng), responsive từ 360px, đủ loading/empty/error/success. Không nút giả.

## 6. Git và kiểm thử

- Làm trên nhánh được giao; commit theo thay đổi có ý nghĩa; không commit secret, `node_modules`, build output, dữ liệu thật. Không force-push. Không tạo PR nếu chưa được yêu cầu.
- Migration lưu trong `supabase/migrations`, chạy thử local trước; không chỉnh schema production ngoài quy trình.
- Trước khi báo xong: chạy thật `lint`, `typecheck`, `test`, `build` (+ pgTAP/E2E khi có) và ghi kết quả vào `docs/PROGRESS.md`. Nêu rõ phần chưa chạy được. Ưu tiên test rủi ro nghiệp vụ: phân quyền theo phạm vi, rò rỉ đáp án, snapshot, hết giờ, nộp trùng, chấm điểm, báo cáo khớp dữ liệu gốc.

## 6b. Phạm vi MVP

Có: Auth, Organization/Branch, Learner Dashboard, Course Catalog, Course Management, Learning Progress, Question Bank, Timed MCQ Exam, Auto Grading, Admin Dashboard (+ chương trình bắt buộc, chứng chỉ, portal Manager).
Chưa làm: SCORM runtime, AI sinh câu hỏi, OJT phức tạp, khảo sát, native app, lớp/ca thi lịch cố định, SSO.

## 7. Next.js 16

Khi viết code Next.js, đọc `AGENTS.md` và tài liệu đi kèm trong `node_modules/next/dist/docs/` (API có thể khác kiến thức cũ). `AGENTS.md` do `next dev` tạo lại, giữ trong git.

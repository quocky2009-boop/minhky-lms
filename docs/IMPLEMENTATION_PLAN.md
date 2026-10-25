# IMPLEMENTATION PLAN — MINH KỲ ACADEMY

> DRAFT chờ duyệt. **Cổng 0:** chưa viết code cho tới khi Chủ tịch duyệt `PRD`, `ARCHITECTURE`, `DATABASE`, `UI_GUIDE` và trả lời các câu hỏi Q1–Q7 trong PRD (hoặc chấp nhận mặc định).
> **Cổng 1:** sau M3 (UI mock hoàn chỉnh) dừng để Chủ tịch duyệt giao diện trước khi nối Supabase.

## 1. Sitemap

```
Công khai
 /login · /forgot-password · /reset-password · /auth/callback

Learner  /app
 ├ dashboard
 ├ catalog                         Thư viện khóa học
 │   └ [courseId]                  Chi tiết + Đăng ký học
 ├ programs                        Chương trình bắt buộc (tab trạng thái)
 │   └ [programId]
 ├ my-courses                      Khóa học của tôi
 │   └ [courseId]                  Nội dung / Thông tin chung
 ├ learn/[courseId]/[itemId]       Player video · PDF · văn bản (outline bên phải)
 ├ exams                           Kỳ thi của tôi
 │   └ [examId]                    Thông tin kỳ thi
 │      ├ attempt/[attemptId]      Làm bài
 │      └ attempt/[attemptId]/result
 ├ certificates                    + modal chi tiết / Tải PDF
 ├ profile
 └ (ẩn bằng feature flag) ojt · surveys

Manager  /manager
 ├ dashboard
 ├ team  └ [userId]
 ├ overdue
 └ results (theo bài thi)

Admin  /admin
 ├ dashboard
 ├ org  (đơn vị/chi nhánh) · job-titles
 ├ employees  └ [userId]  (+ vai trò & phạm vi)
 ├ courses  └ [id] (thông tin · học phần/bài · cài đặt · đối tượng)
 ├ programs └ [id]
 ├ question-banks └ [id]/questions
 ├ exams  └ [id] (cấu hình · nguồn câu hỏi · lượt thi)
 ├ assignments
 ├ reports (tiến độ · kết quả thi · quá hạn)
 ├ certificates (mẫu · đã cấp)
 ├ audit-logs
 └ settings
```

## 2. Milestones

Mỗi milestone kết thúc bằng: cập nhật `docs/PROGRESS.md` (bằng chứng lệnh kiểm thử thật), commit rõ ràng, chạy `lint`, `typecheck`, `test`, `build`.

### Giai đoạn A — UI bằng mock (chưa cần Supabase)

**M0 — Khởi tạo nền tảng**
- Next.js App Router + TS strict, Tailwind, shadcn/ui, Lucide, RHF, Zod, Vitest, Playwright; khóa phiên bản + lockfile; ESLint/Prettier; GitHub Actions CI; `.env.example`; `docs/PROGRESS.md`, `DECISIONS.md`.
- Chấp nhận: `npm ci && lint && typecheck && test && build` xanh; CI xanh trên nhánh.

**M1 — Design system & AppShell**
- Design tokens (UI_GUIDE), font, Sidebar (3 portal), PageHeader, EmptyState, StatusBadge, DataTable, ConfirmDialog, skeleton/loading/error; trang `/login` (mock).
- Chấp nhận: responsive 360 / 768 / 1280; sidebar thu gọn; a11y cơ bản (focus, tương phản AA); Playwright smoke mobile + desktop.

**M2 — Learner portal (mock)**
- dashboard, catalog + chi tiết + đăng ký, programs, my-courses, player (video/PDF/văn bản), exams (danh sách, thông tin, làm bài có timer + bảng câu hỏi + đánh dấu, kết quả), certificates (+ xem/tải PDF mock).
- Chấp nhận: đủ 4 trạng thái UI (loading/empty/error/success) mỗi màn hình; luồng thi chạy end-to-end với mock; timer & nộp tự động khi hết giờ trong mock.

**M3 — Admin & Manager portal (mock)**
- Admin: dashboard, org, employees, courses (+ trình soạn học phần/bài), question banks, exams, assignments, reports, audit. Manager: dashboard, team, overdue, results. Form bằng RHF+Zod.
- Chấp nhận: mọi form validate đúng; bảng lọc/phân trang giả lập; dữ liệu mock có nhãn demo. **→ Cổng 1: Chủ tịch duyệt UI.**

### Giai đoạn B — Backend thật (sau khi duyệt UI)

> Trước M4: hỏi Chủ tịch xác nhận project Supabase/Vercel đích; không tự chọn project có sẵn; không thay đổi production.

**M4 — Supabase nền tảng: schema, Auth, RBAC, org**
- Supabase CLI local; migrations: org_units, profiles, roles/permissions/assignments, hàm `has_permission`/`manages_user`; RLS; Auth qua `@supabase/ssr` (login/logout/reset, mời user); middleware chuyển portal theo vai trò đọc từ DB; seed demo.
- Chấp nhận: pgTAP ma trận quyền (learner/manager/admin, đọc & ghi bằng ID trực tiếp); thu hồi vai trò có hiệu lực ở request kế tiếp; không có `user_metadata` trong quyết định quyền (grep/lint rule); không bảng exposed nào thiếu RLS (kiểm tra bằng advisor/query).

**M5 — Courses, Storage, Progress**
- Bảng khóa/học phần/bài/chương trình; Storage private + signed URL; Admin CRUD thật; Learner học, tiến độ, hoàn thành khóa, bài tuần tự bị khóa.
- Chấp nhận: learner không tải được file của khóa không thuộc quyền (test ID/đường dẫn trực tiếp); tiến độ chính xác sau học lại; phân trang & tìm kiếm phía server.

**M6 — Question bank & Exam engine**
- Ngân hàng + bảng khóa đáp án riêng; cấu hình bài thi; RPC `start/save/submit/expire`; snapshot; cron; màn hình làm bài thật.
- Chấp nhận: xem mục 3 (acceptance thi); test đồng thời nộp trùng; learner không đọc được bảng key; hết giờ tự nộp.

**M7 — Assignments, enrollments, Manager portal**
- Phân công theo user/đơn vị/chức danh, mở rộng idempotent, quá hạn; báo cáo & dashboard Manager/Admin; xuất CSV theo quyền.
- Chấp nhận: Manager chỉ thấy phạm vi mình; số liệu báo cáo khớp bản ghi gốc; CSV không chứa cột ngoài quyền.

**M8 — Certificates & Audit**
- Cấp chứng chỉ tự động khi đủ điều kiện, PDF, mã duy nhất, thu hồi; audit log đầy đủ cho thao tác nhạy cảm.
- Chấp nhận: cấp lặp không tạo trùng; audit không sửa/xóa được bằng quyền ứng dụng; chứng chỉ chỉ chủ sở hữu/Admin/Manager trong phạm vi tải được.

**M9 — Hoàn thiện, kiểm thử, triển khai**
- E2E Playwright cho 3 portal (desktop + mobile), tối ưu hiệu năng, `DEPLOYMENT.md` (env, migration, deploy, sao lưu/khôi phục DB và Storage), preview deploy; production chỉ khi được phê duyệt.
- Chấp nhận: toàn bộ acceptance MVP ở mục 3 đạt, có bằng chứng; kiểm thử khôi phục sao lưu trên môi trường dev.

## 3. Acceptance criteria (MVP)

**Xác thực & phân quyền**
1. Không đăng ký công khai; người chưa đăng nhập bị chuyển về `/login` ở mọi route portal.
2. Learner truy cập `/admin`/`/manager` hoặc gọi API tương ứng bằng ID trực tiếp → bị từ chối (cả đọc và ghi).
3. Manager chỉ thấy nhân viên trong cây đơn vị được gán; đổi/thu hồi phạm vi có hiệu lực ngay.
4. RLS bật cho mọi bảng exposed; `anon` không đọc được dữ liệu nào.

**Học tập**
5. Thư viện lọc/tìm/phân trang phía server; chỉ khóa `published` đúng đối tượng.
6. Tiến độ video/PDF lưu và khôi phục; bài tuần tự chưa đủ điều kiện bị khóa cả ở server.
7. Hoàn thành khóa khi đủ điều kiện (bài bắt buộc + bài thi đạt nếu có); chương trình bắt buộc tổng hợp đúng.

**Thi**
8. Bắt đầu thi tạo snapshot (câu, thứ tự, phương án); sửa/xóa câu gốc không đổi lượt đã tạo.
9. Client không bao giờ nhận đáp án đúng khi đang làm bài; learner không đọc được bảng khóa đáp án bằng truy vấn trực tiếp.
10. Hết giờ tự nộp (cả khi đóng trình duyệt — qua cron); lưu/nộp sau `deadline_at` (quá dung sai) bị từ chối.
11. Nộp trùng/đồng thời/retry cho **một** kết quả duy nhất, một lần chấm.
12. Điểm, đạt/không đạt, số lượt tối đa, cách tính điểm (cao nhất/gần nhất/đầu tiên) đúng với bộ test; một lượt `in_progress` mỗi (bài thi, người).
13. Dùng được trên điện thoại 360px: bảng điều hướng câu, đánh dấu, timer.

**Quản trị & báo cáo**
14. Admin tạo được: đơn vị, nhân viên, khóa + học phần + bài, câu hỏi, bài thi, phân công — và learner liên quan thấy ngay.
15. Số liệu dashboard/báo cáo khớp bản ghi gốc; CSV tôn trọng quyền.
16. Chứng chỉ cấp đúng một lần/khóa/người, tải PDF, mã duy nhất.
17. Mọi thao tác nhạy cảm có dòng audit; người dùng thường không sửa được audit.

**Chất lượng**
18. Mọi màn hình dữ liệu có loading/empty/error/success; tiếng Việt, `dd/MM/yyyy`, Asia/Ho_Chi_Minh.
19. Không secret trong git/log/bundle client; `.env.example` chỉ placeholder.
20. `lint`, `typecheck`, unit, integration, pgTAP, E2E đều chạy trong CI và xanh; phần chưa chạy được ghi rõ.

## 4. Ngoài phạm vi (nhắc lại)

SCORM runtime, AI sinh câu hỏi, OJT phức tạp, khảo sát, native app, ca thi/lớp học có lịch cố định (Phase 2), chấm điểm từng phần, SSO.

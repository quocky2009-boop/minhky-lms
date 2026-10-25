# ARCHITECTURE — MINH KỲ ACADEMY

> DRAFT chờ duyệt. Không ghi phiên bản package cụ thể ở đây: khi khởi tạo (M0) kiểm tra `npm view`/docs hiện hành, chọn bản stable, khóa phiên bản và commit lockfile.

## 1. Tổng quan

```
Browser ──► Next.js (Vercel)  ──► Supabase
 React UI    App Router            ├─ Auth (JWT)
             Server Components     ├─ PostgreSQL + RLS + RPC
             Server Actions        ├─ Storage (private buckets)
             Route Handlers        └─ (cron / scheduled job)
```

- **Next.js App Router + TypeScript strict**: Server Components đọc dữ liệu; Server Actions cho thao tác ghi; Route Handlers cho webhook/cron/tải file.
- **Supabase**: Auth, Postgres (nguồn sự thật), Storage. Truy cập bằng publishable key + JWT người dùng qua `@supabase/ssr`; RLS thực thi quyền.
- **Vercel**: deploy; preview không nối production DB.
- **Quy tắc secret**: không `service_role` ở client hay `NEXT_PUBLIC_*`. `service_role` chỉ dùng trong job server-side đặc biệt (cron nộp bài tự động), tách module `lib/supabase/admin.ts` có `import 'server-only'`, và ưu tiên thay bằng RPC giới hạn quyền nếu khả thi.

## 2. Ranh giới tin cậy

| Việc                       | Nơi quyết định                        | Ghi chú                                                     |
| -------------------------- | ------------------------------------- | ----------------------------------------------------------- |
| Ai là ai, vai trò, phạm vi | Postgres (`user_role_assignments`)    | Không đọc từ `user_metadata`; JWT chỉ cung cấp `auth.uid()` |
| Được đọc/ghi hàng nào      | RLS                                   | Mọi bảng exposed bật RLS, mặc định từ chối                  |
| Cột nhạy cảm (đáp án)      | Bảng riêng, không cấp RLS cho learner | RLS lọc hàng, không che cột                                 |
| Bắt đầu/nộp/chấm bài thi   | RPC Postgres                          | Giao dịch nguyên tử, khóa hàng, idempotent                  |
| Giờ làm bài                | `now()` của DB                        | Không tin giờ client                                        |
| Hiển thị/UX                | Client                                | Chỉ là tiện ích; ẩn nút không phải kiểm soát quyền          |

### RPC và SECURITY DEFINER

Đáp án ở bảng không ai (ngoài admin) đọc được nên việc chấm phải chạy bằng quyền cao hơn learner. Chỉ cho phép một **tập nhỏ RPC cố định** dạng `SECURITY DEFINER`:
`start_exam_attempt`, `save_attempt_answer`, `submit_exam_attempt`, `expire_overdue_attempts`, `issue_certificate`.
Ràng buộc bắt buộc: `SET search_path = ''` (tên đối tượng đầy đủ schema), kiểm tra `auth.uid()` và quyền bên trong hàm, `REVOKE ALL FROM PUBLIC` rồi `GRANT EXECUTE` đúng role, có pgTAP test truy cập trái phép. Không dùng SECURITY DEFINER cho truy vấn thông thường — dùng view `security_invoker` hoặc RLS.

## 3. RBAC + phạm vi

```
roles ─< role_permissions >─ permissions
user ─< user_role_assignments(role_id, scope_unit_id) >─ roles
org_units: cây (parent_id, path)
```

- Hàm `app.has_permission(perm text, unit uuid)`: có gán vai trò chứa `perm` tại một `scope_unit` là tổ tiên (hoặc chính) của `unit`. Dùng `path` (materialized path) để kiểm tra tổ tiên bằng một truy vấn có chỉ mục.
- Hàm `app.manages_user(target uuid)`: target thuộc đơn vị nằm trong cây phạm vi của người gọi (Manager).
- Policy mẫu: `learner` đọc dòng của chính mình (`user_id = auth.uid()`); `manager` đọc nếu `manages_user(user_id)`; `admin` theo `has_permission('x.manage', unit_id)`.
- Hiệu lực khi thu hồi quyền: kiểm tra DB mỗi request nên có hiệu lực ngay; không cache vai trò trong JWT/cookie. Layout server chỉ cache trong request.
- Hiệu năng RLS: hàm đánh dấu `STABLE`, bọc `(select auth.uid())`, chỉ mục trên cột scope/user.

## 4. Cấu trúc thư mục đề xuất

```
minhky-lms/
├─ CLAUDE.md  README.md
├─ docs/                       PRD, ARCHITECTURE, DATABASE, IMPLEMENTATION_PLAN, UI_GUIDE, (PROGRESS, DECISIONS, DEPLOYMENT khi triển khai)
├─ references/lms-vingroup/    ảnh tham chiếu (chỉ để đọc)
├─ supabase/
│  ├─ migrations/              SQL có thứ tự thời gian
│  ├─ seed.sql                 dữ liệu demo (tách khỏi dữ liệu thật)
│  └─ tests/                   pgTAP: RLS, RPC thi
├─ src/
│  ├─ app/
│  │  ├─ (auth)/login, forgot-password, reset-password
│  │  ├─ auth/callback/route.ts
│  │  ├─ (learner)/app/...      dashboard, catalog, programs, my-courses, learn, exams, certificates
│  │  ├─ (admin)/admin/...      org, employees, courses, programs, question-banks, exams, assignments, reports, audit
│  │  ├─ (manager)/manager/...  dashboard, team, overdue, results
│  │  └─ api/cron/expire-attempts/route.ts
│  ├─ components/
│  │  ├─ ui/                   shadcn/ui
│  │  ├─ layout/               AppShell, Sidebar, PageHeader
│  │  └─ shared/               EmptyState, DataTable, StatusBadge, ConfirmDialog
│  ├─ features/<miền>/         auth | org | courses | learning | question-bank | exams | assignments | certificates | reports | audit
│  │  ├─ components/  actions/  repo/ (interface + mock + supabase)  schemas/ (Zod)  types.ts
│  ├─ lib/
│  │  ├─ supabase/ (server.ts, client.ts, admin.ts)  rbac/  format/ (ngày, VND không cần)  env.ts
│  └─ mocks/                  dữ liệu mock cho M1–M3 (xóa/thay ở M4+)
└─ tests/ unit/  integration/  e2e/
```

Quy tắc: tổ chức theo miền nghiệp vụ; component không gọi Supabase trực tiếp mà qua `features/*/repo`. Không file/component quá lớn.

## 5. Chiến lược mock → thật

- Mỗi miền định nghĩa `interface XRepo` (kiểu trả về TypeScript đã chốt từ `DATABASE.md`).
- `mock` implementation dùng dữ liệu tĩnh trong `src/mocks` (nhãn rõ là demo); `supabase` implementation thay vào ở M4+.
- Chọn implementation bằng biến `NEXT_PUBLIC_DATA_SOURCE=mock|supabase` (không nhạy cảm). Production build **không cho phép** `mock`.
- Zod schema dùng chung client/server; server luôn validate lại.

## 6. Luồng thi (tuần tự)

```
Client            Server Action        Postgres RPC
  │ Bắt đầu ───────► start ───────────► start_exam_attempt(exam)
  │                                     · khóa hàng exam/enrollment, kiểm tra điều kiện
  │                                     · rút/xáo câu → ghi snapshot attempt_questions
  │ ◄──── attempt{deadline_at, câu hỏi (không đáp án)}
  │ Chọn đáp án ───► save ───────────► save_attempt_answer(attempt, q, options, flagged)
  │                                     · now() ≤ deadline_at + dung sai, status=in_progress
  │ Nộp / hết giờ ─► submit ─────────► submit_exam_attempt(attempt, idempotency_key)
  │                                     · UPDATE … WHERE status='in_progress' RETURNING
  │                                     · chấm bằng attempt_question_keys, ghi điểm, passed
  │ ◄──── kết quả (theo chính sách hiển thị)
Cron mỗi phút ──► expire_overdue_attempts() nộp các lượt quá deadline_at
```

- **Chống nộp trùng**: chuyển trạng thái bằng câu lệnh điều kiện duy nhất; lần gọi sau trả kết quả đã lưu. Thêm `unique (attempt_id)` ở bảng kết quả và `idempotency_key`.
- **Hết giờ**: client đếm ngược theo `deadline_at - server_now` (đồng bộ lại định kỳ) và tự gọi submit; nếu client biến mất, cron nộp thay. Đọc lại lượt cũ cũng tự "finalize" nếu quá hạn (lazy).
- **Mất mạng**: đáp án lưu từng câu; client hàng đợi ngắn có retry; lần nộp cuối gửi toàn bộ đáp án hiện có (idempotent theo câu).

## 7. Storage

| Bucket           | Nội dung            | Truy cập                                                                             |
| ---------------- | ------------------- | ------------------------------------------------------------------------------------ |
| `course-media`   | video, PDF, ảnh bìa | private; Storage policy theo quyền học khóa; signed URL ~ vài chục phút              |
| `question-media` | ảnh trong câu hỏi   | private; chỉ attempt đang làm/Admin; signed URL ngắn                                 |
| `certificates`   | PDF chứng chỉ       | private; chủ sở hữu/Admin/Manager trong phạm vi                                      |
| `branding`       | logo, mẫu chứng chỉ | admin ghi; đọc qua signed URL hoặc public riêng nếu không nhạy cảm (quyết định ở M9) |

Kiểm tra loại/kích thước tệp ở server trước khi cấp upload URL. Không dùng URL công khai cho nội dung khóa học.

## 8. Audit log

Bảng `audit_logs` append-only (không UPDATE/DELETE cho mọi role ứng dụng). Ghi bằng trigger/RPC cho: tạo/sửa/xóa user & gán vai trò, đổi phạm vi, xuất bản/lưu trữ khóa, sửa câu hỏi đã duyệt, cấu hình bài thi, mở thêm lượt thi, sửa/hủy kết quả, cấp/thu hồi chứng chỉ, xuất báo cáo. Lưu actor, hành động, đối tượng, diff trước/sau (không chứa dữ liệu nhạy cảm không cần thiết), thời điểm. Chỉ quyền `audit.view` đọc được.

## 9. Kiểm thử

| Tầng        | Công cụ                               | Nội dung                                                                                                                 |
| ----------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Unit        | Vitest                                | Chấm điểm, tính hạn thi, tiến độ, quy tắc cách tính điểm, định dạng ngày/múi giờ, Zod schema                             |
| DB/RLS      | pgTAP (Supabase) + Vitest integration | Ma trận quyền: learner/manager/admin đọc-ghi bằng ID trực tiếp; learner không đọc được đáp án; RPC từ chối trái phép     |
| Integration | Vitest + Supabase local               | Luồng thi nguyên tử, nộp trùng đồng thời, hết giờ, snapshot không đổi khi sửa câu hỏi                                    |
| E2E         | Playwright                            | Learner: đăng nhập → học → thi → chứng chỉ; Admin: tạo khóa/câu hỏi/bài thi/phân công; Manager: báo cáo; mobile viewport |

## 10. CI/CD và môi trường

- GitHub Actions: install (lockfile) → lint → typecheck → unit → build; job riêng: Supabase local + pgTAP + Playwright.
- Môi trường: `local` (Supabase CLI) → `preview` (Vercel preview + Supabase branch/project dev) → `production` (chỉ khi được phê duyệt).
- Migration chạy thử local trước; production chỉ áp dụng khi được duyệt, có kế hoạch khôi phục (xem `DEPLOYMENT.md` ở M9).
- Biến môi trường: `.env.example` chỉ placeholder.

## 11. Quyết định kỹ thuật & lý do (tóm tắt)

| Quyết định                          | Lý do                                                |
| ----------------------------------- | ---------------------------------------------------- |
| Đáp án ở bảng riêng                 | RLS không che cột                                    |
| Chấm bằng RPC nguyên tử             | Chống nộp trùng/race, đồng hồ DB                     |
| Snapshot theo lượt thi              | Sửa ngân hàng câu hỏi không làm sai lịch sử          |
| Gán vai trò theo phạm vi cây đơn vị | Manager thấy đúng chi nhánh/đơn vị mà không hardcode |
| Repository interface                | UI dựng trước bằng mock, đổi nguồn không viết lại    |
| Không SCORM/OJT/AI ở MVP            | Đúng phạm vi đã chốt                                 |

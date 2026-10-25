# PROGRESS

## Trạng thái hiện tại: M0 hoàn thành (chờ push CI xác nhận); tiếp theo M1

### Đã xong

- **Thiết kế** (Cổng 0): PRD, ARCHITECTURE, DATABASE, IMPLEMENTATION_PLAN, UI_GUIDE, CLAUDE.md — đã được duyệt 2026-10-25.
- **M0 — Khởi tạo nền tảng**
  - Next.js App Router, TypeScript strict (+ `noUncheckedIndexedAccess`), Tailwind 4, cấu hình shadcn/ui (`components.json`, `cn`), Lucide, React Hook Form, Zod, Vitest, Playwright.
  - Phiên bản ghim chính xác trong `package.json`; `package-lock.json` được commit.
  - ESLint (có rule cấm `user_metadata`), Prettier, `.env.example` (chỉ placeholder), `.nvmrc`.
  - Tiện ích nền: `lib/format/date.ts` (dd/MM/yyyy, Asia/Ho_Chi_Minh), `lib/env.ts` (chặn nguồn mock ở production).
  - GitHub Actions: lint, typecheck, format, unit, build; job E2E riêng.

### Bằng chứng kiểm thử (chạy cục bộ 2026-10-25, Node 22.22.0)

| Lệnh                                                                  | Kết quả                               |
| --------------------------------------------------------------------- | ------------------------------------- |
| `npm run lint`                                                        | sạch, 0 cảnh báo                      |
| `npm run typecheck`                                                   | sạch                                  |
| `npm run format:check`                                                | sạch                                  |
| `npm test`                                                            | 2 file, 7 test đạt                    |
| `npm run build`                                                       | thành công (`/`, `/_not-found` tĩnh)  |
| `PLAYWRIGHT_CHROMIUM_PATH=/opt/pw-browsers/chromium npm run test:e2e` | 2 test đạt (desktop + mobile Pixel 7) |

### Chưa xác minh

- Workflow CI trên GitHub chưa có kết quả chạy thật (xem mục cuối sau khi push).
- `npm audit` chưa được rà soát.

### Đang làm / Bước tiếp theo

- **M1**: design tokens Minh Kỳ, font Be Vietnam Pro, AppShell + Sidebar 3 portal, các thành phần dùng chung, trang `/login` (mock).

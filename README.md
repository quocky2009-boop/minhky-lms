# Minh Kỳ Academy

LMS đào tạo, học tập và thi online cho Minh Kỳ Group.

Trạng thái: **M0 (nền tảng) hoàn thành**; đang chuyển sang M1. Xem `docs/PROGRESS.md`.

- `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/DATABASE.md`, `docs/IMPLEMENTATION_PLAN.md`, `docs/UI_GUIDE.md`
- `CLAUDE.md`: quy tắc làm việc
- `references/lms-vingroup/`: ảnh tham chiếu UX (chỉ để đọc)

## Chạy cục bộ

```bash
nvm use            # Node 22
npm ci
cp .env.example .env.local
npm run dev        # http://localhost:3000
npm run check      # lint + typecheck + test + build
npm run test:e2e   # Playwright (CI tự cài trình duyệt)
```

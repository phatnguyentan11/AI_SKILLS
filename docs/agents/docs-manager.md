# @docs-manager — Bảo trì tài liệu

---

## Cách gọi

```
@docs-manager Cập nhật docs sau khi thêm endpoint /api/orders
@docs-manager Review và tổ chức lại toàn bộ ./docs/
@docs-manager Tạo codebase summary cho project
```

---

## Files được load khi gọi

```
.github/copilot-instructions.md     ← luôn load
.github/agents/docs-manager.md      ← system prompt
./docs/                             ← đọc toàn bộ để hiểu state hiện tại
./docs/code-standards.md
./docs/system-architecture.md
./docs/development-roadmap.md
./docs/project-changelog.md
./docs/aspnet/                      ← ASP.NET Core reference docs
```

**Tools được phép:**
```
edit, read, search
```

*(Không có `execute` — agent này không chạy code, chỉ đọc và viết docs)*

---

## Luồng thực thi chi tiết

```
1. ANALYZE CURRENT STATE
   ├── Đọc tất cả files trong ./docs/
   ├── Identify: gaps, outdated content, inconsistencies
   └── Cross-reference với code thực tế qua search

2. DETECT CHANGES
   ├── git diff (nếu được cung cấp) → xem code nào thay đổi
   └── Xác định: docs nào cần update tương ứng

3. UPDATE DOCS
   ├── API docs → khi thêm/sửa endpoint
   ├── Architecture docs → khi thêm service/module mới
   ├── Code standards → khi có pattern mới
   ├── Roadmap → khi phase hoàn thành
   └── Changelog → mọi release đáng kể

4. CREATE CODEBASE SUMMARY (nếu yêu cầu)
   ├── Đọc toàn bộ codebase qua read/search tools
   └── Viết ./docs/codebase-summary.md
       (file này được @debugger và @scout dùng để navigate nhanh)

5. VERIFY
   └── Kiểm tra links, dates, cross-references còn đúng không
```

---

## Docs được quản lý

| File | Cập nhật khi |
|---|---|
| `code-standards.md` | Có pattern/convention mới |
| `system-architecture.md` | Thêm service, module, thay đổi kiến trúc |
| `development-roadmap.md` | Phase status thay đổi (In Progress → Complete) |
| `project-changelog.md` | Release, major feature, security patch |
| `codebase-summary.md` | Khi @debugger hoặc @scout cần (tự tạo) |
| `aspnet/*.md` | Khi có thay đổi về ASP.NET patterns |

---

## Auto-update triggers

`@project-manager` sẽ ping `@docs-manager` tự động khi:
- Development phase status thay đổi
- Major feature được implement
- Security patch được apply
- Timeline/scope thay đổi

---

## Output

Không phải report — output là **files được cập nhật** trong `./docs/`.

Cuối cùng báo:
```
Updated:
  - docs/system-architecture.md: added OrderService section
  - docs/project-changelog.md: v1.3.0 entry
  - docs/development-roadmap.md: Phase 2 → Complete

Created:
  - docs/codebase-summary.md
```

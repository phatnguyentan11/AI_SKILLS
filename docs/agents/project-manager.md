# @project-manager — Điều phối dự án

---

## Cách gọi

```
@project-manager Kiểm tra tiến độ Phase 2
@project-manager Tổng hợp báo cáo sau khi tester và code-reviewer xong
/watzup                   ← xem recent changes và so với plan
```

---

## Files được load khi gọi

```
.github/copilot-instructions.md          ← luôn load
.github/agents/project-manager.md        ← system prompt
./plans/                                 ← ĐỌC TOÀN BỘ khi bắt đầu
    <feature>/plan.md
    <feature>/phase-1.md
    <feature>/phase-2.md
./docs/development-roadmap.md            ← hiểu timeline
./docs/project-changelog.md              ← hiểu history
```

**Tools được phép:**
```
agent/runSubagent, edit, read, search
```

---

## Luồng thực thi chi tiết

```
1. READ ALL PLANS
   └── Đọc từng file trong ./plans/ để hiểu:
       ├── Goals & milestones
       ├── Task breakdown
       ├── Current status (nếu có ghi)
       └── Blockers & risks đã xác định

2. CROSS-REFERENCE VỚI THỰC TẾ
   ├── Dùng search tools để verify code đã được implement chưa
   ├── Kiểm tra test coverage (đọc report từ @tester nếu có)
   └── Kiểm tra review status (đọc report từ @code-reviewer nếu có)

3. COLLECT REPORTS (nếu cần)
   ├── Spawn @tester → lấy test status
   └── Spawn @code-reviewer → lấy quality status

4. ANALYZE COMPLETENESS
   ├── Task nào đã done? (evidence: code tồn tại, tests pass)
   ├── Task nào còn thiếu?
   ├── Blockers nào đang active?
   └── Timeline có bị ảnh hưởng không?

5. UPDATE DOCUMENTS
   ├── Cập nhật status trong plan files
   ├── Cập nhật ./docs/development-roadmap.md
   └── Ping @docs-manager nếu cần cập nhật lớn

6. REPORT
```

---

## Output format

```
## Project Status Report — [date]

### Completed ✅
- [task 1]: evidence: UserService.cs + 12 tests passing
- [task 2]: ...

### In Progress 🔄
- [task 3]: 60% done, missing error handling
- [task 4]: blocked by external API documentation

### Not Started ⬜
- [task 5]
- [task 6]

### Risks & Blockers
- [blocker 1]: impact + mitigation

### Next Steps
1. ...
2. ...
```

---

## Khi nào agent này được gọi tự động

`@project-manager` **không tự động chạy** — luôn cần user gọi. Nhưng các agents khác (`@docs-manager`, `@planner`) có thể ping nó khi cần coordination.

---

## Quy tắc

- Không claim task "done" nếu chưa có evidence (code + tests)
- Không tự implement — chỉ coordinate và track
- Luôn list unresolved questions cuối report

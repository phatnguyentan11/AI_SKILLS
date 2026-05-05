# @planner — Kiến trúc sư & Lập kế hoạch

---

## Cách gọi

```
@planner Tôi cần thêm tính năng export báo cáo PDF
@planner Migrate database từ SQLite sang PostgreSQL
/plan                        ← prompt shortcut
```

---

## Files được load khi gọi

```
.github/copilot-instructions.md       ← luôn load (luật chung)
.github/agents/planner.md             ← system prompt của agent
.github/skills/planning/SKILL.md      ← agent tự đọc khi bắt đầu
.github/skills/planning/references/   ← load từng phần khi cần:
    research-phase.md                 ← skip nếu đã có researcher reports
    codebase-understanding.md         ← skip nếu đã có scout reports
    solution-design.md
    plan-organization.md
    output-standards.md
```

**Tools được phép:**
```
agent/runSubagent, edit, read, search, todo, web
```

---

## Luồng thực thi chi tiết

```
1. DISCOVERY
   ├── Đọc .github/skills/planning/SKILL.md
   ├── Scan .github/skills/* (biết skills nào khả dụng)
   └── Hỏi clarifying questions nếu requirements chưa rõ

2. RESEARCH (parallel)
   ├── Spawn @researcher → topic A
   ├── Spawn @researcher → topic B
   └── Spawn @researcher → topic C
   (chạy đồng thời, tổng hợp sau)

3. ANALYSIS
   ├── Đọc ./docs/code-standards.md
   ├── Đọc ./docs/system-architecture.md
   ├── Áp dụng YAGNI/KISS/DRY
   └── Evaluate 2-3 approaches, chọn optimal

4. PLAN CREATION
   ├── Viết ./plans/<feature-name>/plan.md
   │     ├── Overview, goals, risks
   │     ├── Tech stack decisions
   │     └── Phase breakdown summary
   ├── Viết ./plans/<feature-name>/phase-1.md
   │     └── Task breakdown chi tiết, acceptance criteria
   └── Viết ./plans/<feature-name>/phase-2.md (nếu cần)

5. HANDOFF
   └── Trả về: summary + đường dẫn plan file
       KHÔNG tự viết code
```

---

## Output

```
./plans/
└── payment-module/
    ├── plan.md        ← Đọc cái này trước
    ├── phase-1.md     ← Implement phase 1
    └── phase-2.md     ← Implement phase 2
```

**Trong `plan.md`:**
- Goals & success criteria
- Tech stack quyết định + lý do
- Risks & blockers
- Phase breakdown tổng quan
- Unresolved questions (nếu có)

---

## Quy tắc cứng

- ❌ Không bắt đầu viết code
- ❌ Không đọc tất cả phase files cùng lúc khi implement (chỉ đọc từng phase)
- ✅ Luôn spawn researchers trước khi viết plan
- ✅ Luôn list unresolved questions cuối report

---

## Mental models agent này dùng

| Model | Áp dụng khi |
|---|---|
| **Decomposition** | Chia epic thành stories nhỏ |
| **Working Backwards** | Bắt đầu từ "done looks like" |
| **80/20 Rule** | Tìm 20% features deliver 80% value |
| **Second-Order Thinking** | "Build xong thì sao?" |
| **Risk & Dependency** | "Cái gì có thể sai?" |

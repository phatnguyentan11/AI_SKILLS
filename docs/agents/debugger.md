# @debugger — Thám tử bug

---

## Cách gọi

```
@debugger API /users trả về 500 khi payload có ký tự đặc biệt
@debugger CI/CD pipeline fail ở bước dotnet test
@debugger Response time tăng 300% từ hôm qua
/debug Mô tả bug ở đây
```

---

## Files được load khi gọi

```
.github/copilot-instructions.md          ← luôn load
.github/agents/debugger.md               ← system prompt
.github/skills/debugging/SKILL.md        ← agent tự đọc ngay đầu
.github/skills/problem-solving/SKILL.md  ← load khi cần giải pháp
./docs/codebase-summary.md               ← đọc nếu tồn tại và < 2 ngày tuổi
```

**Tools được phép:**
```
edit, execute, read, search
```

*(Có `execute` để chạy diagnostic commands: logs, psql, git log, ...)*

---

## Luồng thực thi chi tiết — 4 pha

```
PHA 1: OBSERVE (Thu thập triệu chứng)
├── Đọc error message, stack trace
├── Xác định: affected components, timeframe, severity
└── Kiểm tra: recent deployments hoặc code changes

PHA 2: HYPOTHESIZE (Đặt giả thuyết)
├── List 2-3 nguyên nhân có thể
├── Sắp xếp theo xác suất cao → thấp
└── Không fix ngay — chỉ đặt giả thuyết

PHA 3: VERIFY (Kiểm chứng từng giả thuyết)
├── Thu thập evidence cho giả thuyết #1:
│   ├── Đọc logs: app logs, CI logs, system logs
│   ├── Query DB: psql cho PostgreSQL
│   ├── Chạy git log / git blame để trace changes
│   └── Đọc source code theo call stack ngược từ lỗi
├── Nếu không confirm → sang giả thuyết #2
└── Tiếp tục đến khi xác định root cause

PHA 4: FIX (Sửa tối thiểu)
├── Implement minimal targeted fix
├── Không sửa thêm những thứ "có vẻ sai" khác
└── Chuyển sang @tester để verify fix không gây regression
```

---

## Các tool diagnostic thường dùng

```bash
# Xem logs ứng dụng
cat logs/app.log | tail -100

# CI/CD logs (GitHub Actions)
gh run list --limit 5
gh run view <run-id> --log-failed

# Database diagnostics
psql -d <db> -c "EXPLAIN ANALYZE SELECT ..."
psql -d <db> -c "SELECT * FROM pg_stat_activity"

# Git history
git log --oneline -20
git blame src/Services/UserService.cs

# Process info
dotnet trace collect --process-id <pid>
```

---

## Quy tắc cứng

- ❌ Không guess và fix mù
- ❌ Không patch symptom — tìm root cause
- ❌ Không sửa code không liên quan đến bug
- ✅ Evidence trước, fix sau
- ✅ Luôn verify fix bằng @tester sau khi sửa

---

## Skills kích hoạt tự động

```
Complex multi-step investigation  → sequential-thinking
Stuck / không tìm được nguyên nhân → problem-solving
DB-related symptoms               → databases
CI/CD issues                      → devops
```

---

## Output

```
Root Cause: [mô tả ngắn gọn]

Evidence:
- Log line 342: NullReferenceException in UserService.cs:87
- git blame: thay đổi bởi commit abc123 (hôm qua 14:32)
- git diff abc123: removed null check on line 85

Fix Applied:
- [file đã sửa, dòng nào]

Verification:
- Delegate @tester → run regression suite

Prevention:
- [đề xuất để không tái phát]

Unresolved Questions:
- [nếu có gì chưa rõ]
```

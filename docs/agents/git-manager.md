# @git-manager — Quản lý Git commit

---

## Cách gọi

```
@git-manager commit
@git-manager commit and push
commit                     ← từ khóa đủ để trigger
push                       ← từ khóa đủ để trigger
```

---

## Files được load khi gọi

```
.github/copilot-instructions.md    ← luôn load
.github/agents/git-manager.md      ← system prompt
.github/hooks/scripts/secret-scan.ps1  ← chạy qua hook, KHÔNG phải agent load
```

**Tools được phép:**
```
execute
```

*(Chỉ có `execute` — agent này chỉ chạy git commands, không đọc/viết file)*

---

## Luồng thực thi chi tiết — tối đa 3 bước

```
BƯỚC 1: Stage + Security Scan + Metrics
─────────────────────────────────────────
Chạy 1 compound command:

  git add -A
  git diff --cached --stat          ← xem files thay đổi
  git diff --cached --shortstat     → đếm LINES thêm/xóa
  git diff --cached --name-only     → đếm số FILES
  git diff --cached | grep -c (api_key|token|password|secret...)
                                    → đếm SECRETS

  Kết quả extract:
  ├── LINES = tổng insertions + deletions
  ├── FILES = số file thay đổi
  └── SECRETS = số pattern khớp với secret regex

  Nếu SECRETS > 0:
  ├── DỪNG NGAY
  ├── Hiển thị dòng khớp: git diff --cached | grep -iE -C2 (pattern)
  └── EXIT — không commit

BƯỚC 2: Tạo commit message
─────────────────────────────────────────
  Simple (LINES ≤ 30 VÀ FILES ≤ 3):
  └── Tự tạo message từ stat output

  Complex (LINES > 30 HOẶC FILES > 3):
  └── Đọc diff → tạo message bao quát toàn bộ thay đổi

  Format: type(scope): description
  ├── type: feat | fix | docs | chore | refactor | perf | test | build | ci
  ├── scope: module bị ảnh hưởng (auth, api, db, ...)
  └── description: ≤ 72 ký tự, imperative mood ("add" không phải "added")

BƯỚC 3: Commit (+ Push nếu được yêu cầu)
─────────────────────────────────────────
  git commit -m "type(scope): description"

  Chỉ push nếu user nói "push" / "commit and push":
  └── git push
```

---

## Hooks chạy song song (không phải do agent gọi)

Khi agent thực hiện bước 1 (git add), hooks trong `copilot-hooks.json` **không** kích hoạt — hooks chỉ chạy khi Copilot dùng tool `edit`/`write` để sửa file, không phải khi chạy git commands.

Secret scan ở đây là **logic bên trong agent**, khác với hook `secret-scan.ps1` (chạy khi Copilot sửa file trực tiếp).

---

## Commit message examples

```bash
feat(auth): add JWT refresh token rotation
fix(api): handle null response from payment gateway
docs(readme): update installation steps for .NET 8
refactor(user): extract password validation to service
perf(query): add index on orders.created_at
test(auth): add coverage for expired token scenario
chore(deps): upgrade StackExchange.Redis to 2.8.0
```

---

## Quy tắc cứng

- ❌ Không commit nếu phát hiện secret/API key/password
- ❌ Không push nếu user chỉ nói "commit" (không nói "push")
- ❌ Không bypass failing tests trước khi commit
- ✅ Atomic commits — mỗi commit là 1 change có ý nghĩa
- ✅ Imperative mood trong description
- ✅ description ≤ 72 ký tự

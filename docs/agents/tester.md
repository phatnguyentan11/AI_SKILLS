# @tester — QA Engineer

---

## Cách gọi

```
@tester Chạy test sau khi implement module auth
@tester Kiểm tra coverage cho UserService
/test
```

---

## Files được load khi gọi

```
.github/copilot-instructions.md               ← luôn load
.github/agents/tester.md                      ← system prompt
.github/skills/sequential-thinking/SKILL.md  ← agent tự đọc (phân tích từng bước)
.github/skills/csharp-xunit/SKILL.md         ← nếu project dùng xUnit
```

**Tools được phép:**
```
edit, execute, read, search
```

*(Có `execute` để chạy terminal commands như `dotnet test`)*

---

## Luồng thực thi chi tiết

```
1. IDENTIFY SCOPE
   ├── Dựa vào recent changes (git diff) hoặc yêu cầu cụ thể
   └── Xác định test suite nào cần chạy

2. SYNTAX CHECK
   └── Chạy: dotnet build (hoặc typecheck)
       Phát hiện compile error trước khi test

3. RUN TESTS
   └── Chạy: dotnet test --logger "console;verbosity=detailed"
       Capture: pass count, fail count, skip count, thời gian

4. ANALYZE FAILURES
   ├── Đọc stack trace từng lỗi
   ├── Phân loại: logic error / missing mock / environment issue
   └── Tìm root cause (không đoán)

5. COVERAGE ANALYSIS
   └── Chạy: dotnet test --collect:"XPlat Code Coverage"
       ├── Target ≥ 80%
       ├── Identify uncovered paths
       └── Suggest test cases còn thiếu

6. PERFORMANCE CHECK
   ├── Flag tests chạy > 5 giây
   └── Check memory usage nếu có leak suspect

7. BUILD VERIFICATION
   └── dotnet publish (nếu cần verify production build)

8. REPORT
```

---

## Output format

```
Test Results:
  ✅ Passed:  47
  ❌ Failed:   2
  ⚠️  Skipped:  1
  ⏱  Duration: 4.3s

Coverage: 76% (target: 80%)
  Uncovered: UserService.ResetPassword, OrderService.Cancel

Failed Tests:
  1. UserControllerTests.Login_InvalidPassword_Returns401
     Error: NullReferenceException at line 42
     Root cause: ...

Recommendations:
  1. Fix NullRef trước
  2. Thêm test cho ResetPassword path
```

---

## Quy tắc cứng

- ❌ Không dùng mock/fake data để "pass" CI
- ❌ Không skip failing test
- ❌ Không finish session khi còn failing tests
- ✅ Fix all failures trước khi báo done
- ✅ Real tests với real logic

---

## Skills kích hoạt tự động

```
Project dùng xUnit        → csharp-xunit skill
Có async test failures    → csharp-async skill
Performance test issues   → sequential-thinking skill
```

# @scout — Thám tử codebase

---

## Cách gọi

```
@scout Tìm tất cả files liên quan đến payment processing
@scout Tìm nơi UserService được inject và dùng
/scout Mô tả feature cần tìm file
```

---

## Files được load khi gọi

```
.github/copilot-instructions.md     ← luôn load
.github/agents/scout.md             ← system prompt
./docs/codebase-summary.md          ← ĐỌC ĐẦU TIÊN nếu tồn tại (< 2 ngày tuổi)
./README.md                         ← đọc để hiểu project structure
```

**Tools được phép:**
```
read, search
```

*(Chỉ read + search — không edit, không execute)*

---

## Luồng thực thi chi tiết

```
1. ANALYZE REQUEST
   ├── Hiểu task cần làm gì
   ├── Xác định keywords: class names, method names, patterns
   └── Quyết định directories nào relevant

2. READ CONTEXT (nếu có)
   ├── ./docs/codebase-summary.md → biết structure tổng quan
   └── ./README.md → project overview

3. DIVIDE CODEBASE
   └── Chia thành sections để search song song:
       VD cho "payment" task:
       ├── Section A: Controllers/, API/
       ├── Section B: Services/
       ├── Section C: Repositories/
       ├── Section D: Models/, DTOs/
       └── Section E: Tests/

4. PARALLEL SEARCH (tất cả sections cùng lúc)
   ├── Search by filename: *payment*, *order*, *checkout*
   ├── Search by content: class PaymentService, IPaymentRepository
   ├── Search by imports: using App.Payment
   └── Search by route: [Route("payment")]

5. SYNTHESIZE
   ├── Deduplicate results
   ├── Organize by category/directory
   └── Identify coverage gaps

6. REPORT
```

---

## Output format

```
## Files liên quan: Payment Processing

### Controllers (entry points)
- src/Controllers/PaymentController.cs
- src/Controllers/OrderController.cs

### Services (business logic)
- src/Services/PaymentService.cs        ← main logic
- src/Services/OrderService.cs          ← calls PaymentService

### Repositories (data access)
- src/Repositories/PaymentRepository.cs
- src/Repositories/OrderRepository.cs

### Models
- src/Models/Request/CreatePaymentRequest.cs
- src/Models/Responses/PaymentResponse.cs
- src/Models/Enums/PaymentStatus.cs

### Tests
- tests/Services/PaymentServiceTests.cs
- tests/Controllers/PaymentControllerTests.cs

### Configuration
- appsettings.json → "PaymentGateway" section

### Dependencies (files này cũng cần xem)
- src/Commons/Extensions/HttpClientEx.cs
```

---

## Khi nào dùng @scout

- Trước khi bắt đầu implement feature mới
- Khi codebase lớn và không biết file nào liên quan
- Khi debug và cần trace dependency chain
- Khi refactor và cần biết impact scope

**Không cần dùng @scout** khi codebase nhỏ (< 20 files) hoặc đã biết rõ structure.

# Blob Storage — Usage Flows

> Lifecycle và các pattern dùng file sau khi upload lên Azure Blob.
> Upload/download infra → `aspnet-fileblob.md`

---

## Lifecycle Tổng Quan

```
[User upload] → ValidFile() → UploadFileAsync()
                                     ↓
                    BlobFileResult { BlobName, FileName, ContentType, Size }
                                     ↓
                         Lưu DB: { id (Guid), Path = BlobName, ... }
                                     ↓
               ┌──────────────┬──────────────┬─────────────┬──────────────┐
               ▼              ▼              ▼             ▼              ▼
         Serve browser   Email attach   Process CSV   Forward API   Return bytes
         DownloadAsync   ZipFiles+Redis  StreamReader  FormFile wrap  DownloadByUrl
```

---

## Pattern A — Serve File to Browser (controller)

> Endpoint trả file trực tiếp về browser. Xem đầy đủ ở `aspnet-fileblob.md §3`.

```csharp
// Controller: lookup id → get BlobName → stream về browser
var attachment = await _service.GetAttachmentByIdAsync(id, user.UserName!);
var (stream, contentType, fileName) = await _blobFiles.DownloadAsync(attachment.Path);
return File(stream, contentType, fileName);
// Content-Disposition: attachment; filename="{fileName}"
```

---

## Pattern B — Email với File Đính Kèm (zip + Redis)

> Upload nhiều file → zip → lưu Redis → service email đọc từ Redis. Tách thành 2 phase để decouple.

```csharp
// Phase 1: trong service — download blob, zip, lưu Redis
var fileStreams = new List<(Stream, string)>();
try
{
    foreach (var attachment in attachments)
    {
        var (stream, _, _) = await _blobFiles.DownloadAsync(attachment.Path);
        fileStreams.Add((stream, attachment.FileName));
    }

    var zipBytes = await BlobStorageEx.ZipMultipleFilesAsync(fileStreams);

    // Lưu zip vào Redis với TTL ngắn (1 giờ)
    var redisKey = RedisGenerator.GetKeySendMail(requestId, guid);
    await _redis.SaveByKey(redisKey, new RedisAttachment
    {
        FileName = $"{clientNo}.zip",
        FileByte = zipBytes
    }, TimeSpan.FromHours(1));
}
finally
{
    // Dispose streams dù có exception
    foreach ((var s, _) in fileStreams) s?.Dispose();
}

// Phase 2: gọi mail service với Redis key — mail service tự đọc bytes
await _mailService.SendEmailAsync(emailBuilder.BuildMessage([guid]));
```

**Lý do dùng Redis thay vì truyền byte[] trực tiếp**: tách concern, tránh pass large byte[] qua method call chain.

---

## Pattern C — Process File Content (import CSV/Excel)

> Download blob → đọc stream như CSV/Excel → xử lý theo batch.

```csharp
var (stream, _, fileName) = await _blobFiles.DownloadAsync(blobFilePath);

var csvConfig = new CsvConfiguration(CultureInfo.InvariantCulture)
{
    HasHeaderRecord = true,
    DetectDelimiter = true,
    IgnoreBlankLines = true,
};

using var reader = new StreamReader(stream, Encoding.UTF8, detectEncodingFromByteOrderMarks: true);
using var csv = new CsvReader(reader, csvConfig);

var batch = new List<string>(batchSize);
await foreach (var record in csv.GetRecordsAsync<ImportCsvRow>())
{
    batch.Add(ProcessRecord(record));
    if (batch.Count >= batchSize)
    {
        await _repo.ImportBatchAsync(batch);
        batch.Clear();   // giải phóng memory sau mỗi batch
    }
}

if (batch.Count > 0) await _repo.ImportBatchAsync(batch);
```

> Stream từ `DownloadAsync` là `BlobDownloadStreamingResult` — đọc một lần, không seek ngược.
> Không buffer toàn bộ vào `byte[]` — xử lý streaming với batch để tránh OOM.

---

## Pattern D — Forward File tới External API (ITSM/Gateway)

> Download blob → wrap thành `IFormFile` → post multipart tới external service.

```csharp
var (stream, contentType, _) = await _blobFiles.DownloadAsync(attach.FilePath);

// Copy sang MemoryStream vì FormFile cần seekable stream
var memStream = new MemoryStream();
await stream.CopyToAsync(memStream);
await stream.DisposeAsync();
memStream.Position = 0;

var formFile = new FormFile(memStream, 0, memStream.Length, "files", attach.FileName)
{
    Headers = new HeaderDictionary(),
    ContentType = contentType
};

// Forward sang external API qua ApiHelper (multipart)
var result = await _externalService.UploadFilesAsync(userId, new FormFileCollection { formFile });
```

> Copy sang `MemoryStream` vì `FormFile` cần seekable stream. Dispose stream gốc ngay sau copy.

---

## Pattern E — Download File từ URL (DownloadFileFromUrlWithAuthen)

> Khác với `DownloadAsync(blobName)`: dùng khi chỉ có URL, không có BlobName.

```csharp
// Ví dụ: static data lưu URL trong DB thay vì BlobName
var fileBytes = await _blobFiles.DownloadFileFromUrlWithAuthen(staticData.Link);

// Trả về byte[] trực tiếp cho client
return ResponseEx.Success(fileBytes);
```

| Phương thức | Input | Output | Dùng khi |
|------------|-------|--------|----------|
| `DownloadAsync(blobName)` | BlobName (path trong container) | `Stream` | Biết BlobName từ DB (recommended) |
| `DownloadFileFromUrlWithAuthen(url)` | Full URL | `byte[]` | Chỉ có URL, không có BlobName |

> Prefer `DownloadAsync` vì không phụ thuộc URL format. `DownloadFileFromUrlWithAuthen` dùng khi legacy data chỉ lưu URL.

---

## Chọn Pattern

| Nhu cầu | Pattern |
|---------|---------|
| User xem/tải file từ UI | A — `DownloadAsync` → `File(stream)` |
| Gửi email có file đính kèm | B — ZipFiles → Redis → MailService |
| Import dữ liệu từ file CSV/Excel | C — `DownloadAsync` → StreamReader batch |
| Forward file sang API bên ngoài | D — `DownloadAsync` → MemoryStream → FormFile |
| Trả bytes thô cho client | E — `DownloadFileFromUrlWithAuthen` (nếu có URL) |

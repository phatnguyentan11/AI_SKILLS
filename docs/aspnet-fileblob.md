# ASP.NET Core — File Upload & Azure Blob Storage

> Pattern xử lý file (`IFormFile`) và lưu trữ Azure Blob — dùng `IBlobFilesService`.
> Xem thêm: `aspnet-controllers.md`, `aspnet-middleware.md`

---

## 1. IBlobFilesService — Interface & DI

```csharp
public interface IBlobFilesService
{
    Task<BlobFileResult?> UploadFileAsync(
        IFormFile file,
        string? prefixPath = null,
        string? fileName = null,
        bool useGuidPrefix = true,
        bool overwrite = true);

    Task<(Stream stream, string contentType, string fileName)> DownloadAsync(string blobName);

    Task<byte[]> DownloadFileFromUrlWithAuthen(string url);
}
```

**DI registration** (Scoped):
```csharp
services.AddScoped<IBlobFilesService, BlobFilesService>();
```

`BlobFilesService` lấy config qua `I{Service}Configuration`:
```csharp
private BlobContainerClient GetContainerClient()
    => new(_config.BlobConnectionString, _config.BlobContainerName);
```

---

## 2. Upload File — Controller → Service → Blob

### Controller — nhận `IFormFile`, validate boundary, delegate service

```csharp
[ValidAuthorize("RM,RMC")]
[HttpPost("1.0/xyz/attachment/upload")]
public async Task<Response<List<XyzUploadResponse>>> Upload([FromForm] XyzUploadRequest request)
{
    var rsCheck = await _xyzService.ValidFileAsync(request.Files);
    if (rsCheck.IsFailure)
        return ResponseEx.Fail<List<XyzUploadResponse>>(rsCheck.ErrorCode, rsCheck.ErrorMessage);

    var user = User.GetUserInfo()!;
    var result = await _xyzService.UploadAsync(request.Files, request.RefId, user.UserName!);
    if (result.IsFailure) return ResponseEx.Fail<List<XyzUploadResponse>>(result.ErrorCode, result.ErrorMessage);
    return ResponseEx.Success(result.Value);
}
```

### Service — validate file, gọi BlobFilesService, lưu DB

```csharp
public async Task<Result<string>> ValidFileAsync(IFormFileCollection files)
{
    if (files.Count == 0)
        return Result<string>.Fail(XyzResource.INVALID_FILE);

    var allowedExtensions = new HashSet<string> { "pdf", "jpg", "png", "xlsx" };

    foreach (var file in files)
    {
        if (CommonEx.HasInvalidFileName(file.FileName))
            return Result<string>.Fail(XyzResource.INVALID_FILENAME);

        var ext = Path.GetExtension(file.FileName).TrimStart('.').ToLower();
        if (!allowedExtensions.Contains(ext))
            return Result<string>.Fail(XyzResource.INVALID_EXTENSION_UPLOAD_FILE);
    }

    long totalSize = files.Sum(f => f.Length);
    if (totalSize > int.Parse(_config.MaxUploadSizeMb) * 1024 * 1024)
        return Result<string>.Fail(XyzResource.INVALID_FILE_SIZE);

    return Result<string>.Success("");
}

// Upload từng file + lưu DB
private async Task<(string Code, Guid? FileId)> HandleSingleUploadAsync(
    IFormFile file, Guid refId, string prefixPath, string userName)
{
    try
    {
        var blobResult = await _blobFiles.UploadFileAsync(file, prefixPath: prefixPath, useGuidPrefix: false);
        if (blobResult is null) return (XyzResource.INVALID_FILE, null);

        var newId = await _repo.SaveAttachmentAsync(new XyzAttachment
        {
            RefId = refId,
            FileName = blobResult.FileName,
            Path = blobResult.BlobName,       // lưu BlobName để download sau
            ContentType = blobResult.ContentType,
            FileSize = (int)blobResult.Size,
            CreatedBy = userName,
        });

        return (XyzResource.ERRORCODE_SUCCESS, newId);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Upload failed for {File}", file.FileName);
        return (XyzResource.EXCEPTION, null);
    }
}
```

> **BlobFileResult**: `FileName` (sau xử lý) · `BlobName` (path đầy đủ trong container) · `ContentType` · `Size`.
> **Lưu `BlobName` vào DB** — không lưu full URL. Download dùng `BlobName` để gọi `DownloadAsync`.

---

## 3. Download File — trả về `File(stream, ...)`

```csharp
[ValidAuthorize("RM,RMC")]
[HttpGet("1.0/xyz/attachment/view")]
public async Task<IActionResult> ViewAttachment([FromQuery][Required] Guid id)
{
    var user = User.GetUserInfo()!;
    var result = await _xyzService.GetAttachmentByIdAsync(id, user.UserName!);
    if (result.IsNullValue)
        return new JsonResult(ResponseEx.Fail<string>(XyzResource.NO_DATA_FOUND, XyzResource.NOT_FOUND_MSG));

    var (stream, contentType, fileName) = await _blobFiles.DownloadAsync(result.Value!.Path);
    return File(stream, contentType, fileName);
}
```

**Lưu ý:**
- `DownloadAsync` throw `FileNotFoundException` nếu blob không tồn tại
- Muốn trả 404 thay 500: catch `FileNotFoundException` trong controller
- Dùng `Stream` — không `byte[]` — cho file lớn

---

## 4. Blob Path Convention

> Tổ chức folder theo `{domain}/{year}/{month}/{day}/{userName}/` để tránh flat blob container.

```csharp
public static string GetPath(string domain, string userName)
{
    var now = DateTime.Now;
    return $"/{domain}/{now.Year}/{now.Month}/{now.Day}/{userName}";
}
```

**Upload với prefix:**
```csharp
var prefixPath = BlobStorageEx.GetPath("xyz", userName);
var result = await _blobFiles.UploadFileAsync(file, prefixPath: prefixPath, useGuidPrefix: true);
// useGuidPrefix: true  → "{guid}_{originalName}"  | false → originalName
```

---

## 5. Zip Multiple Files

```csharp
var streams = new List<(Stream, string)>
{
    (await blobClient.GetBlobClient(file1.BlobName).OpenReadAsync(), file1.FileName),
    (await blobClient.GetBlobClient(file2.BlobName).OpenReadAsync(), file2.FileName),
};

byte[] zipBytes = await BlobStorageEx.ZipMultipleFilesAsync(streams);
return File(zipBytes, "application/zip", "attachments.zip");
```

> Streams được dispose bên trong `ZipMultipleFilesAsync`.

---

## 6. Security Rules — File Upload

> **Non-negotiable** — không YAGNI cho security:

1. **Validate extension** — dùng whitelist, không blacklist; lấy extension từ `Path.GetExtension()`
2. **Validate filename safety** — `CommonEx.HasInvalidFileName()` kiểm tra path traversal (`../`, `..\\`)
3. **Validate total size** — tránh upload quá lớn gây OOM; limit từ config, không hardcode
4. **Không tin MIME type từ client** — `file.ContentType` do client gửi, dễ giả mạo; kiểm tra extension
5. **Lưu BlobName, không lưu URL** — URL có thể thay đổi khi đổi storage account
6. **Không serve file không qua auth** — endpoint download luôn có `[ValidAuthorize]`
7. **Không expose BlobName lên UI** — trả về `id` (Guid), lookup BlobName trong service

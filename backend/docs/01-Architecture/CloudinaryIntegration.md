# Media & File Storage Architecture (Cloudinary)

## Overview

Workora requires a robust, scalable, and CDN-backed storage solution for handling user-uploaded assets such as profile pictures, company logos, documents (resumes, ID proofs), and other media files. We have chosen **Cloudinary** as the primary storage provider.

By leveraging Clean Architecture principles, the core application will remain agnostic of Cloudinary. We will define abstractions in the Application/Domain layer and implement the concrete logic in the Infrastructure layer.

## Architecture & Layers

### 1. Application Layer (Abstractions)
In the `Workora.Application` project, we define the `IMediaService` (or `IFileStorageService`) interface. This ensures that our command handlers (e.g., `UploadEmployeeDocumentCommandHandler`) do not depend directly on Cloudinary's SDK.

```csharp
namespace Workora.Application.Common.Interfaces;

public interface IMediaService
{
    Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType, CancellationToken cancellationToken);
    Task<string> UploadImageAsync(Stream fileStream, string fileName, CancellationToken cancellationToken);
    Task<bool> DeleteFileAsync(string fileUrl, CancellationToken cancellationToken);
}
```

### 2. Infrastructure Layer (Implementation)
In the `Workora.Infrastructure` project, we implement `IMediaService` using the official Cloudinary .NET SDK.

```csharp
namespace Workora.Infrastructure.Services;

public class CloudinaryMediaService : IMediaService
{
    private readonly Cloudinary _cloudinary;

    public CloudinaryMediaService(IOptions<CloudinarySettings> config)
    {
        var account = new Account(config.Value.CloudName, config.Value.ApiKey, config.Value.ApiSecret);
        _cloudinary = new Cloudinary(account);
    }

    public async Task<string> UploadImageAsync(Stream fileStream, string fileName, CancellationToken cancellationToken)
    {
        var uploadParams = new ImageUploadParams()
        {
            File = new FileDescription(fileName, fileStream),
            // Apply transformations here if needed (e.g., resize, crop, format)
            Folder = "workora/images" 
        };

        var uploadResult = await _cloudinary.UploadAsync(uploadParams);
        return uploadResult.SecureUrl.ToString();
    }
    
    // ... Implementation for raw files and deletion
}
```

### 3. API Layer
Controllers in `Workora.API` will receive `IFormFile` inputs, read them into a `Stream`, and pass them to MediatR commands, which in turn will utilize the `IMediaService`.

## Cloudinary Configuration

Configuration values are securely injected via `appsettings.json` and Azure Key Vault / Environment Variables in production.

```json
"CloudinarySettings": {
  "CloudName": "YOUR_CLOUD_NAME",
  "ApiKey": "YOUR_API_KEY",
  "ApiSecret": "YOUR_API_SECRET"
}
```

## Security & Tenant Isolation

- **Folder Structure**: Files in Cloudinary should be organized by tenant ID to prevent accidental exposure and to make tenant data cleanup easier. For example: `workora/tenant_{tenantId}/images/{employeeId}_profile.jpg`.
- **Signed URLs**: For highly sensitive documents (e.g., offer letters, payroll slips), Cloudinary signed URLs or private delivery types should be used to restrict unauthorized public access.
- **File Validation**: The API must validate MIME types and file sizes before streaming the file to Cloudinary.

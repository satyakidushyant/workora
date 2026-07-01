# Media & File Upload API Specifications

This document defines the REST API endpoints used for uploading and managing files (images, documents) via Cloudinary in the Workora platform.

## Overview

All file uploads are handled through `multipart/form-data` requests. The API acts as a secure intermediary between the client and Cloudinary, ensuring that files are validated, virus-scanned (if applicable), and stored with the correct tenant context.

---

## 1. Upload Employee Profile Picture

Uploads a profile picture for a specific employee and updates their database record with the new Cloudinary URL.

- **Endpoint**: `POST /api/v1/employees/{employeeId}/profile-picture`
- **Authentication**: Bearer Token required
- **RBAC**: `HRManager`, `CompanyAdmin`, or `Employee` (if updating own profile)
- **Content-Type**: `multipart/form-data`

### Request Payload

| Field | Type | Required | Description |
|---|---|---|---|
| `file` | `IFormFile` (binary) | Yes | The image file (JPEG, PNG, WebP). Max size: 5MB. |

### Response (200 OK)

```json
{
  "success": true,
  "message": "Profile picture updated successfully.",
  "data": {
    "employeeId": "e3b0c44298fc1c149afbf4c8996fb924",
    "profilePictureUrl": "https://res.cloudinary.com/your-cloud/image/upload/v123456/workora/tenant_1/images/emp_e3b0_profile.jpg"
  }
}
```

### Error Responses

- **400 Bad Request**: Invalid file type or file size exceeds limit.
- **404 Not Found**: Employee ID does not exist.

---

## 2. Upload Organization Document (e.g. Policies, ID Proofs)

Uploads a raw document (PDF, DOCX) to Cloudinary and registers the document metadata in the Workora database.

- **Endpoint**: `POST /api/v1/documents`
- **Authentication**: Bearer Token required
- **RBAC**: `HRManager`, `CompanyAdmin`
- **Content-Type**: `multipart/form-data`

### Request Payload

| Field | Type | Required | Description |
|---|---|---|---|
| `file` | `IFormFile` (binary) | Yes | The document file. Max size: 20MB. |
| `documentType` | `string` | Yes | Type of document (e.g., `Policy`, `IDProof`, `Contract`) |
| `relatedEntityId` | `Guid` | Optional | ID of the employee/department this document relates to. |

### Response (201 Created)

```json
{
  "success": true,
  "message": "Document uploaded successfully.",
  "data": {
    "documentId": "d74g8c44298fc1c149afbf4c8996f332",
    "documentUrl": "https://res.cloudinary.com/your-cloud/raw/upload/v123456/workora/tenant_1/docs/policy.pdf",
    "uploadedAt": "2026-07-01T12:00:00Z"
  }
}
```

---

## 3. Delete Media/File

Deletes a previously uploaded file from both Cloudinary and the local database tracking record.

- **Endpoint**: `DELETE /api/v1/documents/{documentId}`
- **Authentication**: Bearer Token required
- **RBAC**: `CompanyAdmin`, `HRManager`

### Response (204 No Content)
*(No body returned on successful deletion)*

### Error Responses
- **404 Not Found**: Document not found.
- **403 Forbidden**: User does not have permission to delete this document.

---

## Best Practices & Client Implementation

1. **Direct Uploads (Optional Future Phase)**: For very large files, consider issuing pre-signed Cloudinary upload URLs to the client to bypass the backend and reduce server load, then have a backend webhook listen for completion. Currently, all uploads pass through the backend for strict validation.
2. **File Size Limits**: Max 5MB for images, 20MB for general documents.
3. **Supported Formats**:
   - Images: `.jpg`, `.jpeg`, `.png`, `.webp`
   - Documents: `.pdf`, `.doc`, `.docx`, `.xls`, `.xlsx`, `.csv`

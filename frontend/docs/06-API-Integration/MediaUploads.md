# Media Uploads (Cloudinary)

File and image uploads in Workora are handled via Cloudinary. The frontend communicates with the backend, which acts as the intermediary to Cloudinary.

## Workflow

1. **User Selection**: The user selects a file via a standard `<input type="file">` or a drag-and-drop zone.
2. **FormData**: The file is appended to a native JavaScript `FormData` object.
   ```typescript
   const formData = new FormData();
   formData.append('file', selectedFile);
   ```
3. **API Call**: The Data layer provider issues a `POST` request to the backend with `Content-Type: multipart/form-data`.
   ```typescript
   uploadProfilePicture(employeeId: string, file: File): Observable<UploadResponseDto> {
     const formData = new FormData();
     formData.append('file', file);
     return this.http.post<UploadResponseDto>(`/api/v1/employees/${employeeId}/profile-picture`, formData);
   }
   ```
4. **Backend Processing**: The backend validates the file, uploads it to Cloudinary, stores the URL in PostgreSQL, and returns the URL.
5. **State Update**: The NgRx Effect receives the new URL and updates the `Employee` object in the store.

## Future Optimization (Direct Upload)
For very large files (e.g., 20MB+ PDFs), future updates may implement Direct Uploads. The frontend will request a pre-signed signature from the backend and `POST` directly to the Cloudinary API, bypassing the Workora backend for the binary transfer.

using Workora.Domain.Common;
using Workora.Domain.Enums;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents an uploaded organizational or employee document.
/// </summary>
public class Document : AuditableEntity
{
    /// <summary>
    /// Foreign key identifier for the parent company.
    /// </summary>
    public int CompanyId { get; private set; }

    /// <summary>
    /// Optional foreign key identifier if linked to a specific employee record.
    /// </summary>
    public int? EmployeeId { get; private set; }

    /// <summary>
    /// Navigation property to the linked employee.
    /// </summary>
    public Employee? Employee { get; private set; }

    /// <summary>
    /// Display title / file description.
    /// </summary>
    public string Title { get; private set; } = null!;

    /// <summary>
    /// Original file name with extension.
    /// </summary>
    public string FileName { get; private set; } = null!;

    /// <summary>
    /// Stored file system or cloud storage path.
    /// </summary>
    public string FilePath { get; private set; } = null!;

    /// <summary>
    /// MIME content type (e.g., "application/pdf").
    /// </summary>
    public string ContentType { get; private set; } = null!;

    /// <summary>
    /// File size in bytes.
    /// </summary>
    public long FileSizeBytes { get; private set; }

    /// <summary>
    /// Document category.
    /// </summary>
    public DocumentCategory Category { get; private set; } = DocumentCategory.General;

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private Document() { }

    /// <summary>
    /// Creates a new Document record.
    /// </summary>
    public static Document Create(
        int companyId,
        string title,
        string fileName,
        string filePath,
        string contentType,
        long fileSizeBytes,
        DocumentCategory category = DocumentCategory.General,
        int? employeeId = null)
    {
        return new Document
        {
            CompanyId = companyId,
            Title = title,
            FileName = fileName,
            FilePath = filePath,
            ContentType = contentType,
            FileSizeBytes = fileSizeBytes,
            Category = category,
            EmployeeId = employeeId,
            IsActive = true
        };
    }
}

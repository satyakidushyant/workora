namespace Workora.Domain.Enums;

/// <summary>
/// Category classification for stored organizational documents.
/// </summary>
public enum DocumentCategory
{
    /// <summary>
    /// Employee identification, contracts, certificates.
    /// </summary>
    EmployeeRecord = 1,

    /// <summary>
    /// Company handbooks, rules, and guidelines.
    /// </summary>
    CompanyPolicy = 2,

    /// <summary>
    /// Payroll records, tax forms, compensation letters.
    /// </summary>
    Financial = 3,

    /// <summary>
    /// Training course materials and presentations.
    /// </summary>
    TrainingMaterial = 4,

    /// <summary>
    /// General internal documents.
    /// </summary>
    General = 5
}

using Workora.Domain.Common;
using Workora.Domain.Enums;
using Workora.Domain.ValueObjects;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents the central Employee aggregate root.
/// </summary>
public class Employee : AuditableEntity
{
    /// <summary>
    /// The unique immutable employee identification code (e.g. "EMP-2026-0001").
    /// </summary>
    public string EmployeeCode { get; private set; } = null!;

    /// <summary>
    /// The employee's first name.
    /// </summary>
    public string FirstName { get; private set; } = null!;

    /// <summary>
    /// The employee's last name.
    /// </summary>
    public string LastName { get; private set; } = null!;

    /// <summary>
    /// The corporate email address of the employee.
    /// </summary>
    public EmailAddress Email { get; private set; } = null!;

    /// <summary>
    /// The contact phone number.
    /// </summary>
    public string? Phone { get; private set; }

    /// <summary>
    /// The unique government / national identification number.
    /// </summary>
    public string NationalId { get; private set; } = null!;

    /// <summary>
    /// The date of birth. Must be at least 18 years prior to hire date.
    /// </summary>
    public DateOnly DateOfBirth { get; private set; }

    /// <summary>
    /// The gender of the employee.
    /// </summary>
    public Gender Gender { get; private set; } = Gender.PreferNotToSay;

    /// <summary>
    /// The marital status of the employee.
    /// </summary>
    public MaritalStatus MaritalStatus { get; private set; } = MaritalStatus.Single;

    /// <summary>
    /// The official date of joining / hire.
    /// </summary>
    public DateOnly HireDate { get; private set; }

    /// <summary>
    /// Foreign key identifier for the department.
    /// </summary>
    public int DepartmentId { get; private set; }

    /// <summary>
    /// Navigation property to the department.
    /// </summary>
    public Department Department { get; private set; } = null!;

    /// <summary>
    /// Foreign key identifier for the designation.
    /// </summary>
    public int DesignationId { get; private set; }

    /// <summary>
    /// Navigation property to the designation.
    /// </summary>
    public Designation Designation { get; private set; } = null!;

    /// <summary>
    /// Foreign key identifier for the branch.
    /// </summary>
    public int BranchId { get; private set; }

    /// <summary>
    /// Navigation property to the branch.
    /// </summary>
    public Branch Branch { get; private set; } = null!;

    /// <summary>
    /// Optional foreign key identifier for the manager (self-referencing).
    /// </summary>
    public int? ManagerId { get; private set; }

    /// <summary>
    /// Navigation property to the reporting manager.
    /// </summary>
    public Employee? Manager { get; private set; }

    /// <summary>
    /// Optional foreign key identifier to linked system user account.
    /// </summary>
    public int? UserId { get; private set; }

    /// <summary>
    /// Navigation property to the linked system user account.
    /// </summary>
    public User? User { get; private set; }

    /// <summary>
    /// The current employment status.
    /// </summary>
    public EmploymentStatus EmploymentStatus { get; private set; } = EmploymentStatus.Active;

    /// <summary>
    /// The type of employment engagement.
    /// </summary>
    public EmploymentType EmploymentType { get; private set; } = EmploymentType.FullTime;

    /// <summary>
    /// Optional date of termination or resignation.
    /// </summary>
    public DateOnly? TerminationDate { get; private set; }

    /// <summary>
    /// Reason provided for termination or offboarding.
    /// </summary>
    public string? TerminationReason { get; private set; }

    /// <summary>
    /// The residential / correspondence address.
    /// </summary>
    public string? Address { get; private set; }

    private readonly List<Employee> _directReports = new();
    /// <summary>
    /// Navigation collection of direct reporting subordinates.
    /// </summary>
    public IReadOnlyCollection<Employee> DirectReports => _directReports.AsReadOnly();

    private readonly List<EmployeeEmergencyContact> _emergencyContacts = new();
    /// <summary>
    /// Navigation collection of emergency contacts.
    /// </summary>
    public IReadOnlyCollection<EmployeeEmergencyContact> EmergencyContacts => _emergencyContacts.AsReadOnly();

    private readonly List<EmployeeBankDetail> _bankDetails = new();
    /// <summary>
    /// Navigation collection of employee bank disbursement details.
    /// </summary>
    public IReadOnlyCollection<EmployeeBankDetail> BankDetails => _bankDetails.AsReadOnly();

    private readonly List<EmployeeEmploymentHistory> _employmentHistory = new();
    /// <summary>
    /// Navigation collection of historical transfers, promotions, and changes.
    /// </summary>
    public IReadOnlyCollection<EmployeeEmploymentHistory> EmploymentHistory => _employmentHistory.AsReadOnly();

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private Employee() { }

    /// <summary>
    /// Creates a new Employee instance.
    /// </summary>
    public static Employee Create(
        string employeeCode,
        string firstName,
        string lastName,
        EmailAddress email,
        string? phone,
        string nationalId,
        DateOnly dateOfBirth,
        Gender gender,
        MaritalStatus maritalStatus,
        DateOnly hireDate,
        int departmentId,
        int designationId,
        int branchId,
        int? managerId = null,
        int? userId = null,
        EmploymentStatus employmentStatus = EmploymentStatus.Active,
        EmploymentType employmentType = EmploymentType.FullTime,
        string? address = null)
    {
        return new Employee
        {
            EmployeeCode = employeeCode,
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            Phone = phone,
            NationalId = nationalId.Trim().ToUpperInvariant(),
            DateOfBirth = dateOfBirth,
            Gender = gender,
            MaritalStatus = maritalStatus,
            HireDate = hireDate,
            DepartmentId = departmentId,
            DesignationId = designationId,
            BranchId = branchId,
            ManagerId = managerId,
            UserId = userId,
            EmploymentStatus = employmentStatus,
            EmploymentType = employmentType,
            Address = address,
            IsActive = true
        };
    }

    /// <summary>
    /// Updates general employee profile information.
    /// </summary>
    public void UpdateProfile(
        string firstName,
        string lastName,
        string? phone,
        DateOnly dateOfBirth,
        Gender gender,
        MaritalStatus maritalStatus,
        int? managerId,
        string? address)
    {
        FirstName = firstName;
        LastName = lastName;
        Phone = phone;
        DateOfBirth = dateOfBirth;
        Gender = gender;
        MaritalStatus = maritalStatus;
        ManagerId = managerId;
        Address = address;
    }

    /// <summary>
    /// Self-service profile update by the employee.
    /// </summary>
    public void UpdateSelfProfile(string? phone, string? address)
    {
        Phone = phone;
        Address = address;
    }

    /// <summary>
    /// Performs an organizational transfer or promotion.
    /// </summary>
    public void Transfer(int departmentId, int designationId, int branchId, int? managerId, string? notes = null)
    {
        var history = EmployeeEmploymentHistory.Create(
            Id,
            DateOnly.FromDateTime(DateTime.UtcNow),
            "Transfer",
            DepartmentId,
            departmentId,
            DesignationId,
            designationId,
            BranchId,
            branchId,
            notes);

        _employmentHistory.Add(history);

        DepartmentId = departmentId;
        DesignationId = designationId;
        BranchId = branchId;
        ManagerId = managerId;
    }

    /// <summary>
    /// Terminates the employee's employment.
    /// </summary>
    public void Terminate(DateOnly terminationDate, string? reason)
    {
        EmploymentStatus = EmploymentStatus.Terminated;
        TerminationDate = terminationDate;
        TerminationReason = reason;
        IsActive = false;

        var history = EmployeeEmploymentHistory.Create(
            Id,
            terminationDate,
            "Termination",
            DepartmentId,
            DepartmentId,
            DesignationId,
            DesignationId,
            BranchId,
            BranchId,
            reason);

        _employmentHistory.Add(history);
    }

    /// <summary>
    /// Reactivates or rehires a previously terminated employee.
    /// </summary>
    public void Reactivate(int departmentId, int designationId, int branchId, int? managerId, string? notes = null)
    {
        EmploymentStatus = EmploymentStatus.Active;
        TerminationDate = null;
        TerminationReason = null;
        IsActive = true;

        DepartmentId = departmentId;
        DesignationId = designationId;
        BranchId = branchId;
        ManagerId = managerId;

        var history = EmployeeEmploymentHistory.Create(
            Id,
            DateOnly.FromDateTime(DateTime.UtcNow),
            "Rehire",
            DepartmentId,
            departmentId,
            DesignationId,
            designationId,
            BranchId,
            branchId,
            notes);

        _employmentHistory.Add(history);
    }

    /// <summary>
    /// Links a system user account to this employee.
    /// </summary>
    public void LinkUser(int userId)
    {
        UserId = userId;
    }
}

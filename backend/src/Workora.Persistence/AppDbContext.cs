using Microsoft.EntityFrameworkCore;
using Workora.Domain.Common;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;

namespace Workora.Persistence;

/// <summary>
/// The main Entity Framework Core database context.
/// </summary>
public class AppDbContext : DbContext, IUnitOfWork
{
    /// <summary>
    /// Initializes a new instance of the <see cref="AppDbContext"/> class.
    /// </summary>
    /// <param name="options">The context options.</param>
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    /// <summary>
    /// Gets or sets the Users table.
    /// </summary>
    public DbSet<User> Users { get; set; } = null!;

    /// <summary>
    /// Gets or sets the RefreshTokens table.
    /// </summary>
    public DbSet<RefreshToken> RefreshTokens { get; set; } = null!;

    /// <summary>
    /// Gets or sets the PasswordResetTokens table.
    /// </summary>
    public DbSet<PasswordResetToken> PasswordResetTokens { get; set; } = null!;

    /// <summary>
    /// Gets or sets the LoginAuditLogs table.
    /// </summary>
    public DbSet<LoginAuditLog> LoginAuditLogs { get; set; } = null!;

    /// <summary>
    /// Gets or sets the Roles table.
    /// </summary>
    public DbSet<Role> Roles { get; set; } = null!;

    /// <summary>
    /// Gets or sets the Permissions table.
    /// </summary>
    public DbSet<Permission> Permissions { get; set; } = null!;

    /// <summary>
    /// Gets or sets the UserRoles table.
    /// </summary>
    public DbSet<UserRole> UserRoles { get; set; } = null!;

    /// <summary>
    /// Gets or sets the RolePermissions table.
    /// </summary>
    public DbSet<RolePermission> RolePermissions { get; set; } = null!;

    /// <summary>
    /// Gets or sets the Companies table.
    /// </summary>
    public DbSet<Company> Companies { get; set; } = null!;

    /// <summary>
    /// Gets or sets the Branches table.
    /// </summary>
    public DbSet<Branch> Branches { get; set; } = null!;

    /// <summary>
    /// Gets or sets the Departments table.
    /// </summary>
    public DbSet<Department> Departments { get; set; } = null!;

    /// <summary>
    /// Gets or sets the Designations table.
    /// </summary>
    public DbSet<Designation> Designations { get; set; } = null!;

    /// <summary>
    /// Gets or sets the Employees table.
    /// </summary>
    public DbSet<Employee> Employees { get; set; } = null!;

    /// <summary>
    /// Gets or sets the EmployeeEmploymentHistory table.
    /// </summary>
    public DbSet<EmployeeEmploymentHistory> EmployeeEmploymentHistory { get; set; } = null!;

    /// <summary>
    /// Gets or sets the EmployeeEmergencyContacts table.
    /// </summary>
    public DbSet<EmployeeEmergencyContact> EmployeeEmergencyContacts { get; set; } = null!;

    /// <summary>
    /// Gets or sets the EmployeeBankDetails table.
    /// </summary>
    public DbSet<EmployeeBankDetail> EmployeeBankDetails { get; set; } = null!;

    /// <summary>
    /// Gets or sets the Shifts table.
    /// </summary>
    public DbSet<Shift> Shifts { get; set; } = null!;

    /// <summary>
    /// Gets or sets the EmployeeShiftAssignments table.
    /// </summary>
    public DbSet<EmployeeShiftAssignment> EmployeeShiftAssignments { get; set; } = null!;

    /// <summary>
    /// Gets or sets the Holidays table.
    /// </summary>
    public DbSet<Holiday> Holidays { get; set; } = null!;

    /// <summary>
    /// Gets or sets the AttendanceRecords table.
    /// </summary>
    public DbSet<AttendanceRecord> AttendanceRecords { get; set; } = null!;

    /// <summary>
    /// Gets or sets the AttendanceCorrections table.
    /// </summary>
    public DbSet<AttendanceCorrection> AttendanceCorrections { get; set; } = null!;

    /// <summary>
    /// Gets or sets the LeaveTypes table.
    /// </summary>
    public DbSet<LeaveType> LeaveTypes { get; set; } = null!;

    /// <summary>
    /// Gets or sets the LeaveRequests table.
    /// </summary>
    public DbSet<LeaveRequest> LeaveRequests { get; set; } = null!;

    /// <summary>
    /// Gets or sets the LeaveBalances table.
    /// </summary>
    public DbSet<LeaveBalance> LeaveBalances { get; set; } = null!;

    /// <summary>
    /// Gets or sets the LeaveApprovals table.
    /// </summary>
    public DbSet<LeaveApproval> LeaveApprovals { get; set; } = null!;

    /// <summary>
    /// Gets or sets the SalaryStructures table.
    /// </summary>
    public DbSet<SalaryStructure> SalaryStructures { get; set; } = null!;

    /// <summary>
    /// Gets or sets the SalaryComponents table.
    /// </summary>
    public DbSet<SalaryComponent> SalaryComponents { get; set; } = null!;

    /// <summary>
    /// Gets or sets the EmployeeSalaryAssignments table.
    /// </summary>
    public DbSet<EmployeeSalaryAssignment> EmployeeSalaryAssignments { get; set; } = null!;

    /// <summary>
    /// Gets or sets the PayrollRuns table.
    /// </summary>
    public DbSet<PayrollRun> PayrollRuns { get; set; } = null!;

    /// <summary>
    /// Gets or sets the Payslips table.
    /// </summary>
    public DbSet<Payslip> Payslips { get; set; } = null!;

    /// <summary>
    /// Gets or sets the PayslipItems table.
    /// </summary>
    public DbSet<PayslipItem> PayslipItems { get; set; } = null!;

    /// <summary>
    /// Gets or sets the JobPostings table.
    /// </summary>
    public DbSet<JobPosting> JobPostings { get; set; } = null!;

    /// <summary>
    /// Gets or sets the Candidates table.
    /// </summary>
    public DbSet<Candidate> Candidates { get; set; } = null!;

    /// <summary>
    /// Gets or sets the Interviews table.
    /// </summary>
    public DbSet<Interview> Interviews { get; set; } = null!;

    /// <summary>
    /// Gets or sets the JobOffers table.
    /// </summary>
    public DbSet<JobOffer> JobOffers { get; set; } = null!;

    /// <summary>
    /// Gets or sets the Appraisals table.
    /// </summary>
    public DbSet<Appraisal> Appraisals { get; set; } = null!;

    /// <summary>
    /// Gets or sets the Goals table.
    /// </summary>
    public DbSet<Goal> Goals { get; set; } = null!;

    /// <summary>
    /// Gets or sets the TrainingPrograms table.
    /// </summary>
    public DbSet<TrainingProgram> TrainingPrograms { get; set; } = null!;

    /// <summary>
    /// Gets or sets the TrainingEnrollments table.
    /// </summary>
    public DbSet<TrainingEnrollment> TrainingEnrollments { get; set; } = null!;

    /// <summary>
    /// Gets or sets the Assets table.
    /// </summary>
    public DbSet<Asset> Assets { get; set; } = null!;

    /// <summary>
    /// Gets or sets the AssetAssignments table.
    /// </summary>
    public DbSet<AssetAssignment> AssetAssignments { get; set; } = null!;

    /// <summary>
    /// Gets or sets the Documents table.
    /// </summary>
    public DbSet<Document> Documents { get; set; } = null!;

    /// <summary>
    /// Gets or sets the Policies table.
    /// </summary>
    public DbSet<Policy> Policies { get; set; } = null!;

    /// <summary>
    /// Gets or sets the PolicyAcknowledgments table.
    /// </summary>
    public DbSet<PolicyAcknowledgment> PolicyAcknowledgments { get; set; } = null!;

    /// <summary>
    /// Gets or sets the Notifications table.
    /// </summary>
    public DbSet<Notification> Notifications { get; set; } = null!;

    /// <summary>
    /// Gets or sets the SystemSettings table.
    /// </summary>
    public DbSet<SystemSetting> SystemSettings { get; set; } = null!;

    /// <summary>
    /// Gets or sets the AuditLogs table.
    /// </summary>
    public DbSet<AuditLog> AuditLogs { get; set; } = null!;

    /// <summary>
    /// Saves all changes made in this context to the database, populating CreatedAt/UpdatedAt timestamps.
    /// </summary>
    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var entries = ChangeTracker.Entries<AuditableEntity>();
        var now = DateTimeOffset.UtcNow;

        foreach (var entry in entries)
        {
            if (entry.State == EntityState.Added)
            {
                if (entry.Entity.CreatedAt == default)
                {
                    entry.Entity.CreatedAt = now;
                }
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = now;
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }

    /// <summary>
    /// Configures the database models.
    /// </summary>
    /// <param name="modelBuilder">The model builder.</param>
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}

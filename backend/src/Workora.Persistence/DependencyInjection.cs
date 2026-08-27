using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Workora.Domain.Interfaces;
using Workora.Persistence.Repositories;
using Workora.Persistence.Seeders;

namespace Workora.Persistence;

/// <summary>
/// Provides extension methods for setting up dependency injection for the Persistence layer.
/// </summary>
public static class DependencyInjection
{
    /// <summary>
    /// Registers Persistence layer services, such as the DbContext and Repositories.
    /// </summary>
    /// <param name="services">The service collection.</param>
    /// <param name="configuration">The application configuration.</param>
    /// <returns>The updated service collection.</returns>
    public static IServiceCollection AddPersistence(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<Workora.Persistence.Interceptors.PublishDomainEventsInterceptor>();

        services.AddDbContext<AppDbContext>((provider, options) =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"))
                   .UseSnakeCaseNamingConvention()
                   .AddInterceptors(provider.GetRequiredService<Workora.Persistence.Interceptors.PublishDomainEventsInterceptor>()));

        services.AddScoped<IUnitOfWork>(provider => provider.GetRequiredService<AppDbContext>());

        services.AddScoped(typeof(IRepository<>), typeof(GenericRepository<>));
        services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
        services.AddScoped<IPasswordResetTokenRepository, PasswordResetTokenRepository>();
        services.AddScoped<ILoginAuditLogRepository, LoginAuditLogRepository>();
        services.AddScoped<IRoleRepository, RoleRepository>();
        services.AddScoped<IPermissionRepository, PermissionRepository>();
        services.AddScoped<ICompanyRepository, CompanyRepository>();
        services.AddScoped<IBranchRepository, BranchRepository>();
        services.AddScoped<IDepartmentRepository, DepartmentRepository>();
        services.AddScoped<IDesignationRepository, DesignationRepository>();
        services.AddScoped<IEmployeeRepository, EmployeeRepository>();
        services.AddScoped<IShiftRepository, ShiftRepository>();
        services.AddScoped<IHolidayRepository, HolidayRepository>();
        services.AddScoped<IAttendanceRepository, AttendanceRepository>();
        services.AddScoped<ILeaveRequestRepository, LeaveRequestRepository>();
        services.AddScoped<ILeaveBalanceRepository, LeaveBalanceRepository>();
        services.AddScoped<ISalaryStructureRepository, SalaryStructureRepository>();
        services.AddScoped<IPayrollRepository, PayrollRepository>();
        services.AddScoped<IRecruitmentRepository, RecruitmentRepository>();
        services.AddScoped<IPerformanceRepository, PerformanceRepository>();
        services.AddScoped<ITrainingRepository, TrainingRepository>();
        services.AddScoped<IAssetRepository, AssetRepository>();
        services.AddScoped<IDocumentRepository, DocumentRepository>();
        services.AddScoped<IPolicyRepository, PolicyRepository>();
        services.AddScoped<INotificationRepository, NotificationRepository>();
        services.AddScoped<ISystemSettingRepository, SystemSettingRepository>();
        services.AddScoped<IAuditLogRepository, AuditLogRepository>();
        services.AddScoped<IAnalyticsRepository, AnalyticsRepository>();
        services.AddScoped<ILoanRepository, LoanRepository>();
        services.AddScoped<IExpenseClaimRepository, ExpenseClaimRepository>();
        services.AddScoped<IFieldVisitRepository, FieldVisitRepository>();
        services.AddScoped<ITaskItemRepository, TaskItemRepository>();
        services.AddScoped<IHelpdeskTicketRepository, HelpdeskTicketRepository>();
        services.AddScoped<IOvertimeRequestRepository, OvertimeRequestRepository>();
        services.AddScoped<IOnboardingRepository, OnboardingRepository>();
        services.AddScoped<IFinancialYearRepository, FinancialYearRepository>();

        services.AddScoped<DatabaseSeeder>();

        return services;
    }
}

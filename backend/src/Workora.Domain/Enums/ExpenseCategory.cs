namespace Workora.Domain.Enums;

/// <summary>
/// Defines the category of an employee expense reimbursement claim.
/// </summary>
public enum ExpenseCategory
{
    /// <summary>
    /// Flight, train, bus, or cab travel expenses.
    /// </summary>
    Travel = 1,

    /// <summary>
    /// Hotel or accommodation costs during official tours.
    /// </summary>
    Lodging = 2,

    /// <summary>
    /// Food and dining during business travel or team outings.
    /// </summary>
    Meals = 3,

    /// <summary>
    /// Business client meetings or entertainment expenses.
    /// </summary>
    ClientMeeting = 4,

    /// <summary>
    /// Fuel and vehicle mileage reimbursement.
    /// </summary>
    Fuel = 5,

    /// <summary>
    /// Office stationery, software tools, or books.
    /// </summary>
    Stationery = 6,

    /// <summary>
    /// Miscellaneous business expense.
    /// </summary>
    Other = 7
}

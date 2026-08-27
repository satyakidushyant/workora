using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Holidays.DTOs;
namespace Workora.Application.Features.Holidays.Commands.DeleteHoliday;

/// <summary>
/// Command to delete a holiday definition.
/// </summary>
public record DeleteHolidayCommand(int Id) : IRequest<ApiResponse<bool>>;

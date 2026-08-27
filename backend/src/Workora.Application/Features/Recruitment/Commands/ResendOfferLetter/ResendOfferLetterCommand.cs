using MediatR;
using Workora.Shared.Responses;

using Workora.Application.Features.Recruitment.DTOs;
namespace Workora.Application.Features.Recruitment.Commands.ResendOfferLetter;

/// <summary>
/// Command to resend job offer dispatch email.
/// </summary>
public record ResendOfferLetterCommand(int OfferId) : IRequest<ApiResponse<bool>>;

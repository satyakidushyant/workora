using MediatR;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Queries.GetOfferLetterPdf;

/// <summary>
/// Query to retrieve offer letter PDF document link.
/// </summary>
public record GetOfferLetterPdfQuery(int OfferId) : IRequest<ApiResponse<OfferLetterPdfDto>>;

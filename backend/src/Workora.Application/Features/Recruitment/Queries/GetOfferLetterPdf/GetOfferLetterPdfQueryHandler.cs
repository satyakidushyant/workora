using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Queries.GetOfferLetterPdf;

/// <summary>
/// Handler for <see cref="GetOfferLetterPdfQuery"/>.
/// </summary>
public class GetOfferLetterPdfQueryHandler : IRequestHandler<GetOfferLetterPdfQuery, ApiResponse<OfferLetterPdfDto>>
{
    private readonly IGenericRepository<JobOffer> _offerRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetOfferLetterPdfQueryHandler"/> class.
    /// </summary>
    public GetOfferLetterPdfQueryHandler(IGenericRepository<JobOffer> offerRepository)
    {
        _offerRepository = offerRepository;
    }

    /// <summary>
    /// Handles generating offer letter PDF link.
    /// </summary>
    public async Task<ApiResponse<OfferLetterPdfDto>> Handle(GetOfferLetterPdfQuery request, CancellationToken cancellationToken)
    {
        var offer = await _offerRepository.GetByIdAsync(request.OfferId, cancellationToken);
        if (offer == null)
        {
            return ApiResponse<OfferLetterPdfDto>.Fail(ResponseMessage.JobOfferNotFound.GetDescription());
        }

        var dto = new OfferLetterPdfDto
        {
            OfferId = offer.Id,
            FileName = $"Offer_Letter_Candidate_{offer.CandidateId}.pdf",
            DownloadUrl = $"/api/v1/recruitment/offers/{offer.Id}/download-pdf"
        };

        return ApiResponse<OfferLetterPdfDto>.Success(dto, ResponseMessage.OfferLetterPdfGenerated.GetDescription());
    }
}

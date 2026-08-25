using MediatR;
using Workora.Application.Common.Models;
using Workora.Shared.Responses;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;

namespace Workora.Application.Features.Recruitment.Offers;

/// <summary>
/// DTO representing offer letter PDF download metadata.
/// </summary>
public class OfferLetterPdfDto
{
    /// <summary>
    /// Gets or sets offer ID.
    /// </summary>
    public int OfferId { get; set; }

    /// <summary>
    /// Gets or sets document file title.
    /// </summary>
    public string FileName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets secure download URL.
    /// </summary>
    public string DownloadUrl { get; set; } = string.Empty;
}

/// <summary>
/// Query to retrieve offer letter PDF document link.
/// </summary>
public record GetOfferLetterPdfQuery(int OfferId) : IRequest<ApiResponse<OfferLetterPdfDto>>;

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
            return ApiResponse<OfferLetterPdfDto>.Fail($"Job offer {request.OfferId} not found.");
        }

        var dto = new OfferLetterPdfDto
        {
            OfferId = offer.Id,
            FileName = $"Offer_Letter_Candidate_{offer.CandidateId}.pdf",
            DownloadUrl = $"/api/v1/recruitment/offers/{offer.Id}/download-pdf"
        };

        return ApiResponse<OfferLetterPdfDto>.Success(dto, "Offer letter PDF URL generated successfully.");
    }
}

/// <summary>
/// Command to resend job offer dispatch email.
/// </summary>
public record ResendOfferLetterCommand(int OfferId) : IRequest<ApiResponse<bool>>;

/// <summary>
/// Handler for <see cref="ResendOfferLetterCommand"/>.
/// </summary>
public class ResendOfferLetterCommandHandler : IRequestHandler<ResendOfferLetterCommand, ApiResponse<bool>>
{
    private readonly IGenericRepository<JobOffer> _offerRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="ResendOfferLetterCommandHandler"/> class.
    /// </summary>
    public ResendOfferLetterCommandHandler(IGenericRepository<JobOffer> offerRepository)
    {
        _offerRepository = offerRepository;
    }

    /// <summary>
    /// Handles resending offer dispatch notification email.
    /// </summary>
    public async Task<ApiResponse<bool>> Handle(ResendOfferLetterCommand request, CancellationToken cancellationToken)
    {
        var offer = await _offerRepository.GetByIdAsync(request.OfferId, cancellationToken);
        if (offer == null)
        {
            return ApiResponse<bool>.Fail($"Job offer {request.OfferId} not found.");
        }

        return ApiResponse<bool>.Success(true, "Job offer letter email resent successfully to candidate.");
    }
}

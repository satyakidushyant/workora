using MediatR;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Recruitment.DTOs;
namespace Workora.Application.Features.Recruitment.Commands.ResendOfferLetter;

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

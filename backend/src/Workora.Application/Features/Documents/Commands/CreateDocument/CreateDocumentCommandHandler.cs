using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Documents.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Documents.Commands.CreateDocument;

/// <summary>
/// Handler for <see cref="CreateDocumentCommand"/>.
/// </summary>
public class CreateDocumentCommandHandler : IRequestHandler<CreateDocumentCommand, ApiResponse<DocumentDto>>
{
    private readonly IDocumentRepository _documentRepository;
    private readonly ICompanyRepository _companyRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="CreateDocumentCommandHandler"/> class.
    /// </summary>
    public CreateDocumentCommandHandler(
        IDocumentRepository documentRepository,
        ICompanyRepository companyRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _documentRepository = documentRepository;
        _companyRepository = companyRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<DocumentDto>> Handle(CreateDocumentCommand request, CancellationToken ct)
    {
        var company = await _companyRepository.GetByIdAsync(request.CompanyId, ct);
        if (company == null)
        {
            return ApiResponse<DocumentDto>.Fail(ResponseMessage.CompanyNotFound.GetDescription());
        }

        var doc = Document.Create(
            request.CompanyId,
            request.Title,
            request.FileName,
            request.FilePath,
            request.ContentType,
            request.FileSizeBytes,
            request.Category,
            request.EmployeeId);

        await _documentRepository.AddAsync(doc, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<DocumentDto>(doc);
        return ApiResponse<DocumentDto>.Success(dto, ResponseMessage.DocumentUploaded.GetDescription());
    }
}

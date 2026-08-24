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
/// Command to save document metadata and file upload path.
/// </summary>
public record CreateDocumentCommand(
    int CompanyId,
    int? EmployeeId,
    string Title,
    string FileName,
    string FilePath,
    string ContentType,
    long FileSizeBytes,
    DocumentCategory Category) : IRequest<ApiResponse<DocumentDto>>;

/// <summary>
/// Validator for <see cref="CreateDocumentCommand"/>.
/// </summary>
public class CreateDocumentCommandValidator : AbstractValidator<CreateDocumentCommand>
{
    /// <summary>
    /// Initializes validation rules for document registration.
    /// </summary>
    public CreateDocumentCommandValidator()
    {
        RuleFor(x => x.CompanyId).GreaterThan(0).WithMessage("Valid company ID is required.");
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200).WithMessage("Title is required.");
        RuleFor(x => x.FileName).NotEmpty().MaximumLength(255).WithMessage("File name is required.");
        RuleFor(x => x.FilePath).NotEmpty().MaximumLength(500).WithMessage("File path is required.");
        RuleFor(x => x.ContentType).NotEmpty().MaximumLength(100).WithMessage("Content type is required.");
    }
}

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

using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Companies.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Companies.Queries.GetCompanyProfile;

/// <summary>
/// Query to get the default or primary company profile.
/// </summary>
public record GetCompanyProfileQuery(int? CompanyId = null) : IRequest<ApiResponse<CompanyDto>>;

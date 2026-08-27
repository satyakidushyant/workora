using AutoMapper;
using MediatR;
using Workora.Application.Features.Companies.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Companies.Queries.GetCompaniesList;

/// <summary>
/// Query to list all companies (for multi-tenant SuperAdmin accounts).
/// </summary>
public record GetCompaniesListQuery : IRequest<ApiResponse<IReadOnlyList<CompanyDto>>>;

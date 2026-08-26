import {
  JobPostingDto,
  CandidateDto,
  InterviewDto,
  JobOfferDto,
  CandidateDetailDto,
  RecruitmentPipelineDto
} from '../dtos/recruitment.dto';
import {
  JobPosting,
  Candidate,
  Interview,
  JobOffer,
  CandidateDetail,
  RecruitmentPipeline
} from '../../domain/models/recruitment.model';

export class RecruitmentMapper {
  static fromJobDto(dto: JobPostingDto): JobPosting {
    return {
      id: dto.id,
      uuid: dto.uuid,
      companyId: dto.companyId,
      departmentId: dto.departmentId,
      departmentName: dto.departmentName,
      title: dto.title,
      description: dto.description,
      requirements: dto.requirements,
      employmentType: dto.employmentType,
      location: dto.location,
      experienceYearsMin: dto.experienceYearsMin,
      experienceYearsMax: dto.experienceYearsMax,
      salaryMin: dto.salaryMin,
      salaryMax: dto.salaryMax,
      status: dto.status,
      closingDate: dto.closingDate,
      applicantsCount: dto.applicantsCount,
      isActive: dto.isActive,
      createdAt: dto.createdAt
    };
  }

  static fromCandidateDto(dto: CandidateDto): Candidate {
    return {
      id: dto.id,
      uuid: dto.uuid,
      jobPostingId: dto.jobPostingId,
      jobTitle: dto.jobTitle,
      firstName: dto.firstName,
      lastName: dto.lastName,
      fullName: dto.fullName,
      email: dto.email,
      phone: dto.phone,
      resumeUrl: dto.resumeUrl,
      stage: dto.stage,
      rejectionReason: dto.rejectionReason,
      appliedDate: dto.appliedDate
    };
  }

  static fromInterviewDto(dto: InterviewDto): Interview {
    return {
      id: dto.id,
      uuid: dto.uuid,
      candidateId: dto.candidateId,
      candidateName: dto.candidateName,
      interviewerEmployeeId: dto.interviewerEmployeeId,
      interviewerName: dto.interviewerName,
      scheduledAt: dto.scheduledAt,
      locationOrLink: dto.locationOrLink,
      status: dto.status,
      feedback: dto.feedback,
      rating: dto.rating,
      conductedAt: dto.conductedAt
    };
  }

  static fromJobOfferDto(dto: JobOfferDto): JobOffer {
    return {
      id: dto.id,
      uuid: dto.uuid,
      candidateId: dto.candidateId,
      candidateName: dto.candidateName,
      offeredSalary: dto.offeredSalary,
      joiningDate: dto.joiningDate,
      expiryDate: dto.expiryDate,
      status: dto.status,
      sentAt: dto.sentAt,
      respondedAt: dto.respondedAt,
      notes: dto.notes
    };
  }

  static fromCandidateDetailDto(dto: CandidateDetailDto): CandidateDetail {
    const base = this.fromCandidateDto(dto);
    return {
      ...base,
      interviews: (dto.interviews || []).map(i => this.fromInterviewDto(i)),
      offers: (dto.offers || []).map(o => this.fromJobOfferDto(o))
    };
  }

  static fromPipelineDto(dto: RecruitmentPipelineDto): RecruitmentPipeline {
    return {
      stages: (dto.stages || []).map(s => ({ stage: s.stage, count: s.count })),
      totalCandidates: dto.totalCandidates
    };
  }
}

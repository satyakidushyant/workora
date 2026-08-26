import { FieldVisitDto, LiveLocationDto, TravelDistanceSummaryDto } from '../dtos/field-tracking.dto';
import { FieldVisit, LiveLocation, TravelDistanceSummary } from '../../domain/models/field-tracking.model';

export class FieldTrackingMapper {
  static fromVisitDto(dto: FieldVisitDto): FieldVisit {
    return {
      id: dto.id,
      uuid: dto.uuid,
      employeeId: dto.employeeId,
      employeeName: dto.employeeName,
      employeeCode: dto.employeeCode,
      clientName: dto.clientName,
      visitPurpose: dto.visitPurpose,
      checkInTime: dto.checkInTime,
      checkInLatitude: dto.checkInLatitude,
      checkInLongitude: dto.checkInLongitude,
      checkInAddress: dto.checkInAddress,
      checkOutTime: dto.checkOutTime,
      checkOutLatitude: dto.checkOutLatitude,
      checkOutLongitude: dto.checkOutLongitude,
      distanceTraveledKm: dto.distanceTraveledKm,
      meetingNotes: dto.meetingNotes,
      signatureUrl: dto.signatureUrl,
      createdAt: dto.createdAt
    };
  }

  static fromLocationDto(dto: LiveLocationDto): LiveLocation {
    return {
      employeeId: dto.employeeId,
      employeeName: dto.employeeName,
      employeeCode: dto.employeeCode,
      latitude: dto.latitude,
      longitude: dto.longitude,
      recordedAt: dto.recordedAt,
      accuracyMeters: dto.accuracyMeters,
      batteryPercentage: dto.batteryPercentage
    };
  }

  static fromDistanceDto(dto: TravelDistanceSummaryDto): TravelDistanceSummary {
    return {
      employeeId: dto.employeeId,
      totalDistanceKm: dto.totalDistanceKm,
      totalVisitsCount: dto.totalVisitsCount
    };
  }
}

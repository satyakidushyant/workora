export interface FieldVisitDto {
  id: number;
  uuid: string;
  employeeId: number;
  employeeName?: string | null;
  employeeCode?: string | null;
  clientName: string;
  visitPurpose: string;
  checkInTime: string;
  checkInLatitude: number;
  checkInLongitude: number;
  checkInAddress: string;
  checkOutTime?: string | null;
  checkOutLatitude?: number | null;
  checkOutLongitude?: number | null;
  distanceTraveledKm: number;
  meetingNotes?: string | null;
  signatureUrl?: string | null;
  createdAt: string;
}

export interface LiveLocationDto {
  employeeId: number;
  employeeName?: string | null;
  employeeCode?: string | null;
  latitude: number;
  longitude: number;
  recordedAt: string;
  accuracyMeters: number;
  batteryPercentage: number;
}

export interface TravelDistanceSummaryDto {
  employeeId: number;
  totalDistanceKm: number;
  totalVisitsCount: number;
}

export interface CheckInVisitRequestDto {
  employeeId: number;
  clientName: string;
  visitPurpose: string;
  checkInLatitude: number;
  checkInLongitude: number;
  checkInAddress: string;
}

export interface CheckOutVisitRequestDto {
  visitId: number;
  checkOutLatitude: number;
  checkOutLongitude: number;
  meetingNotes?: string | null;
  signatureUrl?: string | null;
}

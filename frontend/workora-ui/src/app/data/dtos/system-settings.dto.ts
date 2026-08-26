export interface SystemSettingDto {
  id: number;
  companyId: number;
  key: string;
  value: string;
  description?: string | null;
  group: string;
  isActive: boolean;
}

export interface SettingItemDto {
  key: string;
  value: string;
  description?: string | null;
  group: string;
}

export interface UpdateCompanySettingsRequestDto {
  companyId: number;
  settings: SettingItemDto[];
}

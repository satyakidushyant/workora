/**
 * Domain model representing a system setting configuration item.
 */
export interface SystemSetting {
  id: number;
  companyId: number;
  key: string;
  value: string;
  description?: string | null;
  group: string;
  isActive: boolean;
}

/**
 * Parameters for setting value entry.
 */
export interface SettingEntry {
  key: string;
  value: string;
  description?: string | null;
  group: string;
}

/**
 * Parameters for updating company settings in batch.
 */
export interface UpdateCompanySettingsParams {
  companyId: number;
  settings: SettingEntry[];
}

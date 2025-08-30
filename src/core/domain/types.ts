/**
 * Core Domain Types
 */

export type NutrientType = 'protein' | 'fat' | 'carbs' | 'fiber' | 'sodium' | 'energy' | 'calories';

export type NutrientUnit = 'g' | 'mg' | 'kcal';

export type PerUnit = 'serving' | '100g';

export interface NutrientValue {
  type: NutrientType;
  value: number;
  unit: NutrientUnit;
}

export interface MenuItemData {
  id: string;
  chain: string;
  name: string;
  category?: string;
  per: PerUnit;
  nutrients: NutrientValue[];
  servingSize?: string;
  allergens?: string[];
  lastSeenAt: string;
  sourceUrl: string;
  sourceHash: string;
  dataSourceId?: string;
  lastManualUpdate?: string;
  updatedAt?: string;
}

export type DataSourceType = 'official_website' | 'api' | 'manual_entry' | 'user_submission';
export type FetchMethod = 'manual' | 'automated';
export type DataCollectionMethod = 'manual' | 'api' | 'scraping';
export type UpdateType = 'manual' | 'automated' | 'user_correction';
export type LegalNoticeType = 'disclaimer' | 'terms_of_use' | 'privacy_policy' | 'data_usage';

export interface DataSource {
  id: string;
  chainId: string;
  sourceType: DataSourceType;
  sourceUrl?: string;
  lastFetchedAt?: string;
  fetchMethod: FetchMethod;
  dataAccuracyNote?: string;
  legalComplianceNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Chain {
  id: string;
  name: string;
  displayName: string;
  logoUrl?: string;
  websiteUrl?: string;
  nutritionPageUrl?: string;
  termsUrl?: string;
  dataCollectionMethod?: DataCollectionMethod;
  legalNotice?: string;
  createdAt: string;
}

export interface UpdateLog {
  id: string;
  menuItemId?: string;
  chainId?: string;
  updateType: UpdateType;
  updaterName?: string;
  updateNote?: string;
  oldValues?: string;
  newValues?: string;
  createdAt: string;
}

export interface LegalNotice {
  id: string;
  type: LegalNoticeType;
  title: string;
  content: string;
  version: string;
  effectiveDate: string;
  isActive: boolean;
  createdAt: string;
}

export interface UserConsent {
  id: string;
  legalNoticeId: string;
  deviceId: string;
  consentGiven: boolean;
  ipHash?: string;
  createdAt: string;
}

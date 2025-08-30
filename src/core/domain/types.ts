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
}

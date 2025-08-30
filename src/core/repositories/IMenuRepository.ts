/**
 * IMenuRepository
 * Repositoryインターフェース（依存性逆転の原則）
 */

import { MenuItem } from '@core/domain/MenuItem';
import { PerUnit } from '@core/domain/types';

export interface NutrientFilter {
  minProtein?: number;
  maxProtein?: number;
  minCarbs?: number;
  maxCarbs?: number;
  minFat?: number;
  maxFat?: number;
  minCalories?: number;
  maxCalories?: number;
  per?: PerUnit;
}

export interface IMenuRepository {
  // 基本的なCRUD
  findById(id: string): Promise<MenuItem | null>;
  save(item: MenuItem): Promise<void>;
  bulkSave(items: MenuItem[]): Promise<void>;
  delete(id: string): Promise<void>;

  // 店舗別検索
  findByChain(chain: string): Promise<MenuItem[]>;

  // メニュー名検索
  searchByName(query: string): Promise<MenuItem[]>;

  // 栄養素フィルタ
  findByNutrientFilter(filter: NutrientFilter): Promise<MenuItem[]>;

  // その他
  getAvailableChains(): Promise<string[]>;
  getLastUpdatedAt(): Promise<Date | null>;
}

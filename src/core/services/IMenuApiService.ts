/**
 * IMenuApiService
 * メニューAPI通信のインターフェース
 */

import { MenuItem } from '@core/domain/MenuItem';

export interface MenuApiResponse {
  items: MenuItem[];
  etag: string;
  lastModified: string;
}

export interface ChainInfo {
  id: string;
  name: string;
  displayName: string;
  logoUrl?: string;
  websiteUrl?: string;
}

export interface CacheOptions {
  forceRefresh?: boolean; // キャッシュを無視して強制更新
}

export interface IMenuApiService {
  /**
   * 指定チェーンのメニューを取得
   * ETagを使って変更がない場合は304を返す
   */
  fetchMenusByChain(chain: string, options?: CacheOptions): Promise<MenuApiResponse | null>;

  /**
   * すべてのチェーンのメニューを取得
   */
  fetchAllMenus(options?: CacheOptions): Promise<MenuApiResponse | null>;

  /**
   * 利用可能なチェーンリストを取得
   */
  fetchAvailableChains(): Promise<ChainInfo[]>;

  /**
   * キャッシュをクリア
   */
  clearCache(): Promise<void>;
}

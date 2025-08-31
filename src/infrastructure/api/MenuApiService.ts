/**
 * MenuApiService
 * メニューAPI通信の実装
 */

import {
  IMenuApiService,
  MenuApiResponse,
  ChainInfo,
  CacheOptions,
} from '@core/services/IMenuApiService';
import { MenuItem } from '@core/domain/MenuItem';
import { MenuItemData } from '@core/domain/types';
import { ETagCacheManager } from '../cache/ETagCacheManager';
import { Platform } from 'react-native';

export class MenuApiService implements IMenuApiService {
  private readonly baseUrl: string;
  private readonly cacheManager: ETagCacheManager;
  private readonly isDevelopment: boolean;

  constructor(baseUrl: string = 'https://api.protein-finder.example.com') {
    this.baseUrl = baseUrl;
    this.cacheManager = new ETagCacheManager();
    // Web版または開発環境の場合はモックデータを使用
    this.isDevelopment = Platform.OS === 'web' || __DEV__ || baseUrl.includes('example.com');
  }

  async fetchMenusByChain(chain: string, options?: CacheOptions): Promise<MenuApiResponse | null> {
    // 開発環境ではモックデータを返す
    if (this.isDevelopment) {
      return this.getMockMenusByChain(chain);
    }

    const url = `${this.baseUrl}/menus/${chain}`;

    // キャッシュ強制更新でない場合はキャッシュをチェック
    if (!options?.forceRefresh) {
      const cached = await this.cacheManager.getCache(url);
      if (cached) {
        return {
          items: this.parseMenuItems(cached.data.items),
          etag: cached.etag,
          lastModified: cached.data.lastModified,
        };
      }
    }

    try {
      // 保存されているETagを取得
      const savedEtag = await this.cacheManager.getETag(url);

      const headers: HeadersInit = {
        Accept: 'application/json',
      };

      if (savedEtag && !options?.forceRefresh) {
        headers['If-None-Match'] = savedEtag;
      }

      const response = await fetch(url, { headers });

      // 304 Not Modified - キャッシュを返す
      if (response.status === 304) {
        const cached = await this.cacheManager.getCache(url);
        if (cached) {
          return {
            items: this.parseMenuItems(cached.data.items),
            etag: cached.etag,
            lastModified: cached.data.lastModified,
          };
        }
      }

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const etag = response.headers.get('ETag') || '';
      const lastModified = response.headers.get('Last-Modified') || new Date().toISOString();

      // キャッシュに保存
      if (etag) {
        await this.cacheManager.saveETag(url, etag);
        await this.cacheManager.saveCache(url, data, etag);
      }

      return {
        items: this.parseMenuItems(data.items),
        etag,
        lastModified,
      };
    } catch (error) {
      console.error('API request failed:', error);

      // エラー時はキャッシュを返す
      const cached = await this.cacheManager.getCache(url);
      if (cached) {
        return {
          items: this.parseMenuItems(cached.data.items),
          etag: cached.etag,
          lastModified: cached.data.lastModified,
        };
      }

      return null;
    }
  }

  async fetchAllMenus(options?: CacheOptions): Promise<MenuApiResponse | null> {
    // 開発環境ではモックデータを返す
    if (this.isDevelopment) {
      return this.getMockAllMenus();
    }

    const url = `${this.baseUrl}/menus`;

    if (!options?.forceRefresh) {
      const cached = await this.cacheManager.getCache(url);
      if (cached) {
        return {
          items: this.parseMenuItems(cached.data.items),
          etag: cached.etag,
          lastModified: cached.data.lastModified,
        };
      }
    }

    try {
      const savedEtag = await this.cacheManager.getETag(url);

      const headers: HeadersInit = {
        Accept: 'application/json',
      };

      if (savedEtag && !options?.forceRefresh) {
        headers['If-None-Match'] = savedEtag;
      }

      const response = await fetch(url, { headers });

      if (response.status === 304) {
        const cached = await this.cacheManager.getCache(url);
        if (cached) {
          return {
            items: this.parseMenuItems(cached.data.items),
            etag: cached.etag,
            lastModified: cached.data.lastModified,
          };
        }
      }

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const etag = response.headers.get('ETag') || '';
      const lastModified = response.headers.get('Last-Modified') || new Date().toISOString();

      if (etag) {
        await this.cacheManager.saveETag(url, etag);
        await this.cacheManager.saveCache(url, data, etag);
      }

      return {
        items: this.parseMenuItems(data.items),
        etag,
        lastModified,
      };
    } catch (error) {
      console.error('API request failed:', error);

      const cached = await this.cacheManager.getCache(url);
      if (cached) {
        return {
          items: this.parseMenuItems(cached.data.items),
          etag: cached.etag,
          lastModified: cached.data.lastModified,
        };
      }

      return null;
    }
  }

  async fetchAvailableChains(): Promise<ChainInfo[]> {
    // 開発環境ではモックデータを返す
    if (this.isDevelopment) {
      return this.getMockChains();
    }

    const url = `${this.baseUrl}/chains`;

    try {
      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.chains || [];
    } catch (error) {
      console.error('Failed to fetch chains:', error);
      // エラー時もモックデータを返す
      return this.getMockChains();
    }
  }

  async clearCache(): Promise<void> {
    await this.cacheManager.clearAllCache();
  }

  /**
   * APIレスポンスをMenuItemインスタンスに変換
   */
  private parseMenuItems(items: any[]): MenuItem[] {
    return items.map((item) => {
      const data: MenuItemData = {
        id: item.id,
        chain: item.chain,
        name: item.name,
        category: item.category,
        per: item.per,
        nutrients: item.nutrients || [],
        servingSize: item.servingSize,
        allergens: item.allergens,
        lastSeenAt: item.lastSeenAt,
        sourceUrl: item.sourceUrl,
        sourceHash: item.sourceHash,
      };
      return new MenuItem(data);
    });
  }

  /**
   * 開発環境用のモックチェーンデータ
   */
  private getMockChains(): ChainInfo[] {
    return [
      {
        id: 'sukiya',
        name: 'sukiya',
        displayName: 'すき家',
        websiteUrl: 'https://www.sukiya.jp/',
      },
      {
        id: 'yoshinoya',
        name: 'yoshinoya',
        displayName: '吉野家',
        websiteUrl: 'https://www.yoshinoya.com/',
      },
      {
        id: 'matsuya',
        name: 'matsuya',
        displayName: '松屋',
        websiteUrl: 'https://www.matsuyafoods.co.jp/',
      },
      {
        id: 'nakau',
        name: 'nakau',
        displayName: 'なか卯',
        websiteUrl: 'https://www.nakau.co.jp/',
      },
      {
        id: 'mcdonalds',
        name: 'mcdonalds',
        displayName: 'マクドナルド',
        websiteUrl: 'https://www.mcdonalds.co.jp/',
      },
      {
        id: 'mosburger',
        name: 'mosburger',
        displayName: 'モスバーガー',
        websiteUrl: 'https://www.mos.jp/',
      },
      {
        id: 'subway',
        name: 'subway',
        displayName: 'サブウェイ',
        websiteUrl: 'https://www.subway.co.jp/',
      },
      {
        id: 'ootoya',
        name: 'ootoya',
        displayName: '大戸屋',
        websiteUrl: 'https://www.ootoya.com/',
      },
      {
        id: 'gusto',
        name: 'gusto',
        displayName: 'ガスト',
        websiteUrl: 'https://www.skylark.co.jp/gusto/',
      },
      {
        id: 'kfc',
        name: 'kfc',
        displayName: 'ケンタッキー',
        websiteUrl: 'https://www.kfc.co.jp/',
      },
    ];
  }

  /**
   * 開発環境用のモックメニューデータ（チェーン別）
   */
  private getMockMenusByChain(chain: string): MenuApiResponse {
    const allMenus = this.getAllMockMenus();
    const items = allMenus.filter(item => item.chain === chain);
    
    return {
      items,
      etag: 'mock-etag-' + chain,
      lastModified: new Date().toISOString(),
    };
  }

  /**
   * 開発環境用のモックメニューデータ（全件）
   */
  private getMockAllMenus(): MenuApiResponse {
    return {
      items: this.getAllMockMenus(),
      etag: 'mock-etag-all',
      lastModified: new Date().toISOString(),
    };
  }

  /**
   * すべてのモックメニューデータ
   */
  private getAllMockMenus(): MenuItem[] {
    const mockData: MenuItemData[] = [
      // すき家
      {
        id: 'sukiya_gyudon_medium',
        chain: 'sukiya',
        name: '牛丼（並）',
        category: '牛丼',
        per: 'serving',
        nutrients: [
          { type: 'protein', value: 20.2, unit: 'g' },
          { type: 'fat', value: 25.0, unit: 'g' },
          { type: 'carbs', value: 103.2, unit: 'g' },
          { type: 'energy', value: 733, unit: 'kcal' },
        ],
        servingSize: '350g',
        lastSeenAt: new Date().toISOString(),
        sourceUrl: 'https://www.sukiya.jp/menu/',
        sourceHash: 'mock_hash_sukiya_1',
      },
      {
        id: 'sukiya_cheese_gyudon',
        chain: 'sukiya',
        name: '3種のチーズ牛丼（並）',
        category: '牛丼',
        per: 'serving',
        nutrients: [
          { type: 'protein', value: 28.6, unit: 'g' },
          { type: 'fat', value: 38.2, unit: 'g' },
          { type: 'carbs', value: 105.0, unit: 'g' },
          { type: 'energy', value: 889, unit: 'kcal' },
        ],
        lastSeenAt: new Date().toISOString(),
        sourceUrl: 'https://www.sukiya.jp/menu/',
        sourceHash: 'mock_hash_sukiya_2',
      },
      // 吉野家
      {
        id: 'yoshinoya_gyudon_medium',
        chain: 'yoshinoya',
        name: '牛丼（並）',
        category: '牛丼',
        per: 'serving',
        nutrients: [
          { type: 'protein', value: 20.0, unit: 'g' },
          { type: 'fat', value: 23.4, unit: 'g' },
          { type: 'carbs', value: 92.8, unit: 'g' },
          { type: 'energy', value: 635, unit: 'kcal' },
        ],
        servingSize: '340g',
        lastSeenAt: new Date().toISOString(),
        sourceUrl: 'https://www.yoshinoya.com/menu/',
        sourceHash: 'mock_hash_yoshinoya_1',
      },
      // 松屋
      {
        id: 'matsuya_gyumeshi_medium',
        chain: 'matsuya',
        name: '牛めし（並）',
        category: '牛めし',
        per: 'serving',
        nutrients: [
          { type: 'protein', value: 18.3, unit: 'g' },
          { type: 'fat', value: 24.8, unit: 'g' },
          { type: 'carbs', value: 100.1, unit: 'g' },
          { type: 'energy', value: 692, unit: 'kcal' },
        ],
        servingSize: '360g',
        lastSeenAt: new Date().toISOString(),
        sourceUrl: 'https://www.matsuyafoods.co.jp/matsuya/menu/',
        sourceHash: 'mock_hash_matsuya_1',
      },
      // マクドナルド
      {
        id: 'mcdonalds_bigmac',
        chain: 'mcdonalds',
        name: 'ビッグマック',
        category: 'バーガー',
        per: 'serving',
        nutrients: [
          { type: 'protein', value: 26.0, unit: 'g' },
          { type: 'fat', value: 28.3, unit: 'g' },
          { type: 'carbs', value: 45.0, unit: 'g' },
          { type: 'energy', value: 525, unit: 'kcal' },
        ],
        lastSeenAt: new Date().toISOString(),
        sourceUrl: 'https://www.mcdonalds.co.jp/menu/',
        sourceHash: 'mock_hash_mc_1',
      },
      {
        id: 'mcdonalds_chicken_nuggets',
        chain: 'mcdonalds',
        name: 'チキンマックナゲット（5ピース）',
        category: 'サイドメニュー',
        per: 'serving',
        nutrients: [
          { type: 'protein', value: 15.8, unit: 'g' },
          { type: 'fat', value: 17.2, unit: 'g' },
          { type: 'carbs', value: 12.2, unit: 'g' },
          { type: 'energy', value: 270, unit: 'kcal' },
        ],
        lastSeenAt: new Date().toISOString(),
        sourceUrl: 'https://www.mcdonalds.co.jp/menu/',
        sourceHash: 'mock_hash_mc_2',
      },
      // モスバーガー
      {
        id: 'mosburger_mos_burger',
        chain: 'mosburger',
        name: 'モスバーガー',
        category: 'バーガー',
        per: 'serving',
        nutrients: [
          { type: 'protein', value: 17.4, unit: 'g' },
          { type: 'fat', value: 16.2, unit: 'g' },
          { type: 'carbs', value: 38.7, unit: 'g' },
          { type: 'energy', value: 367, unit: 'kcal' },
        ],
        lastSeenAt: new Date().toISOString(),
        sourceUrl: 'https://www.mos.jp/menu/',
        sourceHash: 'mock_hash_mos_1',
      },
      // サブウェイ
      {
        id: 'subway_blt',
        chain: 'subway',
        name: 'BLT（レギュラー）',
        category: 'サンドイッチ',
        per: 'serving',
        nutrients: [
          { type: 'protein', value: 16.0, unit: 'g' },
          { type: 'fat', value: 13.9, unit: 'g' },
          { type: 'carbs', value: 36.0, unit: 'g' },
          { type: 'energy', value: 327, unit: 'kcal' },
        ],
        lastSeenAt: new Date().toISOString(),
        sourceUrl: 'https://www.subway.co.jp/menu/',
        sourceHash: 'mock_hash_subway_1',
      },
      // 大戸屋
      {
        id: 'ootoya_chicken_katsu',
        chain: 'ootoya',
        name: 'チキンかつ定食',
        category: '定食',
        per: 'serving',
        nutrients: [
          { type: 'protein', value: 38.2, unit: 'g' },
          { type: 'fat', value: 31.5, unit: 'g' },
          { type: 'carbs', value: 95.3, unit: 'g' },
          { type: 'energy', value: 823, unit: 'kcal' },
        ],
        lastSeenAt: new Date().toISOString(),
        sourceUrl: 'https://www.ootoya.com/menu/',
        sourceHash: 'mock_hash_ootoya_1',
      },
      // ガスト
      {
        id: 'gusto_hamburg',
        chain: 'gusto',
        name: 'チーズINハンバーグ',
        category: 'ハンバーグ',
        per: 'serving',
        nutrients: [
          { type: 'protein', value: 31.2, unit: 'g' },
          { type: 'fat', value: 48.5, unit: 'g' },
          { type: 'carbs', value: 42.3, unit: 'g' },
          { type: 'energy', value: 726, unit: 'kcal' },
        ],
        lastSeenAt: new Date().toISOString(),
        sourceUrl: 'https://www.skylark.co.jp/gusto/menu/',
        sourceHash: 'mock_hash_gusto_1',
      },
      // ケンタッキー
      {
        id: 'kfc_original_chicken',
        chain: 'kfc',
        name: 'オリジナルチキン',
        category: 'チキン',
        per: 'serving',
        nutrients: [
          { type: 'protein', value: 18.3, unit: 'g' },
          { type: 'fat', value: 14.7, unit: 'g' },
          { type: 'carbs', value: 7.9, unit: 'g' },
          { type: 'energy', value: 237, unit: 'kcal' },
        ],
        servingSize: '1ピース（87g）',
        lastSeenAt: new Date().toISOString(),
        sourceUrl: 'https://www.kfc.co.jp/menu/',
        sourceHash: 'mock_hash_kfc_1',
      },
    ];

    return mockData.map(data => new MenuItem(data));
  }
}

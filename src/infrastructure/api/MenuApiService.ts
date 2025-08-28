/**
 * MenuApiService
 * メニューAPI通信の実装
 */

import { IMenuApiService, MenuApiResponse, ChainInfo, CacheOptions } from '@core/services/IMenuApiService';
import { MenuItem } from '@core/domain/MenuItem';
import { MenuItemData } from '@core/domain/types';
import { ETagCacheManager } from '../cache/ETagCacheManager';

export class MenuApiService implements IMenuApiService {
  private readonly baseUrl: string;
  private readonly cacheManager: ETagCacheManager;

  constructor(baseUrl: string = 'https://api.protein-finder.example.com') {
    this.baseUrl = baseUrl;
    this.cacheManager = new ETagCacheManager();
  }

  async fetchMenusByChain(chain: string, options?: CacheOptions): Promise<MenuApiResponse | null> {
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
        'Accept': 'application/json',
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
        'Accept': 'application/json',
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
    const url = `${this.baseUrl}/chains`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.chains || [];
    } catch (error) {
      console.error('Failed to fetch chains:', error);
      
      // フォールバック: ハードコーディングされた初期チェーンリスト
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
      ];
    }
  }

  async clearCache(): Promise<void> {
    await this.cacheManager.clearAllCache();
  }

  /**
   * APIレスポンスをMenuItemインスタンスに変換
   */
  private parseMenuItems(items: any[]): MenuItem[] {
    return items.map(item => {
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
}
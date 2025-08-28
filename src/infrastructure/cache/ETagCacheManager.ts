/**
 * ETagCacheManager
 * ETagベースのHTTPキャッシュ管理
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

interface CacheEntry {
  etag: string;
  data: any;
  timestamp: number;
  url: string;
}

export class ETagCacheManager {
  private static readonly CACHE_PREFIX = '@protein_finder_cache:';
  private static readonly ETAG_PREFIX = '@protein_finder_etag:';
  private static readonly CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24時間

  /**
   * ETagを保存
   */
  async saveETag(url: string, etag: string): Promise<void> {
    const key = `${ETagCacheManager.ETAG_PREFIX}${url}`;
    await AsyncStorage.setItem(key, etag);
  }

  /**
   * 保存されているETagを取得
   */
  async getETag(url: string): Promise<string | null> {
    const key = `${ETagCacheManager.ETAG_PREFIX}${url}`;
    return await AsyncStorage.getItem(key);
  }

  /**
   * レスポンスデータをキャッシュ
   */
  async saveCache(url: string, data: any, etag: string): Promise<void> {
    const key = `${ETagCacheManager.CACHE_PREFIX}${url}`;
    const entry: CacheEntry = {
      etag,
      data,
      timestamp: Date.now(),
      url,
    };
    await AsyncStorage.setItem(key, JSON.stringify(entry));
  }

  /**
   * キャッシュされたデータを取得
   */
  async getCache(url: string): Promise<CacheEntry | null> {
    const key = `${ETagCacheManager.CACHE_PREFIX}${url}`;
    const cached = await AsyncStorage.getItem(key);
    
    if (!cached) return null;
    
    const entry: CacheEntry = JSON.parse(cached);
    
    // キャッシュ期限チェック
    if (Date.now() - entry.timestamp > ETagCacheManager.CACHE_EXPIRY_MS) {
      await this.removeCache(url);
      return null;
    }
    
    return entry;
  }

  /**
   * 特定URLのキャッシュを削除
   */
  async removeCache(url: string): Promise<void> {
    const cacheKey = `${ETagCacheManager.CACHE_PREFIX}${url}`;
    const etagKey = `${ETagCacheManager.ETAG_PREFIX}${url}`;
    
    await Promise.all([
      AsyncStorage.removeItem(cacheKey),
      AsyncStorage.removeItem(etagKey),
    ]);
  }

  /**
   * すべてのキャッシュをクリア
   */
  async clearAllCache(): Promise<void> {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(
      key => key.startsWith(ETagCacheManager.CACHE_PREFIX) || 
             key.startsWith(ETagCacheManager.ETAG_PREFIX)
    );
    
    if (cacheKeys.length > 0) {
      await AsyncStorage.multiRemove(cacheKeys);
    }
  }

  /**
   * キャッシュサイズを取得（デバッグ用）
   */
  async getCacheSize(): Promise<number> {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(key => key.startsWith(ETagCacheManager.CACHE_PREFIX));
    
    let totalSize = 0;
    for (const key of cacheKeys) {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        totalSize += value.length;
      }
    }
    
    return totalSize;
  }
}
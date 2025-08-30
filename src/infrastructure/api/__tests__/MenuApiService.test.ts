/**
 * MenuApiService Tests
 */

import { MenuApiService } from '../MenuApiService';

// AsyncStorageのモック
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
}));

// fetchのモック
global.fetch = jest.fn();

describe('MenuApiService', () => {
  let service: MenuApiService;

  beforeEach(() => {
    service = new MenuApiService('https://api.test.com');
    jest.clearAllMocks();

    // fetchモックをリセット
    (fetch as jest.Mock).mockReset();

    // AsyncStorageのモックをリセット
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    AsyncStorage.getItem.mockReset().mockResolvedValue(null);
    AsyncStorage.setItem.mockReset().mockResolvedValue();
    AsyncStorage.removeItem.mockReset().mockResolvedValue();
    AsyncStorage.multiRemove.mockReset().mockResolvedValue();
    AsyncStorage.getAllKeys.mockReset().mockResolvedValue([]);
  });

  describe('fetchMenusByChain', () => {
    it('新規リクエストでデータを取得できる', async () => {
      const mockResponse = {
        items: [
          {
            id: 'test_item',
            chain: 'test_chain',
            name: 'Test Item',
            per: 'serving',
            nutrients: [{ type: 'protein', value: 20, unit: 'g' }],
            lastSeenAt: '2024-01-01T00:00:00Z',
            sourceUrl: 'https://example.com',
            sourceHash: 'test123',
          },
        ],
        lastModified: '2024-01-01T00:00:00Z',
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: (key: string) => {
            if (key === 'ETag') return '"etag123"';
            if (key === 'Last-Modified') return '2024-01-01T00:00:00Z';
            return null;
          },
        },
        json: async () => mockResponse,
      });

      const result = await service.fetchMenusByChain('test_chain');

      expect(result).not.toBeNull();
      expect(result?.items).toHaveLength(1);
      expect(result?.items[0]?.name).toBe('Test Item');
      expect(result?.etag).toBe('"etag123"');
    });

    it('304レスポンスでキャッシュを返す', async () => {
      const cachedData = JSON.stringify({
        data: {
          items: [
            {
              id: 'cached_item',
              chain: 'test_chain',
              name: 'Cached Item',
              per: 'serving',
              nutrients: [{ type: 'protein', value: 25, unit: 'g' }],
              lastSeenAt: '2024-01-01T00:00:00Z',
              sourceUrl: 'https://example.com',
              sourceHash: 'cached123',
            },
          ],
          lastModified: '2024-01-01T00:00:00Z',
        },
        etag: '"etag123"',
        timestamp: Date.now(),
        url: 'https://api.test.com/menus/test_chain',
      });

      const AsyncStorage = require('@react-native-async-storage/async-storage');
      let cacheCallCount = 0;
      AsyncStorage.getItem.mockImplementation((key: string) => {
        if (key.includes('cache:')) {
          // 最初のキャッシュチェックではnull、304後の取得でキャッシュを返す
          return cacheCallCount++ === 0 ? Promise.resolve(null) : Promise.resolve(cachedData);
        }
        if (key.includes('etag:')) return Promise.resolve('"etag123"');
        return Promise.resolve(null);
      });

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 304,
        headers: {
          get: () => null,
        },
      });

      const result = await service.fetchMenusByChain('test_chain');

      expect(result).not.toBeNull();
      expect(result?.items[0]?.name).toBe('Cached Item');
      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/menus/test_chain',
        expect.objectContaining({
          headers: expect.objectContaining({
            'If-None-Match': '"etag123"',
          }),
        }),
      );
    });

    it('エラー時はキャッシュを返す', async () => {
      const cachedData = JSON.stringify({
        data: {
          items: [
            {
              id: 'cached_item',
              chain: 'test_chain',
              name: 'Cached Item',
              per: 'serving',
              nutrients: [{ type: 'protein', value: 25, unit: 'g' }],
              lastSeenAt: '2024-01-01T00:00:00Z',
              sourceUrl: 'https://example.com',
              sourceHash: 'cached123',
            },
          ],
          lastModified: '2024-01-01T00:00:00Z',
        },
        etag: '"etag123"',
        timestamp: Date.now(),
        url: 'https://api.test.com/menus/test_chain',
      });

      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockImplementation((key: string) => {
        if (key.includes('cache:')) {
          // エラー後にキャッシュを返す
          return Promise.resolve(cachedData);
        }
        return Promise.resolve(null);
      });

      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await service.fetchMenusByChain('test_chain');

      expect(result).not.toBeNull();
      expect(result?.items[0]?.name).toBe('Cached Item');
    });

    it('forceRefreshでキャッシュを無視する', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      // forceRefreshの場合はキャッシュを無視するためnullを返す
      AsyncStorage.getItem.mockImplementation((_key: string) => {
        return Promise.resolve(null); // すべてnullでキャッシュなし状態に
      });

      const mockResponse = {
        items: [
          {
            id: 'new_item',
            chain: 'test_chain',
            name: 'New Item',
            per: 'serving',
            nutrients: [{ type: 'protein', value: 30, unit: 'g' }],
            lastSeenAt: '2024-01-02T00:00:00Z',
            sourceUrl: 'https://example.com',
            sourceHash: 'new123',
          },
        ],
        lastModified: '2024-01-02T00:00:00Z',
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: (key: string) => {
            if (key === 'ETag') return '"etag456"';
            if (key === 'Last-Modified') return '2024-01-02T00:00:00Z';
            return null;
          },
        },
        json: async () => mockResponse,
      });

      const result = await service.fetchMenusByChain('test_chain', { forceRefresh: true });

      expect(result).not.toBeNull();
      expect(result?.items[0]?.name).toBe('New Item');
      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/menus/test_chain',
        expect.objectContaining({
          headers: expect.not.objectContaining({
            'If-None-Match': expect.anything(),
          }),
        }),
      );
    });
  });

  describe('fetchAvailableChains', () => {
    it('チェーンリストを取得できる', async () => {
      const mockChains = {
        chains: [
          {
            id: 'chain1',
            name: 'chain1',
            displayName: 'Chain 1',
            websiteUrl: 'https://chain1.com',
          },
          {
            id: 'chain2',
            name: 'chain2',
            displayName: 'Chain 2',
            websiteUrl: 'https://chain2.com',
          },
        ],
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockChains),
      });

      const result = await service.fetchAvailableChains();

      expect(result).toHaveLength(2);
      expect(result[0]?.displayName).toBe('Chain 1');
    });

    it('エラー時はフォールバックチェーンリストを返す', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await service.fetchAvailableChains();

      expect(result).toHaveLength(4);
      expect(result[0]?.id).toBe('sukiya');
      expect(result[1]?.id).toBe('yoshinoya');
      expect(result[2]?.id).toBe('matsuya');
      expect(result[3]?.id).toBe('nakau');
    });
  });

  describe('clearCache', () => {
    it('キャッシュをクリアできる', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getAllKeys.mockResolvedValueOnce([
        '@protein_finder_cache:test1',
        '@protein_finder_etag:test1',
      ]);
      AsyncStorage.multiRemove.mockResolvedValueOnce();

      await service.clearCache();

      expect(AsyncStorage.getAllKeys).toHaveBeenCalled();
      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([
        '@protein_finder_cache:test1',
        '@protein_finder_etag:test1',
      ]);
    });
  });
});

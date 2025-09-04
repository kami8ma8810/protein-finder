import { MenuItem } from '@/core/domain/MenuItem';
import { ChainInfo } from '@/core/domain/ChainInfo';
import { MenuApiResponse } from '@/core/services/IMenuApiService';
import { chainData } from '@/data/chainData';

export class MenuApiService {
  private static instance: MenuApiService;

  private constructor() {}

  static getInstance(): MenuApiService {
    if (!MenuApiService.instance) {
      MenuApiService.instance = new MenuApiService();
    }
    return MenuApiService.instance;
  }

  async searchMenuItems(query: string): Promise<MenuItem[]> {
    // シミュレート: API呼び出しの遅延
    await new Promise(resolve => setTimeout(resolve, 300));

    const lowercaseQuery = query.toLowerCase();
    const results: MenuItem[] = [];

    for (const chain of chainData) {
      const matchingItems = chain.menuItems.filter(item =>
        item.name.toLowerCase().includes(lowercaseQuery) ||
        item.category.toLowerCase().includes(lowercaseQuery)
      );
      results.push(...matchingItems);
    }

    // たんぱく質量でソート（降順）
    return results.sort((a, b) => b.proteinG - a.proteinG);
  }

  async getMenuItemsByChainId(chainId: string): Promise<MenuItem[]> {
    // シミュレート: API呼び出しの遅延
    await new Promise(resolve => setTimeout(resolve, 200));

    const chain = chainData.find(c => c.id === chainId);
    return chain ? [...chain.menuItems] : [];
  }

  async getChainInfo(chainId: string): Promise<ChainInfo | null> {
    // シミュレート: API呼び出しの遅延
    await new Promise(resolve => setTimeout(resolve, 100));

    const chain = chainData.find(c => c.id === chainId);
    if (!chain) return null;

    return {
      id: chain.id,
      name: chain.name,
      category: chain.category,
      logoUrl: chain.logoUrl,
      websiteUrl: chain.websiteUrl,
    };
  }

  async getAllChains(): Promise<ChainInfo[]> {
    // シミュレート: API呼び出しの遅延
    await new Promise(resolve => setTimeout(resolve, 100));

    return chainData.map(chain => ({
      id: chain.id,
      name: chain.name,
      displayName: chain.name, // displayNameも追加
      category: chain.category,
      logoUrl: chain.logoUrl,
      websiteUrl: chain.websiteUrl,
    }));
  }

  // 互換性のためのエイリアス
  async fetchAvailableChains(): Promise<ChainInfo[]> {
    return this.getAllChains();
  }

  async fetchAllMenus(): Promise<MenuApiResponse> {
    const allItems: MenuItem[] = [];
    for (const chain of chainData) {
      allItems.push(...chain.menuItems);
    }
    
    return {
      items: allItems.sort((a, b) => b.proteinG - a.proteinG),
      etag: 'mock-etag-' + Date.now(),
      lastModified: new Date().toISOString()
    };
  }

  async fetchMenusByChain(
    chainId: string,
    options?: { sortBy?: string; order?: 'asc' | 'desc' }
  ): Promise<MenuItem[]> {
    const items = await this.getMenuItemsByChainId(chainId);
    
    if (options?.sortBy === 'protein' && options?.order === 'desc') {
      return items.sort((a, b) => b.proteinG - a.proteinG);
    }
    
    return items;
  }

  async getTopProteinItems(limit: number = 10): Promise<MenuItem[]> {
    // シミュレート: API呼び出しの遅延
    await new Promise(resolve => setTimeout(resolve, 200));

    const allItems: MenuItem[] = [];
    for (const chain of chainData) {
      allItems.push(...chain.menuItems);
    }

    return allItems
      .sort((a, b) => b.proteinG - a.proteinG)
      .slice(0, limit);
  }

  async getMenuItemById(itemId: string): Promise<MenuItem | null> {
    // シミュレート: API呼び出しの遅延
    await new Promise(resolve => setTimeout(resolve, 100));

    for (const chain of chainData) {
      const item = chain.menuItems.find(item => item.id === itemId);
      if (item) return item;
    }
    return null;
  }

  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    // シミュレート: API呼び出しの遅延
    await new Promise(resolve => setTimeout(resolve, 200));

    const results: MenuItem[] = [];
    const lowercaseCategory = category.toLowerCase();

    for (const chain of chainData) {
      const matchingItems = chain.menuItems.filter(item =>
        item.category.toLowerCase() === lowercaseCategory
      );
      results.push(...matchingItems);
    }

    return results.sort((a, b) => b.proteinG - a.proteinG);
  }

  async getMenuItemsByProteinRange(minProtein: number, maxProtein?: number): Promise<MenuItem[]> {
    // シミュレート: API呼び出しの遅延
    await new Promise(resolve => setTimeout(resolve, 200));

    const results: MenuItem[] = [];

    for (const chain of chainData) {
      const matchingItems = chain.menuItems.filter(item => {
        if (maxProtein !== undefined) {
          return item.proteinG >= minProtein && item.proteinG <= maxProtein;
        }
        return item.proteinG >= minProtein;
      });
      results.push(...matchingItems);
    }

    return results.sort((a, b) => b.proteinG - a.proteinG);
  }
}

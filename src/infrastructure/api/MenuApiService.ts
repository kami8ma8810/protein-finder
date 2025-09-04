import { MenuItem } from '@/core/domain/MenuItem';
import { SimpleMenuItem } from '@/core/domain/SimpleMenuItem';
import { ChainInfo } from '@/core/services/IMenuApiService';
import { MenuApiResponse } from '@/core/services/IMenuApiService';
import { chainData } from '@/data/chainData';

export class MenuApiService {
  private static instance: MenuApiService;

  constructor() {}

  static getInstance(): MenuApiService {
    if (!MenuApiService.instance) {
      MenuApiService.instance = new MenuApiService();
    }
    return MenuApiService.instance;
  }

  // SimpleMenuItemからMenuItemクラスへの変換
  private convertToMenuItem(simple: SimpleMenuItem): MenuItem {
    return {
      id: simple.id,
      chain: simple.chainId,
      name: simple.name,
      category: simple.category,
      proteinG: simple.proteinG,
      calories: simple.calories,
      carbsG: simple.carbsG,
      fatG: simple.fatG,
      priceYen: simple.priceYen,
      isAvailable: simple.isAvailable,
      isSeasonal: simple.isSeasonal,
      servingSizeG: simple.servingSizeG,
      allergens: simple.allergens,
      // MenuItemのメソッドとプロパティを追加
      proteinInGrams: simple.proteinG,
      caloriesInKcal: simple.calories || 0,
      getNutrient: (type: string) => {
        if (type === 'energy' || type === 'calories') {
          return { value: simple.calories || 0, unit: 'kcal', type: 'calories' };
        }
        return undefined;
      },
      getNutrientInGrams: (type: string) => {
        switch(type) {
          case 'protein':
            return simple.proteinG;
          case 'fat':
            return simple.fatG || 0;
          case 'carbs':
            return simple.carbsG || 0;
          default:
            return 0;
        }
      },
    } as any; // 一時的にanyを使用
  }

  async searchMenuItems(query: string): Promise<MenuItem[]> {
    // シミュレート: API呼び出しの遅延
    await new Promise(resolve => setTimeout(resolve, 300));

    const lowercaseQuery = query.toLowerCase();
    const results: SimpleMenuItem[] = [];

    for (const chain of chainData) {
      const matchingItems = chain.menuItems.filter(item =>
        item.name.toLowerCase().includes(lowercaseQuery) ||
        item.category?.toLowerCase().includes(lowercaseQuery)
      );
      results.push(...matchingItems);
    }

    // たんぱく質量でソート（降順）してMenuItemに変換
    return results
      .sort((a, b) => b.proteinG - a.proteinG)
      .map(item => this.convertToMenuItem(item));
  }

  async getMenuItemsByChainId(chainId: string): Promise<MenuItem[]> {
    // シミュレート: API呼び出しの遅延
    await new Promise(resolve => setTimeout(resolve, 200));

    const chain = chainData.find(c => c.id === chainId);
    return chain ? chain.menuItems.map(item => this.convertToMenuItem(item)) : [];
  }

  async getChainInfo(chainId: string): Promise<ChainInfo | null> {
    // シミュレート: API呼び出しの遅延
    await new Promise(resolve => setTimeout(resolve, 100));

    const chain = chainData.find(c => c.id === chainId);
    if (!chain) return null;

    return {
      id: chain.id,
      name: chain.name,
      displayName: chain.name,
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
      logoUrl: chain.logoUrl,
      websiteUrl: chain.websiteUrl,
    }));
  }

  // 互換性のためのエイリアス
  async fetchAvailableChains(): Promise<ChainInfo[]> {
    return this.getAllChains();
  }

  async fetchAllMenus(): Promise<MenuApiResponse> {
    const allItems: SimpleMenuItem[] = [];
    for (const chain of chainData) {
      allItems.push(...chain.menuItems);
    }
    
    const sortedItems = allItems
      .sort((a, b) => b.proteinG - a.proteinG)
      .map(item => this.convertToMenuItem(item));
    
    return {
      items: sortedItems,
      etag: 'mock-etag-' + Date.now(),
      lastModified: new Date().toISOString()
    };
  }

  async fetchMenusByChain(
    chainId: string,
    options?: { sortBy?: string; order?: 'asc' | 'desc'; forceRefresh?: boolean }
  ): Promise<MenuApiResponse> {
    const items = await this.getMenuItemsByChainId(chainId);
    
    let sortedItems = items;
    if (options?.sortBy === 'protein' && options?.order === 'desc') {
      sortedItems = items.sort((a, b) => (b as any).proteinG - (a as any).proteinG);
    }
    
    return {
      items: sortedItems,
      etag: 'mock-etag-' + Date.now(),
      lastModified: new Date().toISOString()
    };
  }

  async getTopProteinItems(limit: number = 10): Promise<MenuItem[]> {
    // シミュレート: API呼び出しの遅延
    await new Promise(resolve => setTimeout(resolve, 200));

    const allItems: SimpleMenuItem[] = [];
    for (const chain of chainData) {
      allItems.push(...chain.menuItems);
    }

    return allItems
      .sort((a, b) => b.proteinG - a.proteinG)
      .slice(0, limit)
      .map(item => this.convertToMenuItem(item));
  }

  async getMenuItemById(itemId: string): Promise<MenuItem | null> {
    // シミュレート: API呼び出しの遅延
    await new Promise(resolve => setTimeout(resolve, 100));

    for (const chain of chainData) {
      const item = chain.menuItems.find(item => item.id === itemId);
      if (item) return this.convertToMenuItem(item);
    }
    return null;
  }

  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    // シミュレート: API呼び出しの遅延
    await new Promise(resolve => setTimeout(resolve, 200));

    const results: SimpleMenuItem[] = [];
    const lowercaseCategory = category.toLowerCase();

    for (const chain of chainData) {
      const matchingItems = chain.menuItems.filter(item =>
        item.category.toLowerCase() === lowercaseCategory
      );
      results.push(...matchingItems);
    }

    return results
      .sort((a, b) => b.proteinG - a.proteinG)
      .map(item => this.convertToMenuItem(item));
  }

  async getMenuItemsByProteinRange(minProtein: number, maxProtein?: number): Promise<MenuItem[]> {
    // シミュレート: API呼び出しの遅延
    await new Promise(resolve => setTimeout(resolve, 200));

    const results: SimpleMenuItem[] = [];

    for (const chain of chainData) {
      const matchingItems = chain.menuItems.filter(item => {
        if (maxProtein !== undefined) {
          return item.proteinG >= minProtein && item.proteinG <= maxProtein;
        }
        return item.proteinG >= minProtein;
      });
      results.push(...matchingItems);
    }

    return results
      .sort((a, b) => b.proteinG - a.proteinG)
      .map(item => this.convertToMenuItem(item));
  }
  
  // キャッシュクリア（互換性のため）
  async clearCache(): Promise<void> {
    // モックなので何もしない
    return Promise.resolve();
  }
}
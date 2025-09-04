import { SimpleMenuItem } from '../core/domain/SimpleMenuItem';

// メニューアイテムを含むチェーン店情報
export interface ChainWithMenu {
  id: string;
  name: string;
  category: string;
  logoUrl?: string;
  websiteUrl?: string;
  menuItems: SimpleMenuItem[];
}

// アイコン情報のインターフェース
export interface ChainIconInfo {
  iconFamily: 'Ionicons' | 'MaterialIcons' | 'MaterialCommunityIcons';
  iconName: string;
  size: number;
  color: string;
}

// チェーン店データ（配列形式）
export const chainData: ChainWithMenu[] = [
  {
    id: 'yoshinoya',
    name: '吉野家',
    category: 'beef-bowl',
    websiteUrl: 'https://www.yoshinoya.com/',
    menuItems: [
      {
        id: 'yoshinoya_gyudon_normal',
        chainId: 'yoshinoya',
        name: '牛丼（並盛）',
        category: '丼',
        proteinG: 20.0,
        calories: 635,
        carbsG: 92.8,
        fatG: 20.4,
        priceYen: 468,
        isAvailable: true
      },
      {
        id: 'yoshinoya_gyudon_large',
        chainId: 'yoshinoya',
        name: '牛丼（大盛）',
        category: '丼',
        proteinG: 25.9,
        calories: 846,
        carbsG: 126.6,
        fatG: 26.0,
        priceYen: 621,
        isAvailable: true
      },
      {
        id: 'yoshinoya_gyudon_tokumori',
        chainId: 'yoshinoya',
        name: '牛丼（特盛）',
        category: '丼',
        proteinG: 35.7,
        calories: 1063,
        carbsG: 138.2,
        fatG: 37.1,
        priceYen: 765,
        isAvailable: true
      },
      {
        id: 'yoshinoya_nikudaku',
        chainId: 'yoshinoya',
        name: '肉だく牛丼',
        category: '丼',
        proteinG: 30.0,
        calories: 800,
        carbsG: 93.0,
        fatG: 30.0,
        priceYen: 668,
        isAvailable: true
      },
      {
        id: 'yoshinoya_butadon',
        chainId: 'yoshinoya',
        name: '豚丼（並盛）',
        category: '丼',
        proteinG: 18.0,
        calories: 600,
        carbsG: 85.0,
        fatG: 18.0,
        priceYen: 438,
        isAvailable: true
      }
    ]
  },
  {
    id: 'sukiya',
    name: 'すき家',
    category: 'beef-bowl',
    websiteUrl: 'https://www.sukiya.jp/',
    menuItems: [
      {
        id: 'sukiya_gyudon_normal',
        chainId: 'sukiya',
        name: '牛丼（並盛）',
        category: '丼',
        proteinG: 22.9,
        calories: 733,
        carbsG: 104.1,
        fatG: 25.0,
        priceYen: 400,
        isAvailable: true
      },
      {
        id: 'sukiya_gyudon_cheese',
        chainId: 'sukiya',
        name: 'チーズ牛丼（並盛）',
        category: '丼',
        proteinG: 28.6,
        calories: 867,
        carbsG: 105.3,
        fatG: 37.4,
        priceYen: 530,
        isAvailable: true
      },
      {
        id: 'sukiya_gyudon_mega',
        chainId: 'sukiya',
        name: 'メガ牛丼',
        category: '丼',
        proteinG: 48.5,
        calories: 1458,
        carbsG: 143.0,
        fatG: 58.9,
        priceYen: 780,
        isAvailable: true
      },
      {
        id: 'sukiya_takana',
        chainId: 'sukiya',
        name: '高菜明太マヨ牛丼',
        category: '丼',
        proteinG: 24.0,
        calories: 850,
        carbsG: 105.0,
        fatG: 35.0,
        priceYen: 520,
        isAvailable: true
      },
      {
        id: 'sukiya_unadon',
        chainId: 'sukiya',
        name: 'うな丼（並盛）',
        category: '丼',
        proteinG: 25.0,
        calories: 750,
        carbsG: 100.0,
        fatG: 20.0,
        priceYen: 890,
        isAvailable: true,
        isSeasonal: true
      }
    ]
  }
];

// カテゴリーからアイコン情報を取得
export const getCategoryIcon = (category: string): ChainIconInfo => {
  switch (category) {
    case 'beef-bowl':
      return {
        iconFamily: 'MaterialCommunityIcons',
        iconName: 'rice',
        size: 24,
        color: '#DC143C'
      };
    case 'hamburger':
      return {
        iconFamily: 'MaterialCommunityIcons',
        iconName: 'hamburger',
        size: 24,
        color: '#DC143C'
      };
    case 'sandwich':
      return {
        iconFamily: 'MaterialIcons',
        iconName: 'lunch-dining',
        size: 24,
        color: '#DC143C'
      };
    case 'family-restaurant':
      return {
        iconFamily: 'Ionicons',
        iconName: 'restaurant',
        size: 24,
        color: '#DC143C'
      };
    case 'chicken':
      return {
        iconFamily: 'MaterialCommunityIcons',
        iconName: 'food-drumstick',
        size: 24,
        color: '#DC143C'
      };
    case 'sushi':
      return {
        iconFamily: 'MaterialCommunityIcons',
        iconName: 'fish',
        size: 24,
        color: '#DC143C'
      };
    case 'ramen':
      return {
        iconFamily: 'MaterialCommunityIcons',
        iconName: 'noodles',
        size: 24,
        color: '#DC143C'
      };
    case 'coffee':
      return {
        iconFamily: 'MaterialCommunityIcons',
        iconName: 'coffee',
        size: 24,
        color: '#DC143C'
      };
    default:
      return {
        iconFamily: 'Ionicons',
        iconName: 'restaurant-outline',
        size: 24,
        color: '#DC143C'
      };
  }
};

// チェーンIDからアイコン情報を取得
export const getChainIcon = (chainId: string): ChainIconInfo => {
  const chain = chainData.find(c => c.id === chainId);
  return getCategoryIcon(chain?.category || 'other');
};
/**
 * チェーン店の業態と詳細情報
 */

// 業態の種類
export type ChainCategory = 
  | 'beef-bowl'      // 牛丼
  | 'hamburger'      // ハンバーガー
  | 'sandwich'       // サンドイッチ
  | 'family-restaurant' // ファミレス
  | 'chicken'        // チキン
  | 'sushi'          // 寿司
  | 'ramen'          // ラーメン
  | 'coffee'         // カフェ
  | 'other';         // その他

// チェーン店の詳細情報
export interface ChainDetail {
  id: string;
  name: string;
  displayName: string;
  category: ChainCategory;
  websiteUrl?: string;
  description?: string;
}

// チェーン店データ
export const chainData: Record<string, ChainDetail> = {
  // 牛丼系
  sukiya: {
    id: 'sukiya',
    name: 'sukiya',
    displayName: 'すき家',
    category: 'beef-bowl',
    websiteUrl: 'https://www.sukiya.jp/',
    description: '牛丼チェーン最大手'
  },
  yoshinoya: {
    id: 'yoshinoya',
    name: 'yoshinoya',
    displayName: '吉野家',
    category: 'beef-bowl',
    websiteUrl: 'https://www.yoshinoya.com/',
    description: '牛丼チェーンの老舗'
  },
  matsuya: {
    id: 'matsuya',
    name: 'matsuya',
    displayName: '松屋',
    category: 'beef-bowl',
    websiteUrl: 'https://www.matsuyafoods.co.jp/',
    description: '牛めし・定食チェーン'
  },
  nakau: {
    id: 'nakau',
    name: 'nakau',
    displayName: 'なか卯',
    category: 'beef-bowl',
    websiteUrl: 'https://www.nakau.co.jp/',
    description: '親子丼・うどんも提供'
  },
  
  // ハンバーガー系
  mcdonalds: {
    id: 'mcdonalds',
    name: 'mcdonalds',
    displayName: 'マクドナルド',
    category: 'hamburger',
    websiteUrl: 'https://www.mcdonalds.co.jp/',
    description: '世界最大のハンバーガーチェーン'
  },
  mosburger: {
    id: 'mosburger',
    name: 'mosburger',
    displayName: 'モスバーガー',
    category: 'hamburger',
    websiteUrl: 'https://www.mos.jp/',
    description: '日本発のハンバーガーチェーン'
  },
  
  // サンドイッチ
  subway: {
    id: 'subway',
    name: 'subway',
    displayName: 'サブウェイ',
    category: 'sandwich',
    websiteUrl: 'https://www.subway.co.jp/',
    description: 'カスタマイズできるサンドイッチ'
  },
  
  // ファミレス
  ootoya: {
    id: 'ootoya',
    name: 'ootoya',
    displayName: '大戸屋',
    category: 'family-restaurant',
    websiteUrl: 'https://www.ootoya.com/',
    description: '定食レストランチェーン'
  },
  gusto: {
    id: 'gusto',
    name: 'gusto',
    displayName: 'ガスト',
    category: 'family-restaurant',
    websiteUrl: 'https://www.skylark.co.jp/gusto/',
    description: 'ファミリーレストラン'
  },
  
  // チキン
  kfc: {
    id: 'kfc',
    name: 'kfc',
    displayName: 'ケンタッキー',
    category: 'chicken',
    websiteUrl: 'https://www.kfc.co.jp/',
    description: 'フライドチキン専門店'
  }
};

// 業態からアイコン情報を取得
export interface ChainIconInfo {
  iconFamily: 'Ionicons' | 'MaterialIcons' | 'MaterialCommunityIcons';
  iconName: string;
  size: number;
  color: string;
}

export const getCategoryIcon = (category: ChainCategory): ChainIconInfo => {
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

// チェーンIDから詳細情報を取得
export const getChainDetail = (chainId: string): ChainDetail | undefined => {
  return chainData[chainId];
};

// チェーンIDからアイコン情報を取得
export const getChainIcon = (chainId: string): ChainIconInfo => {
  const detail = getChainDetail(chainId);
  return getCategoryIcon(detail?.category || 'other');
};
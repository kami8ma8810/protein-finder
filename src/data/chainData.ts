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
  },
  {
    id: 'mcdonalds',
    name: 'マクドナルド',
    category: 'hamburger',
    websiteUrl: 'https://www.mcdonalds.co.jp/',
    menuItems: [
      {
        id: 'mcd_bigmac',
        chainId: 'mcdonalds',
        name: 'ビッグマック',
        category: 'バーガー',
        proteinG: 27.0,
        calories: 525,
        carbsG: 45.0,
        fatG: 28.2,
        priceYen: 450,
        isAvailable: true
      },
      {
        id: 'mcd_double_cheeseburger',
        chainId: 'mcdonalds',
        name: 'ダブルチーズバーガー',
        category: 'バーガー',
        proteinG: 26.5,
        calories: 457,
        carbsG: 31.0,
        fatG: 25.0,
        priceYen: 400,
        isAvailable: true
      },
      {
        id: 'mcd_teriyaki_mcburger',
        chainId: 'mcdonalds',
        name: 'てりやきマックバーガー',
        category: 'バーガー',
        proteinG: 15.5,
        calories: 478,
        carbsG: 39.0,
        fatG: 30.2,
        priceYen: 400,
        isAvailable: true
      },
      {
        id: 'mcd_chicken_mcnuggets_15',
        chainId: 'mcdonalds',
        name: 'チキンマックナゲット15ピース',
        category: 'サイドメニュー',
        proteinG: 35.4,
        calories: 675,
        carbsG: 30.3,
        fatG: 45.0,
        priceYen: 580,
        isAvailable: true
      },
      {
        id: 'mcd_filet_o_fish',
        chainId: 'mcdonalds',
        name: 'フィレオフィッシュ',
        category: 'バーガー',
        proteinG: 15.8,
        calories: 323,
        carbsG: 35.5,
        fatG: 13.9,
        priceYen: 400,
        isAvailable: true
      }
    ]
  },
  {
    id: 'mosburger',
    name: 'モスバーガー',
    category: 'hamburger',
    websiteUrl: 'https://www.mos.jp/',
    menuItems: [
      {
        id: 'mos_mos_burger',
        chainId: 'mosburger',
        name: 'モスバーガー',
        category: 'バーガー',
        proteinG: 16.0,
        calories: 361,
        carbsG: 35.9,
        fatG: 16.6,
        priceYen: 410,
        isAvailable: true
      },
      {
        id: 'mos_mos_cheese_burger',
        chainId: 'mosburger',
        name: 'モスチーズバーガー',
        category: 'バーガー',
        proteinG: 19.0,
        calories: 414,
        carbsG: 36.1,
        fatG: 20.8,
        priceYen: 460,
        isAvailable: true
      },
      {
        id: 'mos_teriyaki_burger',
        chainId: 'mosburger',
        name: 'テリヤキバーガー',
        category: 'バーガー',
        proteinG: 14.3,
        calories: 377,
        carbsG: 38.7,
        fatG: 18.5,
        priceYen: 410,
        isAvailable: true
      },
      {
        id: 'mos_spicy_mos_burger',
        chainId: 'mosburger',
        name: 'スパイシーモスバーガー',
        category: 'バーガー',
        proteinG: 16.5,
        calories: 385,
        carbsG: 37.0,
        fatG: 18.0,
        priceYen: 450,
        isAvailable: true
      },
      {
        id: 'mos_double_mos_burger',
        chainId: 'mosburger',
        name: 'ダブルモスバーガー',
        category: 'バーガー',
        proteinG: 27.0,
        calories: 514,
        carbsG: 36.5,
        fatG: 28.3,
        priceYen: 560,
        isAvailable: true
      }
    ]
  },
  {
    id: 'kfc',
    name: 'ケンタッキー',
    category: 'chicken',
    websiteUrl: 'https://www.kfc.co.jp/',
    menuItems: [
      {
        id: 'kfc_original_chicken',
        chainId: 'kfc',
        name: 'オリジナルチキン',
        category: 'チキン',
        proteinG: 18.3,
        calories: 237,
        carbsG: 7.9,
        fatG: 14.7,
        priceYen: 290,
        servingSizeG: 100,
        isAvailable: true
      },
      {
        id: 'kfc_red_hot_chicken',
        chainId: 'kfc',
        name: 'レッドホットチキン',
        category: 'チキン',
        proteinG: 16.0,
        calories: 266,
        carbsG: 10.5,
        fatG: 18.0,
        priceYen: 320,
        servingSizeG: 100,
        isAvailable: true
      },
      {
        id: 'kfc_kernel_crispy',
        chainId: 'kfc',
        name: 'カーネルクリスピー',
        category: 'チキン',
        proteinG: 14.0,
        calories: 130,
        carbsG: 6.9,
        fatG: 7.0,
        priceYen: 260,
        servingSizeG: 50,
        isAvailable: true
      },
      {
        id: 'kfc_twister',
        chainId: 'kfc',
        name: 'ツイスター（ペッパーマヨ）',
        category: 'ツイスター',
        proteinG: 16.5,
        calories: 340,
        carbsG: 39.0,
        fatG: 13.0,
        priceYen: 390,
        isAvailable: true
      },
      {
        id: 'kfc_chicken_fillet_sandwich',
        chainId: 'kfc',
        name: 'チキンフィレサンド',
        category: 'サンドイッチ',
        proteinG: 25.0,
        calories: 415,
        carbsG: 36.5,
        fatG: 17.0,
        priceYen: 420,
        isAvailable: true
      }
    ]
  },
  {
    id: 'subway',
    name: 'サブウェイ',
    category: 'sandwich',
    websiteUrl: 'https://www.subway.co.jp/',
    menuItems: [
      {
        id: 'subway_turkey_breast',
        chainId: 'subway',
        name: 'ターキーブレスト',
        category: 'サンドイッチ',
        proteinG: 18.0,
        calories: 264,
        carbsG: 45.0,
        fatG: 3.9,
        priceYen: 450,
        isAvailable: true
      },
      {
        id: 'subway_roast_chicken',
        chainId: 'subway',
        name: 'ローストチキン',
        category: 'サンドイッチ',
        proteinG: 25.0,
        calories: 299,
        carbsG: 44.0,
        fatG: 4.6,
        priceYen: 490,
        isAvailable: true
      },
      {
        id: 'subway_tuna',
        chainId: 'subway',
        name: 'ツナ',
        category: 'サンドイッチ',
        proteinG: 19.0,
        calories: 316,
        carbsG: 44.0,
        fatG: 7.0,
        priceYen: 450,
        isAvailable: true
      },
      {
        id: 'subway_roast_beef',
        chainId: 'subway',
        name: 'ローストビーフ',
        category: 'サンドイッチ',
        proteinG: 20.0,
        calories: 286,
        carbsG: 45.0,
        fatG: 5.0,
        priceYen: 590,
        isAvailable: true
      },
      {
        id: 'subway_blt',
        chainId: 'subway',
        name: 'BLT',
        category: 'サンドイッチ',
        proteinG: 16.0,
        calories: 326,
        carbsG: 43.0,
        fatG: 9.9,
        priceYen: 470,
        isAvailable: true
      }
    ]
  },
  {
    id: 'matsuya',
    name: '松屋',
    category: 'beef-bowl',
    websiteUrl: 'https://www.matsuyafoods.co.jp/',
    menuItems: [
      {
        id: 'matsuya_gyumeshi_normal',
        chainId: 'matsuya',
        name: '牛めし（並盛）',
        category: '丼',
        proteinG: 18.7,
        calories: 692,
        carbsG: 93.0,
        fatG: 22.8,
        priceYen: 400,
        isAvailable: true
      },
      {
        id: 'matsuya_gyumeshi_large',
        chainId: 'matsuya',
        name: '牛めし（大盛）',
        category: '丼',
        proteinG: 24.4,
        calories: 919,
        carbsG: 127.8,
        fatG: 29.4,
        priceYen: 550,
        isAvailable: true
      },
      {
        id: 'matsuya_premium_gyumeshi',
        chainId: 'matsuya',
        name: 'プレミアム牛めし（並盛）',
        category: '丼',
        proteinG: 20.5,
        calories: 751,
        carbsG: 94.0,
        fatG: 28.0,
        priceYen: 490,
        isAvailable: true
      },
      {
        id: 'matsuya_tofu_kimchi_jjigae',
        chainId: 'matsuya',
        name: '豆腐キムチチゲセット',
        category: '定食',
        proteinG: 23.0,
        calories: 665,
        carbsG: 88.0,
        fatG: 18.5,
        priceYen: 690,
        isAvailable: true
      },
      {
        id: 'matsuya_karaage',
        chainId: 'matsuya',
        name: '鶏のから揚げ定食（5個）',
        category: '定食',
        proteinG: 32.0,
        calories: 784,
        carbsG: 92.0,
        fatG: 24.0,
        priceYen: 650,
        isAvailable: true
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
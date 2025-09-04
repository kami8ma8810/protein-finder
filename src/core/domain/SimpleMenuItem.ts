/**
 * シンプルなメニューアイテムのインターフェース
 * APIやデータストレージで使用する簡易版
 */
export interface SimpleMenuItem {
  id: string;
  chainId: string;
  name: string;
  category: string;
  proteinG: number;
  calories?: number;
  carbsG?: number;
  fatG?: number;
  priceYen?: number;
  servingSizeG?: number;
  allergens?: string[];
  isAvailable?: boolean;
  isSeasonal?: boolean;
}

/**
 * チェーン店情報を含むシンプルなメニューアイテム
 */
export interface SimpleMenuItemWithChain extends SimpleMenuItem {
  chainName: string;
}
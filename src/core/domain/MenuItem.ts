/**
 * MenuItem Domain Model
 */

import { MenuItemData, NutrientValue, NutrientType, PerUnit } from './types';

export class MenuItem {
  public readonly id: string;
  public readonly chain: string;
  public readonly name: string;
  public readonly category?: string;
  public readonly per: PerUnit;
  public readonly nutrients: NutrientValue[];
  public readonly servingSize?: string;
  public readonly allergens?: string[];
  public readonly lastSeenAt: string;
  public readonly sourceUrl: string;
  public readonly sourceHash: string;

  constructor(data: MenuItemData) {
    // バリデーション
    if (!data.id) {
      throw new Error('ID is required');
    }
    if (!data.chain) {
      throw new Error('Chain is required');
    }
    if (!data.name) {
      throw new Error('Name is required');
    }

    // 栄養素値のバリデーション
    for (const nutrient of data.nutrients) {
      if (nutrient.value < 0) {
        throw new Error('Nutrient values must be non-negative');
      }
    }

    this.id = data.id;
    this.chain = data.chain;
    this.name = data.name;
    this.category = data.category;
    this.per = data.per;
    this.nutrients = data.nutrients;
    this.servingSize = data.servingSize;
    this.allergens = data.allergens;
    this.lastSeenAt = data.lastSeenAt;
    this.sourceUrl = data.sourceUrl;
    this.sourceHash = data.sourceHash;
  }

  /**
   * 特定の栄養素を取得
   */
  getNutrient(type: NutrientType): NutrientValue | undefined {
    return this.nutrients.find((n) => n.type === type);
  }

  /**
   * タンパク質をグラム単位で取得
   */
  get proteinInGrams(): number {
    const protein = this.getNutrient('protein');
    if (!protein) return 0;

    return this.convertToGrams(protein.value, protein.unit);
  }

  /**
   * 特定の栄養素をグラム単位で取得
   */
  /**
   * カロリーをkcal単位で取得
   */
  get caloriesInKcal(): number {
    const calories = this.getNutrient('calories');
    if (!calories) return 0;

    // caloriesは通常kcal単位で保存されている
    return calories.value;
  }

  getNutrientInGrams(type: NutrientType): number {
    const nutrient = this.getNutrient(type);
    if (!nutrient) return 0;

    return this.convertToGrams(nutrient.value, nutrient.unit);
  }

  /**
   * 単位をグラムに変換
   */
  private convertToGrams(value: number, unit: string): number {
    switch (unit) {
      case 'g':
        return value;
      case 'mg':
        return value / 1000;
      case 'kcal':
        return value; // カロリーはそのまま返す
      default:
        return value;
    }
  }

  /**
   * 100gあたりから1食あたりに変換
   * Why: ユーザーが実際に食べる量での栄養価を知りたいため
   */
  convertToPerServing(): MenuItem | null {
    if (this.per !== '100g' || !this.servingSize) {
      return null;
    }

    const servingGrams = this.extractServingGrams();
    if (!servingGrams) {
      return null;
    }

    const multiplier = servingGrams / 100;
    const convertedNutrients = this.nutrients.map((nutrient) => ({
      ...nutrient,
      value: nutrient.value * multiplier,
    }));

    return new MenuItem({
      ...this,
      per: 'serving' as PerUnit,
      nutrients: convertedNutrients,
    });
  }

  /**
   * サービングサイズから重量を抽出
   * 様々な表記パターンに対応（例：「並盛（350g）」「1食分 250g」「約300グラム」）
   */
  extractServingGrams(): number | null {
    if (!this.servingSize) return null;

    // 全角数字を半角に変換
    const normalized = this.servingSize
      .replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
      .replace(/ｇ/g, 'g')
      .replace(/グラム/g, 'g');

    // パターンマッチング：数字 + g/グラム
    const match = normalized.match(/(\d+)\s*g/i);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }

    return null;
  }
}

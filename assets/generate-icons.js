/**
 * アイコン生成スクリプト
 * シンプルなプロテインアイコンを生成
 */

const fs = require('fs');
const path = require('path');

// アイコンSVGテンプレート
const iconSVG = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <!-- 背景 -->
  <rect width="1024" height="1024" fill="#34C759"/>
  
  <!-- プロテインシェイカーのアイコン -->
  <g transform="translate(512, 512)">
    <!-- ボトル本体 -->
    <rect x="-150" y="-200" width="300" height="350" rx="30" fill="white" opacity="0.95"/>
    
    <!-- キャップ -->
    <rect x="-100" y="-250" width="200" height="60" rx="20" fill="white"/>
    
    <!-- ラベル部分 -->
    <rect x="-150" y="-50" width="300" height="120" fill="#FF6B6B" opacity="0.8"/>
    
    <!-- Pの文字 -->
    <text x="0" y="30" font-family="Arial, sans-serif" font-size="140" font-weight="bold" text-anchor="middle" fill="white">P</text>
    
    <!-- 目盛り線 -->
    <line x1="-120" y1="-150" x2="-80" y2="-150" stroke="#34C759" stroke-width="8"/>
    <line x1="-120" y1="-100" x2="-80" y2="-100" stroke="#34C759" stroke-width="8"/>
    <line x1="-120" y1="-50" x2="-80" y2="-50" stroke="#34C759" stroke-width="8"/>
  </g>
</svg>
`;

// スプラッシュスクリーンSVG
const splashSVG = `
<svg width="1242" height="2688" viewBox="0 0 1242 2688" xmlns="http://www.w3.org/2000/svg">
  <!-- 背景 -->
  <rect width="1242" height="2688" fill="#34C759"/>
  
  <!-- 中央のアイコン -->
  <g transform="translate(621, 1344)">
    <!-- ボトル本体 -->
    <rect x="-150" y="-200" width="300" height="350" rx="30" fill="white" opacity="0.95"/>
    
    <!-- キャップ -->
    <rect x="-100" y="-250" width="200" height="60" rx="20" fill="white"/>
    
    <!-- ラベル部分 -->
    <rect x="-150" y="-50" width="300" height="120" fill="#FF6B6B" opacity="0.8"/>
    
    <!-- Pの文字 -->
    <text x="0" y="30" font-family="Arial, sans-serif" font-size="140" font-weight="bold" text-anchor="middle" fill="white">P</text>
    
    <!-- 目盛り線 -->
    <line x1="-120" y1="-150" x2="-80" y2="-150" stroke="#34C759" stroke-width="8"/>
    <line x1="-120" y1="-100" x2="-80" y2="-100" stroke="#34C759" stroke-width="8"/>
    <line x1="-120" y1="-50" x2="-80" y2="-50" stroke="#34C759" stroke-width="8"/>
  </g>
  
  <!-- アプリ名 -->
  <text x="621" y="1700" font-family="Arial, sans-serif" font-size="72" font-weight="bold" text-anchor="middle" fill="white">Protein Finder</text>
  <text x="621" y="1780" font-family="Arial, sans-serif" font-size="36" text-anchor="middle" fill="white" opacity="0.8">高タンパク質メニューを簡単検索</text>
</svg>
`;

// SVGファイルを保存
fs.writeFileSync(path.join(__dirname, 'icon.svg'), iconSVG.trim());
fs.writeFileSync(path.join(__dirname, 'splash.svg'), splashSVG.trim());

console.log('✅ SVGアイコンを生成しました！');
console.log('');
console.log('次のステップ:');
console.log('1. SVGをPNGに変換（オンラインツールまたはImageMagick使用）');
console.log('   - icon.svg → icon.png (1024x1024)');
console.log('   - icon.svg → adaptive-icon.png (1024x1024)');
console.log('   - icon.svg → favicon.png (48x48)');
console.log('   - splash.svg → splash.png (1242x2688)');
console.log('');
console.log('2. 変換コマンド例（ImageMagickがインストールされている場合）:');
console.log('   convert icon.svg -resize 1024x1024 icon.png');
console.log('   convert icon.svg -resize 1024x1024 adaptive-icon.png');
console.log('   convert icon.svg -resize 48x48 favicon.png');
console.log('   convert splash.svg splash.png');

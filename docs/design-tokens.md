# 設計規範 (Design Tokens)

## 色彩系統

東末世界採用暗色系設計，營造吸血鬼與中世紀神秘氛圍。

### 主要色彩

```css
:root {
  /* 主色調 */
  --color-primary: #1a1a2e;      /* 深夜藍黑 - 主背景 */
  --color-secondary: #16213e;    /* 深藍 - 次背景 */
  --color-accent: #c9a227;       /* 暗金 - 強調/標題 */
  --color-danger: #e63946;       /* 血紅 - 警示/重點 */
  
  /* 背景 */
  --color-bg-dark: #0f0f1a;      /* 極深背景 */
  --color-bg-card: #1a1a2e;      /* 卡片背景 */
  --color-bg-hover: #252545;     /* 懸停狀態 */
  
  /* 文字 */
  --color-text-primary: #e8e8e8; /* 主要文字 */
  --color-text-secondary: #a0a0a0; /* 次要文字 */
  --color-text-muted: #666666;   /* 淡化文字 */
  
  /* 邊框 */
  --color-border: #2a2a4a;       /* 邊框 */
  --color-border-accent: #c9a22755; /* 金色邊框 */
}
```

### 陣營色彩

| 陣營 | 色票 | 用途 |
|------|------|------|
| 東末城 | `#c9a227` | 金色 |
| 吸血鬼 | `#8b0000` | 深紅 |
| 北都 | `#4a90a4` | 冷藍 |
| 西教廷 | `#f5f5dc` | 米白 |

## 字型

```css
:root {
  --font-display: 'Noto Serif TC', serif;   /* 標題 */
  --font-body: 'Noto Sans TC', sans-serif;  /* 內文 */
  --font-mono: 'JetBrains Mono', monospace; /* 程式碼 */
}
```

### 字級

| 名稱 | 大小 | 用途 |
|------|------|------|
| display | 4rem | 大標題 |
| h1 | 2.5rem | 頁面標題 |
| h2 | 2rem | 區塊標題 |
| h3 | 1.5rem | 子標題 |
| body | 1rem | 內文 |
| small | 0.875rem | 輔助文字 |

## 間距

基準單位：4px

```css
--spacing-1: 0.25rem;  /* 4px */
--spacing-2: 0.5rem;   /* 8px */
--spacing-3: 0.75rem;  /* 12px */
--spacing-4: 1rem;     /* 16px */
--spacing-6: 1.5rem;   /* 24px */
--spacing-8: 2rem;     /* 32px */
--spacing-12: 3rem;    /* 48px */
--spacing-16: 4rem;    /* 64px */
```

## 動畫

```css
--transition-fast: 150ms ease;
--transition-base: 250ms ease;
--transition-slow: 400ms ease;
```

## 陰影

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.5);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.5);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
--shadow-glow: 0 0 20px rgba(201, 162, 39, 0.3); /* 金色光暈 */
```

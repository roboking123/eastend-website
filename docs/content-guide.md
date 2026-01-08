# 內容編輯指南

## 概述

網站內容來自 `Universe_DB` 的 Markdown 檔案，或放置於專案 `content/` 目錄。

## 目錄結構

```
content/
├── worlds/           # 世界設定
│   └── eastend.md
├── characters/       # 角色資料
│   ├── aether.md
│   └── john.md
└── lore/             # 詳細設定
    ├── vampires.md
    └── timeline.md
```

## Frontmatter 格式

### 角色

```yaml
---
title: "城主（艾瑟）"
slug: "aether"
category: "character"
faction: "東末城"
status: "alive"
thumbnail: "/images/characters/aether.jpg"
order: 1
tags: ["吸血鬼", "統治者"]
---
```

### 設定

```yaml
---
title: "吸血鬼生態"
slug: "vampire-ecology"
category: "lore"
world: "eastend"
order: 1
---
```

## 圖片規範

- **位置**: `public/images/`
- **格式**: WebP 優先，PNG/JPG 次之
- **命名**: `kebab-case`，例如 `character-aether.webp`
- **尺寸建議**:
  - 角色頭像: 400x400
  - 角色全身: 800x1200
  - 地圖: 1920x1080

## 新增內容步驟

1. 在 `content/` 對應目錄建立 `.md` 檔案
2. 填寫 Frontmatter 欄位
3. 撰寫 Markdown 內容
4. 如有圖片，放置於 `public/images/`
5. 重新建構網站

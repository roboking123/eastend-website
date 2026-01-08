# 東末世界展示網站 (East End World Showcase)

一個展示「東末世界」小說世界觀的宣傳網站。

## 技術棧

- **框架**: Next.js 14 (App Router)
- **樣式**: Tailwind CSS
- **語言**: TypeScript
- **部署**: Vercel

## 快速開始

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev
```

打開 [http://localhost:3000](http://localhost:3000) 查看。

## 專案結構

```
src/
├── app/                    # 頁面路由
│   ├── page.tsx           # 首頁
│   ├── world/             # 世界觀
│   ├── characters/        # 角色
│   └── lore/              # 設定文庫
├── components/            # 可重用元件
│   ├── ui/               # 基礎 UI
│   └── features/         # 功能元件
├── lib/                   # 工具函式
├── styles/               # 全域樣式
└── types/                # 類型定義

content/                   # 內容來源
docs/                      # 專案文檔
```

## 文檔

- [系統架構](./docs/architecture.md)
- [內容編輯指南](./docs/content-guide.md)
- [設計規範](./docs/design-tokens.md)
- [部署指南](./docs/deployment.md)

## 授權

版權所有 © 2026

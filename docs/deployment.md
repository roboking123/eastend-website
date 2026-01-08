# 部署指南

## Vercel 部署

### 首次部署

1. 前往 [vercel.com](https://vercel.com) 並登入
2. 點擊「Add New...」→「Project」
3. 連接 GitHub 並選擇此專案
4. 點擊「Deploy」

### 環境變數

在 Vercel Dashboard → Settings → Environment Variables：

```
# 目前無需環境變數
# 未來可能需要：
# NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## 本地建構

```bash
# 建構生產版本
npm run build

# 本地預覽生產版本
npm run start
```

## 自訂網域

1. Vercel Dashboard → Settings → Domains
2. 輸入自訂網域（如 `eastend.your-domain.com`）
3. 依指示設定 DNS

## 自動部署

- 推送至 `main` 分支時自動觸發部署
- Pull Request 會產生預覽網址

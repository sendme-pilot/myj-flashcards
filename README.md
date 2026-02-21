# MYJ 員工培訓卡系統

Michelle Yuen Jewelry 員工培訓用字卡系統，使用 React + TypeScript + Firebase 建構。

## 技術架構

- **前端**：React 18 + TypeScript + Vite
- **樣式**：TailwindCSS
- **後端**：Firebase（Firestore + Authentication）
- **架構**：Clean Architecture

## 專案結構

```
src/
  domain/           # 領域層：實體、儲存庫介面、值物件
  application/      # 應用層：使用案例、資料傳輸物件
  infrastructure/   # 基礎設施層：Firebase 設定與儲存庫實作
  presentation/     # 展示層：元件、頁面、hooks、context
```

## 環境設定

1. 複製環境變數範本：

```bash
cp .env.example .env.local
```

2. 在 `.env.local` 中填入您的 Firebase 專案設定：

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## Firebase 設定

### Firestore 資料集合

- **flashcards**：字卡資料（id、collection、itemName、front、back、status、createdAt、updatedAt）
- **userProgress**：使用者進度（userId、flashcardId、seen、correct、lastSeenAt）
- **users**：使用者資料（uid、email、displayName、role）

### 使用者角色

- **admin**：管理員，可新增、核准/退回字卡，查看員工學習進度
- **staff**：員工，可瀏覽已核准字卡並進行學習

### 建立使用者

1. 在 Firebase Authentication 中建立 Email/Password 使用者
2. 在 Firestore `users` 集合中建立對應文件（以 uid 為文件 ID）：

```json
{
  "uid": "firebase-auth-uid",
  "email": "user@example.com",
  "displayName": "使用者名稱",
  "role": "admin"
}
```

## 啟動開發伺服器

```bash
npm install
npm run dev
```

## 建置

```bash
npm run build
```

## 功能

- 登入頁面（Email/密碼驗證）
- 管理員後台：新增字卡、核准/退回、查看學習進度
- 員工學習：依系列瀏覽字卡、翻牌互動、記錄學習進度
- 全繁體中文介面
- 行動裝置友善設計

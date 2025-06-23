# 動漫查詢系統

一個基於 Node.js + Vue.js 3 的全棧動漫查詢與管理系統。

## 項目架構

```
node-vue-ele-app/
├── client/          # Vue.js 前端應用
├── routes/          # Express.js API 路由
├── models/          # MongoDB 數據模型
├── config/          # 配置文件
└── server.js        # Express.js 後端服務器
```

## 功能特色

### 前端功能
- 🎬 動漫資料查詢與管理
- 👤 用戶登入與註冊系統
- 🔍 動漫類型篩選功能
- 📱 響應式用戶界面
- 🎨 基於 Element Plus UI 組件庫

### 後端功能
- 🚀 RESTful API 設計
- 🔐 JWT 身份驗證
- 📊 MongoDB 數據存儲
- 🛡️ Passport.js 安全中間層

## 技術棧

**前端**
- Vue.js 3 (Composition API)
- Vue Router 4
- Vuex 4
- Element Plus
- Vite
- TypeScript

**後端**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT
- Passport.js
- bcrypt

## 快速開始

### 環境準備
確保你已安裝：
- Node.js (v14+)
- MongoDB
- npm 或 yarn

### 安裝依賴

```bash
# 安裝後端依賴
npm install

# 安裝前端依賴
npm run client-install
```

### 環境配置

創建 `.env` 文件並配置以下變數：
```env
MONGO_URI=你的MongoDB連接字符串
SECRET_OR_KEY=你的JWT密鑰
```

### 運行項目

```bash
# 同時運行前後端 (開發模式)
npm run dev

# 僅運行後端
npm run server

# 僅運行前端
npm run client

# 生產環境打包
npm run build
```

## 項目截圖

- 登入頁面：動漫主題設計
- 主控台：動漫資料管理界面
- 查詢功能：支持多種篩選條件

## 貢獻

歡迎提交 Issue 和 Pull Request！

## 授權

ISC License

## 作者

高雋喆 
# 使用官方 Node 映像
FROM node:18

# 建立工作目錄
WORKDIR /app

# 複製 server 和 client 的 package 檔案
COPY package*.json ./
COPY client/package*.json ./client/

# 安裝 server 端依賴
RUN npm install

# 複製所有程式碼
COPY . .

# 安裝 client 並打包
RUN cd client && npm install && npm run build

# 設定 production 環境變數
ENV NODE_ENV=production

# 開放 port
EXPOSE 5000

# 啟動 server
CMD ["node", "server.js"]
# server 對應根目錄就好，不需要 server 資料夾
# 以下是你的後端 Dockerfile（放在根目錄）

# backend.Dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]

require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");

const app = express();

console.log("環境變數：", process.env.MONGO_URI, process.env.SECRET_OR_KEY);

// 全域例外捕捉
process.on('uncaughtException', function (err) {
  console.error("Uncaught Exception 發生！");
  console.error(err.stack);
});



// console.log("啟動 server.js");

// 載入路由模組
const users = require("./routes/api/users");
const profiles = require("./routes/api/profiles");

// 資料庫設定
const db = require("./config/keys").mongoURI;

// 中介層設定
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// console.log("已啟用 body-parser");

// Connect to moogodb
mongoose
    .connect( db )
    .then( () => console.log("mongoDB Connected") )
    .catch( err => console.log("MongoDB 連線錯誤", err) );

// passport 初始化
app.use(passport.initialize()); 
require("./config/passport.js")(passport);
// console.log("passport 已初始化");

// console.log("註冊 routes...");

// app.get("/", (req, res) => {
//     res.send("Hello World");
// })

// 掛載 API 路由
app.use("/api/users", users);
app.use("/api/profiles", profiles);
// console.log("routes 已掛載 /api/users, /api/profiles");

// 部署時提供靜態資源
if (process.env.NODE_ENV === "production") {
  console.log("進入 production 模式，註冊靜態資源與 SPA fallback");
  app.use(express.static(path.join(__dirname, "client/dist")));
  console.log("成功還是失敗");
  // 針對 SPA 處理前端 routing（Vue Router 的 history 模式）
  app.get(/^\/(?!api).*/, (req, res) => {
    console.log("捕捉 route：", req.originalUrl);
    res.sendFile(path.join(__dirname, "client/dist", "index.html"));
  });
}
console.log("成功");
const port = process.env.PORT || 5000

console.log("有沒有問題");
app.listen(port, '0.0.0.0',() => {
    console.log(`Server running on port ${port}`)
})

console.log("沒有");
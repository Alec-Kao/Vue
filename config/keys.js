require('dotenv').config(); // 載入 .env 變數

module.exports = {
    mongoURI: process.env.MONGO_URI,
    secretOrKey: process.env.SECRET_OR_KEY
};
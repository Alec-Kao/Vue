// @login & register
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const keys = require("../../config/keys")
const passport = require("passport");

const User = require("../../models/User")

// $route GET api/users/test
// @desc 返回請求的 json 數據
// @access Public
router.get("/test", (req,res) => {
    res.json({msg:"login works"})
})

// $route POST api/users/register
// @desc 返回請求的 json 數據
// @access Public
router.post("/register", (req,res) =>{
    // console.log(req.body);

    // 查詢資料庫中是否擁有 email
    User.findOne({email:req.body.email})
        .then((user) => {
            if (user) {
                return res.status(400).json("帳號已被註冊");
            } else {
                var avatar = gravatar.url(req.body.email, {s:'200', r: 'pg', d: 'mm'});

                const newUser = new User ({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password,
                    identity: req.body.identity
                })
                
                const saltRounds = 10;

                bcrypt.genSalt(saltRounds, function(err, salt) {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        // Store hash in your password DB.
                        if (err) throw err;

                        newUser.password = hash;
                        newUser.save()
                               .then(user => res.json(user))
                               .catch(err => console.log(err));
                    });
                });
            }
        })
})

// $route POST api/users/login
// @desc 返回 token jwt(JSON Web Token) passport
// @access Public

router.post("/login", (req,res) => {
    const email = req.body.email;
    const password = req.body.password;
    // 資料庫查詢
    User.findOne({email})
        .then(user => {
            if(!user){
                return res.status(404).json("帳號不存在")
            }
            
            // 密碼匹配
            bcrypt.compare(password, user.password).then(isMatch => {
                if(isMatch){
                    const rule = {
                        id: user.id, 
                        name: user.name,
                        avatar: user.avatar,
                        identity: user.identity
                    };
                    // jwt.sign("規則", "加密名字", "過期時間", "箭頭函數");
                    jwt.sign(rule, keys.secretOrKey, {expiresIn: 3600}, (err, token) => { 
                        if (err) throw err;
                        
                        res.json({
                            success:true,
                            token:"Bearer " + token
                        });
                    }); 
                    // res.json({msg:"success"});
                } else {
                    return res.status(400).json("密碼錯誤")
                }
            })
        })
})

// $route GET api/users/current
// @desc return current user
// @access Private
router.get("/current", passport.authenticate("jwt", {session:false}), (req, res) => { 
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        identity: req.user.identity
    });
})


module.exports = router;
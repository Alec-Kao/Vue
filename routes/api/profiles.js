// @login & register
const express = require("express");
const router = express.Router();
const passport = require("passport");

const Profile = require("../../models/Profile")

// $route GET api/profiles/test
// @desc 返回請求的 json 數據
// @access Public
router.get("/test", (req,res) => {
    res.json({msg:"profile works"})
})

// $route  Post api/profiles/add
// @desc   創建資訊接口
// @access Public
router.post("/add", passport.authenticate("jwt", {session:false}), (req, res) => {
    const profileFields = {};

    if (req.body.type) profileFields.type = req.body.type;
    if (req.body.describe) profileFields.describe = req.body.describe;
    if (req.body.income) profileFields.income = req.body.income;
    if (req.body.expend) profileFields.expend = req.body.expend;
    if (req.body.cash) profileFields.cash = req.body.cash;
    if (req.body.remark) profileFields.remark = req.body.remark;

    new Profile(profileFields).save().then(profile => {
        res.json(profile);
    })
})

// $route  Post api/profiles/edit/:id
// @desc   編輯資訊接口
// @access Public
router.post("/edit/:id", passport.authenticate("jwt", {session:false}), (req, res) => {
    const profileFields = {};

    if (req.body.type) profileFields.type = req.body.type;
    if (req.body.describe) profileFields.describe = req.body.describe;
    if (req.body.income) profileFields.income = req.body.income;
    if (req.body.expend) profileFields.expend = req.body.expend;
    if (req.body.cash) profileFields.cash = req.body.cash;
    if (req.body.remark) profileFields.remark = req.body.remark;

    Profile.findOneAndUpdate(
        {_id: req.params.id},
        {$set: profileFields},
        {new: true},
    ).then(profile => res.json(profile))
})

// $route  Post api/profiles/delete/:id
// @desc   刪除資訊接口
// @access Public

router.delete("/delete/:id", passport.authenticate("jwt", {session:false}), 
    (req,res) => {
        // Profile.findOneAndRemove({_id:req.params.id}).then(profile => { // 舊版寫法已不可用
        Profile.findOneAndDelete({_id:req.params.id}).then(profile => {
            if (!profile) {
                return res.status(404).json("刪除失敗！找不到此資料");
            }
            res.json(profile);
            // profile.save().then(profile => res.json(profile));
        })
        .catch(err => res.status(404).json("伺服器錯誤!"));
    }
)

// $route GET api/profiles
// @desc 獲得所有資訊
// @access Private

router.get("/", passport.authenticate("jwt", {session:false}), 
    (req,res) => {
        Profile.find()
            .then(profile => {
                if (!profile) {
                    return res.status(404).json("沒有任何內容");
                }

                res.json(profile);
            })
            .catch((err) => res.status(404).json(err));
    }
)

// $route GET api/profiles/:id
// @desc 獲得特定資訊
// @access Private

router.get("/:id", passport.authenticate("jwt", {session:false}), 
    (req,res) => {
        Profile.findOne({_id:req.params.id})
            .then(profile => {
                if (!profile) {
                    return res.status(404).json("沒有任何內容");
                }

                res.json(profile);
            })
            .catch((err) => res.status(404).json(err));
    }
)

module.exports = router;
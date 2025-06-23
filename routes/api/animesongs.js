// @login & register
const express = require("express");
const router = express.Router();
const passport = require("passport");

const AnimeSong = require("../../models/AnimeSong")

// $route GET api/animesongs/search
// @desc 查詢指定條件的資訊
// @access Private
router.get("/search", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { startTime, endTime, type, describe, workName, category, rating } = req.query;
    const filter = {};

    // 根據時間條件加入查詢
    if (startTime && endTime) {
        filter.date = {
            $gte: new Date(startTime),
            $lte: new Date(endTime)
        };
    }

    // 加入收支類型條件
    if (type && type !== '全部') {
        filter.type = type;
    }

    if (describe) {
        filter.describe = { $regex: new RegExp(describe, 'i') }; // 'i' for case-insensitive
    }

    if (workName) {
        filter.workName = { $regex: new RegExp(workName, 'i') };
    }

    if (category) {
        filter.category = { $regex: new RegExp(category, 'i') };
    }

    if (rating) {
        filter.rating = rating;
    }

    try {
        const result = await AnimeSong.find(filter).sort({ date: -1 }); // 按建立時間倒序
        res.json(result);
    } catch (err) {
        console.error('查詢錯誤', err);
        res.status(500).json({ message: '伺服器錯誤', error: err.message });
    }
});

// $route GET api/animesongs/test
// @desc 返回請求的 json 數據
// @access Public
router.get("/test", (req,res) => {
    res.json({msg:"animesong works"})
})

// $route  Post api/animesongs/add
// @desc   創建資訊接口
// @access Public
router.post("/add", passport.authenticate("jwt", {session:false}), (req, res) => {
    const profileFields = {};

    if (req.body.workName) profileFields.workName = req.body.workName;
    if (req.body.type) profileFields.type = req.body.type;
    if (req.body.describe) profileFields.describe = req.body.describe;
    if (req.body.rating) profileFields.rating = req.body.rating;
    if (req.body.category) profileFields.category = req.body.category;
    if (req.body.singerOrGroup) profileFields.singerOrGroup = req.body.singerOrGroup;
    if (req.body.songUrl) profileFields.songUrl = req.body.songUrl;

    new AnimeSong(profileFields).save().then(profile => {
        res.json(profile);
    })
})

// $route  Post api/animesongs/edit/:id
// @desc   編輯資訊接口
// @access Public
router.post("/edit/:id", passport.authenticate("jwt", {session:false}), (req, res) => {
    const profileFields = {};

    if (req.body.workName !== undefined) profileFields.workName = req.body.workName;
    if (req.body.type !== undefined) profileFields.type = req.body.type;
    if (req.body.describe !== undefined) profileFields.describe = req.body.describe;
    if (req.body.rating !== undefined) profileFields.rating = req.body.rating;
    if (req.body.category !== undefined) profileFields.category = req.body.category;
    if (req.body.singerOrGroup !== undefined) profileFields.singerOrGroup = req.body.singerOrGroup;
    if (req.body.songUrl !== undefined) profileFields.songUrl = req.body.songUrl;

    AnimeSong.findOneAndUpdate(
        {_id: req.params.id},
        {$set: profileFields},
        {new: true},
    ).then(profile => res.json(profile))
})

// $route  Post api/animesongs/delete/:id
// @desc   刪除資訊接口
// @access Public

router.delete("/delete/:id", passport.authenticate("jwt", {session:false}), 
    (req,res) => {
        AnimeSong.findOneAndDelete({_id:req.params.id}).then(profile => {
            if (!profile) {
                return res.status(404).json("刪除失敗！找不到此資料");
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json("伺服器錯誤!"));
    }
)

// $route GET api/animesongs
// @desc 獲得所有資訊
// @access Private

router.get("/", passport.authenticate("jwt", {session:false}), 
    (req,res) => {
        AnimeSong.find()
            .then(profile => {
                if (!profile) {
                    return res.status(404).json("沒有任何內容");
                }

                res.json(profile);
            })
            .catch((err) => res.status(404).json(err));
    }
)

// $route GET api/animesongs/:id
// @desc 獲得特定資訊
// @access Private

router.get("/:id", passport.authenticate("jwt", {session:false}), 
    (req,res) => {
        AnimeSong.findOne({_id:req.params.id})
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
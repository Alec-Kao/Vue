// @login & register
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const keys = require("../../config/keys")
const passport = require("passport");

const User = require("../../models/User")
const AnimeSong = require("../../models/AnimeSong")
const PlayList = require("../../models/PlayList")

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
                var avatar = gravatar.url(req.body.email, {s:'200', r: 'pg', d: 'identicon'});

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
        avatar: req.user.avatar,
        identity: req.user.identity
    });
})

// @route   GET api/users/playlists
// @desc    Get user's playlists
// @access  Private
router.get(
  '/playlists',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const playlists = await PlayList.find({ userId: req.user.id })
        .populate('songs')
        .sort({ date: -1 });
      
      res.json({
        success: true,
        playlists: playlists,
        total: playlists.length
      });
    } catch (error) {
      console.error('獲取收藏清單失敗:', error);
      res.status(500).json({ 
        success: false, 
        message: '服務器錯誤',
        error: error.message 
      });
    }
  }
);

// @route   POST api/users/playlists
// @desc    Create a new playlist
// @access  Private
router.post(
  '/playlists',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { name, description } = req.body;
      
      if (!name || name.trim() === '') {
        return res.status(400).json({ message: '收藏清單名稱不能為空' });
      }
      
      // 檢查是否已有同名的收藏清單
      const existingPlaylist = await PlayList.findOne({ 
        userId: req.user.id, 
        name: name.trim() 
      });
      
      if (existingPlaylist) {
        return res.status(400).json({ message: '收藏清單名稱已存在' });
      }
      
      const newPlaylist = new PlayList({
        name: name.trim(),
        description: description || '',
        userId: req.user.id,
        songs: []
      });
      
      const savedPlaylist = await newPlaylist.save();
      
      res.json({
        success: true,
        playlist: savedPlaylist,
        message: '收藏清單創建成功'
      });
    } catch (error) {
      console.error('創建收藏清單失敗:', error);
      res.status(500).json({ 
        success: false, 
        message: '服務器錯誤',
        error: error.message 
      });
    }
  }
);

// @route   POST api/users/playlists/:playlistId/songs/:songId
// @desc    Add or remove a song from playlist
// @access  Private
router.post(
  '/playlists/:playlistId/songs/:songId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { playlistId, songId } = req.params;
      
      // 檢查收藏清單是否存在且屬於當前用戶
      const playlist = await PlayList.findOne({ 
        _id: playlistId, 
        userId: req.user.id 
      });
      
      if (!playlist) {
        return res.status(404).json({ message: '收藏清單不存在' });
      }
      
      // 檢查歌曲是否存在
      const song = await AnimeSong.findById(songId);
      if (!song) {
        return res.status(404).json({ message: '歌曲不存在' });
      }
      
      // 檢查歌曲是否已在收藏清單中
      const songIndex = playlist.songs.indexOf(songId);
      let message = '';
      
      if (songIndex > -1) {
        // 從收藏清單中移除
        playlist.songs.splice(songIndex, 1);
        message = '已從收藏清單中移除';
      } else {
        // 添加到收藏清單
        playlist.songs.push(songId);
        message = '已添加到收藏清單';
      }
      
      await playlist.save();
      
      res.json({
        success: true,
        message: message,
        playlist: playlist
      });
    } catch (error) {
      console.error('操作收藏清單失敗:', error);
      res.status(500).json({ 
        success: false, 
        message: '服務器錯誤',
        error: error.message 
      });
    }
  }
);

// @route   GET api/users/playlists/:playlistId/songs
// @desc    Get songs in a playlist
// @access  Private
router.get(
  '/playlists/:playlistId/songs',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { playlistId } = req.params;
      
      const playlist = await PlayList.findOne({ 
        _id: playlistId, 
        userId: req.user.id 
      }).populate('songs');
      
      if (!playlist) {
        return res.status(404).json({ message: '收藏清單不存在' });
      }
      
      res.json({
        success: true,
        playlist: playlist,
        songs: playlist.songs,
        total: playlist.songs.length
      });
    } catch (error) {
      console.error('獲取收藏清單歌曲失敗:', error);
      res.status(500).json({ 
        success: false, 
        message: '服務器錯誤',
        error: error.message 
      });
    }
  }
);

// @route   PUT api/users/playlists/:playlistId
// @desc    Update a playlist
// @access  Private
router.put(
  '/playlists/:playlistId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { playlistId } = req.params;
      const { name, description } = req.body;
      
      if (!name || name.trim() === '') {
        return res.status(400).json({ message: '收藏清單名稱不能為空' });
      }
      
      const playlist = await PlayList.findOne({ 
        _id: playlistId, 
        userId: req.user.id 
      });
      
      if (!playlist) {
        return res.status(404).json({ message: '收藏清單不存在' });
      }
      
      // 檢查是否已有同名的收藏清單（排除當前編輯的清單）
      const existingPlaylist = await PlayList.findOne({ 
        userId: req.user.id, 
        name: name.trim(),
        _id: { $ne: playlistId }
      });
      
      if (existingPlaylist) {
        return res.status(400).json({ message: '收藏清單名稱已存在' });
      }
      
      playlist.name = name.trim();
      playlist.description = description || '';
      
      const updatedPlaylist = await playlist.save();
      
      res.json({
        success: true,
        playlist: updatedPlaylist,
        message: '收藏清單更新成功'
      });
    } catch (error) {
      console.error('更新收藏清單失敗:', error);
      res.status(500).json({ 
        success: false, 
        message: '服務器錯誤',
        error: error.message 
      });
    }
  }
);

// @route   DELETE api/users/playlists/:playlistId
// @desc    Delete a playlist
// @access  Private
router.delete(
  '/playlists/:playlistId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { playlistId } = req.params;
      
      const playlist = await PlayList.findOne({ 
        _id: playlistId, 
        userId: req.user.id 
      });
      
      if (!playlist) {
        return res.status(404).json({ message: '收藏清單不存在' });
      }
      
      await PlayList.findByIdAndDelete(playlistId);
      
      res.json({
        success: true,
        message: '收藏清單已刪除'
      });
    } catch (error) {
      console.error('刪除收藏清單失敗:', error);
      res.status(500).json({ 
        success: false, 
        message: '服務器錯誤',
        error: error.message 
      });
    }
  }
);


module.exports = router;
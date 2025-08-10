const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const PlayListSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    songs: [{
        type: Schema.Types.ObjectId,
        ref: 'animesongs'
    }],
    isDefault: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: () => new Date(),
        index: true
    }
})

module.exports = PlayList = mongoose.model("playlists", PlayListSchema) 
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const AnimeSongSchema = new Schema({
    workName: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    describe: {
        type: String
    },
    rating: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    singerOrGroup: {
        type: String
    },
    songUrl: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        // default: Date.now
        default: () => new Date(),
        index: true
    }
})

module.exports = AnimeSong = mongoose.model("animesong", AnimeSongSchema)
var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
    avatar: String,
    author: String,
    body: String,
    votes: {type: Number, default: 0},
    reports: {type: Number, default: 0},
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Post", postSchema);
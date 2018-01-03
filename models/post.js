var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
    avatar: String,
    author: String,
    body: String,
    reports: {type: Number, default: 0},
    date: {type: Date, default: Date.now},
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

module.exports = mongoose.model("Post", postSchema);
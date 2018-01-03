var mongoose = require("mongoose");
var Post = require("./models/post");
var Comment = require("./models/comment");
var Report = require("./models/report");

function purgeDB(){
    //Post.updateMany({}, {$set: {reports: 0}}).then((results) => console.log(results)).catch((err)=>console.log(err));
    //Post.remove({}).then(console.log("Removed all posts")).catch((err) => console.log(err.message));
    //Comment.remove({}).then(console.log("Removed all Comments")).catch((err) => console.log(err.message));
    //Report.remove({}).then(console.log("Removed all Reports")).catch((err) => console.log(err.message));
    //Report.find({}).then((reports) => console.log(reports)).catch((err) => console.log(err.message));
}

module.exports = purgeDB;
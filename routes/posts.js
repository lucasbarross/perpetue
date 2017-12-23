var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var router = express.Router();
var randomName = require('random-name');
var Post = require("../models/post.js");
var request = require("request");

mongoose.Promise = Promise;

function getAllPosts(req,res){
    Post.find({}).sort({date: -1}).limit(25)
    .exec()
    .then((posts) => res.render("posts", {posts: posts}))
    .catch((err) => res.json({message: "Error getting posts from database."}))
}

function getPostsFrom(req, res){
    Post.find({_id: {$lt: req.query.from}}).sort({date: -1}).limit(25)
    .exec()
    .then((posts) => res.json({responseCode: 0, posts: posts}))
    .catch((err) => res.json({responseCode: -1, responseDesc: "Error getting posts from database."}));
}

function randNumber(max){
    return Math.floor(Math.random() * max);
}

function createPost(req,res){
    var captchaResponse = req.body['g-recaptcha-response'];
    
    if(captchaResponse == undefined || captchaResponse == "" || captchaResponse == null){
        return res.json({"responseCode": -1, "responseDesc": "Please complete captcha."});
    }

    if(req.body.message == '' || req.body.message == undefined || req.body.message == null){
        return res.json({"responseCode": -2, "responseDesc": "Write your message before sending!"})
    }
    
    var secretKey = "6LeQFT4UAAAAAG1ZiBSZOdNuY5gkF8SK-2CClcuY";
    var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?" + 
    "secret=" + secretKey + 
    "&response=" + captchaResponse + 
    "&remoteip=" + req.connection.remoteAddress;

    request(verificationUrl, function(error, response, body){
        body = JSON.parse(body);
        if(body.success != undefined && body.success){
            var message = req.body.message;
            var genres = ["male", "female"];
            var name = randomName.first() + " " + randomName.last();
            var avatar = "http://eightbitavatar.herokuapp.com/?id="+randNumber(1000000)+"&s="+genres[randNumber(1)]+"&size=100";
            var newPost = { 
                            avatar: avatar,
                            author: name,
                            body: message,
                        }
            Post.create(newPost)
            .catch(function(err){ return res.json({"responseCode": -2, "responseDesc": "Error when trying to communicate with database."})});
            return res.json({"responseCode": 0, "responseDesc": "Thanks for leaving your message!", "randomName": name, "avatar": avatar, "message": message});
        } else {
            return res.json({"responseCode": -1, "responseDesc": "Error validating captcha."})
        }
    })
}

router.get("/", getAllPosts);
router.get("/load", getPostsFrom);
router.post("/", createPost);

module.exports = router;
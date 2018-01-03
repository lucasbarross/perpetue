var Post = require("../models/post.js");
var Report = require("../models/report.js");
var mongoose =  require('mongoose');
var bodyParser = require("body-parser");
var grecaptcha = require("../custom_modules/grecaptcha.js");
var userinfo = require("../custom_modules/userinfo");
var config = require("../config.js")

var Hashids = require("hashids");
var hashids = new Hashids('Perpetue');

function hash(posts){
    posts.forEach((post)=>{
        post.hashid = hashids.encodeHex(post._id);
    })
    return posts;
}

module.exports = {
    getAllPosts: function (req,res){
                    Post.find({}).sort({date: -1}).limit(6)
                    .exec()
                    .then((posts) => {
                        posts = hash(posts);
                        Promise.all(posts.map((post) => {
                            return Report.findOne({ip: req.connection.remoteAddress, post_id: post._id});
                        }))
                        .then((results) => {
                            for(i = 0; i < results.length; i++){
                                if(results[i] != undefined){
                                    posts[i].reported = true;
                                }
                            }
                            res.render("posts", {posts: posts, config: config});
                        })
                    })
                    .catch((err) => res.json({message: err.message}))
                },
    getPostsFrom: function (req, res){ 
                    let from = hashids.decodeHex(req.query.from);
                    Post.find({_id: {$lt: from}}).sort({date: -1}).limit(6)
                    .exec()
                    .then((posts) => {
                        var postsConverted = [];
                        posts.forEach((post)=>{
                            var s = post.toObject();
                            s['hashid'] = hashids.encodeHex(post._id);
                            postsConverted.push(s);
                        })
                        Promise.all(postsConverted.map((post) => {
                            return Report.findOne({ip: req.connection.remoteAddress, post_id: post._id});
                        }))
                        .then((results) => {
                            for(i = 0; i < results.length; i++){
                                if(results[i] != undefined){
                                    postsConverted[i].reported = true;
                                }
                            }
                            res.json({responseCode: 0, posts: postsConverted, maxReports: config.maxReports}) 
                        })
                    })
                    .catch((err) => console.log(err.message));
                },
    createPost: function (req,res){
                    let captchaResponse = req.body['g-recaptcha-response'];
                    let ip = req.connection.remoteAddress;
                    console.log(req.connection.remoteAddress);
                    console.log(req.ip);
                    if(req.body.message == '' || req.body.message == undefined || req.body.message == null){
                        return res.json({"responseCode": -2, "responseDesc": "Write your message before sending!"})
                    }

                    if(req.body.message.length > config.maxMsgLength){
                        return res.json({"responseCode": -3, "responseDesc": "Your message is too long!"});
                    }
                    
                    grecaptcha.valid_captcha(captchaResponse, ip)
                    .then(function insertPost(){
                            let user = userinfo.generateUser(ip);
                            let message = req.body.message;
                            let avatar = "http://eightbitavatar.herokuapp.com/?id="+user.ipHash+"&s="+user.genre+"&size=100";
                            let newPost = { 
                                            avatar: avatar,
                                            author: user.name,
                                            body: message,
                                        }
                            return Post.create(newPost)
                    })
                    .then((post) =>  res.json({"responseCode": 0, "responseDesc": "Thanks for leaving your message!", "author": post.author, "avatar": post.avatar, "body": post.body, "reports": 0, "hashid": hashids.encodeHex(post._id), "maxReports": config.maxReports}))
                    .catch((err) => res.json({"responseCode": -1, "responseDesc": err.message}));
                }
}
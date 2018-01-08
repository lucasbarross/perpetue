var Comment = require("../models/comment");
var Post = require("../models/post")
var Report = require("../models/report")
var mongoose =  require('mongoose');
var bodyParser = require('body-parser');
var grecaptcha = require("../custom_modules/grecaptcha");
var config = require("../config.js");
var userinfo = require("../custom_modules/userinfo");
var ipfetcher = require("../custom_modules/ipfetcher");
var Hashids = require("hashids");
var hashids = new Hashids('Perpetue');

function hash(comments){
    comments.forEach((comment)=>{
        comment.hashid = hashids.encodeHex(comment._id);
    })
    return comments;
}

function createComment(ip, message){
    var user = userinfo.generateUser(ip);
    var avatar = "http://eightbitavatar.herokuapp.com/?id="+user.ipHash+"&s="+user.genre+"&size=100";
    var newcomment = { 
                    avatar: avatar,
                    author: user.name,
                    body: message,
                }
    return Comment.create(newcomment);
}

module.exports = {
    getComments: function (req,res){
                    var ipv = ipfetcher.getIp(req);

                    Post.findById(hashids.decodeHex(req.params.id)).populate("comments")
                    .exec()
                    .then((post) => {
                        post.hashid = hashids.encodeHex(post._id);
                        post.comments = hash(post.comments);
                        
                        var queries = post.comments.map((comment) => {
                            return Report.findOne({ip: ipv, post_id: comment._id});
                        });
                        
                        queries.push(Report.findOne({ip: ipv, post_id: post._id}));
                        
                        Promise.all(queries)
                        .then((results) => {
                            for(i = 0; i < results.length-1; i++){
                                if(results[i] != undefined){
                                    post.comments[i].reported = true;
                                }
                            }
                            
                            if(results[results.length-1] != undefined){
                                post["reported"] = true;
                            }
                            res.render("show", {post: post, config: config});
                        })
                    })
                    .catch((err) => res.status(404).send(err.message));    
                },
    createComment: function (req,res){
                    var captchaResponse = req.body['g-recaptcha-response'];
                    var ip = ipfetcher.getIp(req);

                    if(req.body.message == '' || req.body.message == undefined || req.body.message == null){
                        return res.json({"responseCode": -2, "responseDesc": "Write your message before sending!"})
                    }
                    
                    if(req.body.message.length > config.maxMsgLength){
                        return res.json({"responseCode": -3, "responseDesc": "Your message is too long!"});
                    }

                    var comment;
                    
                    grecaptcha.valid_captcha(captchaResponse, ip)
                    .then(() => Promise.all([Post.findById(hashids.decodeHex(req.params.id)), createComment(ip, req.body.message)]))
                    .then((values) => {
                        comment = values[1];
                        values[0].comments.push(comment);
                        return values[0].save();
                    })
                    .then((post) =>  res.json({"responseCode": 0, "responseDesc": "Thanks for leaving your message!", "author": comment.author, "avatar": comment.avatar, "body": comment.body, "reports": 0, "hashid": hashids.encodeHex(comment._id), "maxReports": config.maxReports}))
                    .catch((err) => res.json({"responseCode": -1, "responseDesc": err.message}));
                }
}
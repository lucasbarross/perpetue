var Report = require("../models/report.js");
var Comment = require("../models/comment.js");
var Post = require("../models/post.js");
var mongoose =  require('mongoose');
var grecaptcha = require("../custom_modules/grecaptcha.js");

var Hashids = require("hashids");
var hashids = new Hashids('Perpetue');

module.exports = {
    reportPost: function(req, res){
                    var ipv = req.headers['x-forwarded-for'] ||
                    req.connection.remoteAddress ||
                    req.socket.remoteAddress ||
                    req.connection.socket.remoteAddress;

                    grecaptcha.valid_captcha(req.body['g-recaptcha-response'], ipv)
                    .then(() => { return Report.find({ip: ipv, post_id: hashids.decodeHex(req.params.id)}).limit(1).exec() })
                    .then((report) => {
                        if(!report.length){
                            return Report.create({ip: ipv, post_id: hashids.decodeHex(req.params.id)});
                        } else {
                            throw new Error("You've already reported this post.");
                        }
                    })
                    .then((report) => { return Post.findById(report.post_id)})
                    .then((post) => {
                        post.reports += 1;
                        return post.save();
                    })
                    .then((post) => {res.json({"responseCode": 0, "responseDesc": post.author + "'s comment was reported."})})
                    .catch((err) => res.json({"responseCode": -5, "responseDesc": err.message}));
                },
    reportComment: function(req, res){
                    var ipv = req.headers['x-forwarded-for'] ||
                    req.connection.remoteAddress ||
                    req.socket.remoteAddress ||
                    req.connection.socket.remoteAddress;

                    grecaptcha.valid_captcha(req.body['g-recaptcha-response'], ipv)
                    .then(() => { return Report.find({ip: ipv, post_id: hashids.decodeHex(req.params.id)}).limit(1).exec()})
                    .then((report) => {
                        if(!report.length){
                            return Report.create({ip: ipv, post_id: hashids.decodeHex(req.params.id)});
                        } else {
                            throw new Error("You've already reported this comment.");
                        }
                    })
                    .then((report) => { return Comment.findById(report.post_id)})
                    .then((comment) => {
                        comment.reports += 1;
                        return comment.save();
                    })
                    .then((comment) => {res.json({"responseCode": 0, "responseDesc": comment.author + "'s comment was reported."})})
                    .catch((err) => res.json({"responseCode": -5, "responseDesc": err.message}));
                },
    
}
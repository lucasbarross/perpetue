var express = require("express");
var router = express.Router();
var controller = require("../controllers/posts.js");

router.route("/")
      .get(controller.getAllPosts)
      .post(controller.createPost);

router.route("/load")
      .get(controller.getPostsFrom);

module.exports = router;
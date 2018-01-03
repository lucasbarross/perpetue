var express = require("express");
var router = express.Router();
var controller = require("../controllers/comments.js");

router.route("/:id/comments")
      .get(controller.getComments)
      .post(controller.createComment);

module.exports = router;
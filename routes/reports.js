var express = require("express");
var router = express.Router();
var controller = require("../controllers/reports.js");

router.route("/:id/report")
      .post(controller.reportPost);

router.route("/:id/comment/report")
      .post(controller.reportComment)
      
module.exports = router;
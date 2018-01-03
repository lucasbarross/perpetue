var mongoose = require("mongoose");

var reportSchema = new mongoose.Schema({
    ip: String,
    post_id: String
});

module.exports = mongoose.model("Report", reportSchema);
var bodyParser  = require("body-parser")
    mongoose    = require("mongoose"),
    express     = require("express"),
    config      = require("./config.js");
    //purgeDB     = require("./seeds.js");

var postsRoutes = require("./routes/posts"),
    indexRoutes = require("./routes/index");
    commentsRoutes = require("./routes/comments")
    reportsRoutes = require("./routes/reports");

mongoose.Promise = Promise;

app = express();
mongoose.connect(config.mongo.url, { useMongoClient: true }).catch((err) => console.log(err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(indexRoutes);
app.use("/posts", postsRoutes);
app.use("/posts", commentsRoutes);
app.use("/posts", reportsRoutes);
//purgeDB();

var server_port = process.env.OPENSHIFT_NODE4_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODE4_IP || '127.0.0.1'

app.listen(server_port, server_ip_address, function(){
    console.log("connected");
});
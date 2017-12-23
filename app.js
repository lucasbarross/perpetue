var bodyParser  = require("body-parser")
    mongoose    = require("mongoose")
    randomName  = require("random-name"),
    express     = require("express"),
    Post        = require("./models/post");

var postsRoutes = require("./routes/posts");
var indexRoutes = require("./routes/index");

app = express();
mongoose.connect("mongodb://localhost/perpetue", { useMongoClient: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(indexRoutes);
app.use("/posts", postsRoutes);

// var message = "aaaaaaaaaaaaaaaaa";
// var genres = ["male", "female"];
// var newPost = { 
//                 avatar: "http://eightbitavatar.herokuapp.com/?id="+10002+"&s="+genres[0]+"&size=100",
//                 author: randomName.first() + " " + randomName.last(),
//                 body: message,
//             }
// Post.create(newPost)
// .catch((err) => console.log(err));
// app.listen(process.env.PORT, process.env.IP);
app.listen(1002, 'localhost', function(){
    console.log("connected");
});
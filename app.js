var express=require("express");
var app=express();
//mongoose
var mongoose=require("mongoose");
var passport=require("passport");
var localStrategy=require("passport-local");
var passportLocalMongoose=require("passport-local-mongoose");
var methodOverride=require("method-override");
var flash=require("connect-flash");
app.use(methodOverride("_method"));

// mongoose.connect("mongodb://localhost/daiictdoubtapp");
mongoose.connect("mongodb://milek:test123@ds123513.mlab.com:23513/daiictdoubtportal");

var Question=require("./models/question");
var Answer=require("./models/answer")
var User=require("./models/user");
// var seedDB=require("./seeds");
//seedDB();  //execute seedDB() function


var queRoutes=require("./routes/queroutes");
var answerRoutes=require("./routes/answerroutes");
var userRoutes=require("./routes/userroutes");

app.set("view engine","ejs");
app.use(express.static("public"));
var bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
var session=require("express-session");

app.use(session({
    secret: "13 reason why u will not catch me",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash());
// a middleware to pass currentuser to every renders
app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});

app.use("/question",queRoutes);
app.use("/question/:id/answers",answerRoutes);
app.use("/",userRoutes);

// request listener
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("server started");
})
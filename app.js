var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var passport = require("passport");
var passportLocal = require("passport-local");
var expressSession = require("express-session");
var User = require("./models/user");
var methodOverride = require("method-override");
var flash = require("connect-flash");

var indexRoutes = require('./routes/index');
var artcraftRoutes = require('./routes/artcraft');
var commentRoutes = require('./routes/comments');


mongoose.connect("mongodb://localhost/artcraft");
app.use(flash());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.use(expressSession({
    secret: "Art and Craft are really an interesting thing",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use("/", indexRoutes);
app.use("/artcraft", artcraftRoutes);
app.use("artcraft/:id/comments", commentRoutes);


// app.listen(process.env.PORT, process.env.IP, function(){
//    console.log("The YelpCamp Server Has Started!");
// });

app.listen(3000, function(){
console.log("Pictureich server is running! ");
});
var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");


router.get("/", function(req, res){
    res.redirect('/artcraft');
});

router.get("/register", function(req, res){
    res.render("register"); 
});

router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	if(req.body.admincode === "12345"){
    	newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
		if(err){
				req.flash("error", err.message);
				return res.redirect("/register");
		}                 
		passport.authenticate("local")(req, res, function(){
				req.flash("success", "Welcome to Art & Craft");
				res.redirect("/artcraft");
		});
    });
});

router.get("/login", function(req, res){
    res.render("login"); 
});

router.post("/login", function (req, res, next) {
  passport.authenticate("local",
    {
      successRedirect: "/artcraft",
      failureRedirect: "/login",
      failureFlash: true,
      successFlash: "Welcome , " + req.body.username + "!"
    })(req, res);
});

router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Succesfully logged out");
    res.redirect("/artcraft");
});


module.exports = router;